import { Client, Intents } from "discord.js";
import { config as dotenv } from "dotenv";
import { readdirSync } from "fs";
import { Command } from "./structures/command";
import { db } from "./structures/db";
import { cooldowns } from "./structures/cooldowns";
import { clampSlowmode, getMpm } from "./lib";
dotenv();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Map<string, Command>();
readdirSync("./dist/commands")
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.default.data.name, command.default);
  });

client.once("ready", () => {
  console.info("Logged in!");
  console.info(`Tag: ${client.user?.tag}`);
  console.info(`Client ID: ${client.user?.id}`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command)
    return console.warn(
      `Application Command "${interaction.commandName}" doesn't exist.`
    );
  command.execute(interaction);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== "GUILD_TEXT") return;
  if (cooldowns.has(message.channelId)) return;

  cooldowns.add(message.channelId);
  setTimeout(() => {
    cooldowns.delete(message.channelId);
  }, 5000);

  const rules = await db.rule.findMany({
    where: {
      channelId: message.channelId,
    },
  });
  if (!rules.length) return;

  const mpm = getMpm(message.channel);
  const targetRule = rules.reduce((highest, current) =>
    current.threshold >= mpm && current.threshold > highest.threshold
      ? current
      : highest
  );
  const targetSlowmode =
    mpm > targetRule.threshold ? clampSlowmode(targetRule.slowmode) : 0;
  await message.channel.setRateLimitPerUser(targetSlowmode);
});

client.login(process.env.BOT_TOKEN);

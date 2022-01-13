import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import { Command } from "../structures/command";
import { db } from "../structures/db";

export default {
  data: new SlashCommandBuilder()
    .setName("clearrules")
    .setDescription("Clears all rules in the specified channel.")
    .addChannelOption(
      (option) =>
        option
          .setName("channel")
          .setDescription(
            "The channel to clear the rules of. Defaults to the current channel if none specified."
          )
          .addChannelType(0) // GuildText
    ),
  execute: async (interaction) => {
    const channel =
      (interaction.options.getChannel("channel") as TextChannel | null) ??
      (interaction.channel as TextChannel);

    await Promise.all([
      db.rule.deleteMany({
        where: {
          channelId: channel.id,
        },
      }),
      db.channel.delete({
        where: {
          id: channel.id,
        },
      }),
    ]);

    interaction.reply(`Rules for ${channel} successfully cleared.`);
  },
} as Command;

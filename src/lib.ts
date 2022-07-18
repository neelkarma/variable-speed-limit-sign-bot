import { ChannelType, Message, TextChannel } from "discord.js";
import { cooldowns } from "./structures/cooldowns";
import { db } from "./structures/db";

export const getMpm = (channel: TextChannel) =>
  channel.messages.cache
    .map((message) => Date.now() - message.createdTimestamp)
    .filter((ms) => ms <= 60000).length;

export const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(num, max));

export const clampSlowmode = (slowmode: number) => clamp(slowmode, 0, 21600);

export const messageCreateEvent = async (message: Message) => {
  if (message.author.bot) return;
  if (message.channel.type !== ChannelType.GuildText) return;
  if (cooldowns.has(message.channelId)) return;

  cooldowns.add(message.channelId);
  setTimeout(() => {
    cooldowns.delete(message.channelId);
    messageCreateEvent(message);
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
};

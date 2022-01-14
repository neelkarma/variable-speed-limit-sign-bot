import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import { Command } from "../structures/command";
import { db } from "../structures/db";

export default {
  data: new SlashCommandBuilder()
    .setName("showrules")
    .setDescription("Lists rules in the specified channel.")
    .addChannelOption(
      (option) =>
        option
          .setName("channel")
          .setDescription(
            "The channel to list the rules of. Defaults to the current channel if none specified."
          )
          .addChannelType(0) // GuildText
    ),
  execute: async (interaction) => {
    await interaction.deferReply();

    const channel =
      (interaction.options.getChannel("channel") as TextChannel | null) ??
      (interaction.channel as TextChannel);

    const rules = (
      await db.rule.findMany({
        where: {
          channelId: channel.id,
        },
      })
    ).sort(({ threshold: a }, { threshold: b }) => a - b);

    if (!rules.length)
      return await interaction.editReply(
        `There are no rules for ${channel}! Try creating one with \`/addrule\`!`
      );

    interaction.editReply(
      `Rules for ${channel}:\n${rules
        .map(
          ({ threshold, slowmode }) =>
            ` - Set slowmode to ${slowmode} seconds when there are ${threshold} or more messages per minute.`
        )
        .join("\n")}`
    );
  },
} as Command;

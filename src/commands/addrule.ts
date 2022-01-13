import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import { Command } from "../structures/command";
import { db } from "../structures/db";

export default {
  data: new SlashCommandBuilder()
    .setName("addrule")
    .setDescription("Adds a new rule to this channel.")
    .addIntegerOption((option) =>
      option
        .setName("threshold")
        .setDescription(
          "Sets the threshold in messages per minute for this rule."
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("slowmode")
        .setDescription("The slowmode value in seconds for this rule.")
        .setRequired(true)
    )
    .addChannelOption(
      (option) =>
        option
          .setName("channel")
          .setDescription(
            "The channel to apply the rule to. Defaults to the current channel if none specified."
          )
          .addChannelType(0) // GuildText
    ),
  execute: async (interaction) => {
    const threshold = interaction.options.getInteger("threshold")!;
    const slowmode = interaction.options.getInteger("slowmode")!;
    const channel =
      (interaction.options.getChannel("channel") as TextChannel | null) ??
      (interaction.channel as TextChannel);

    await db.channel.upsert({
      create: {
        id: channel.id,
      },
      update: {},
      where: {
        id: channel.id,
      },
    });

    await db.rule.upsert({
      create: {
        id: `${channel.id}:${threshold}`,
        threshold,
        slowmode,
        channelId: channel.id,
      },
      update: {
        slowmode,
      },
      where: {
        id: `${channel.id}:${threshold}`,
      },
    });

    interaction.reply(
      `New rule added to ${channel}: Set slowmode to ${slowmode} seconds when there are ${threshold} or more messages per minute.`
    );
  },
} as Command;

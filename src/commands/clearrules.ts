import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel, Permissions } from "discord.js";
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
    if (
      !interaction.memberPermissions?.has([
        Permissions.FLAGS.MANAGE_MESSAGES,
        Permissions.FLAGS.MANAGE_CHANNELS,
      ])
    )
      return await interaction.reply(
        "You don't have the sufficient permissions to execute this command!"
      );

    await interaction.deferReply();

    const channel =
      (interaction.options.getChannel("channel") as TextChannel | null) ??
      (interaction.channel as TextChannel);

    await db.rule.deleteMany({
      where: {
        channelId: channel.id,
      },
    });

    if (
      interaction.channel?.type === "GUILD_TEXT" &&
      interaction.channel?.rateLimitPerUser !== 0
    )
      await interaction.channel.setRateLimitPerUser(0);

    interaction.editReply(`Rules for ${channel} successfully cleared.`);
  },
} as Command;

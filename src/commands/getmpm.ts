import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import { Command } from "structures/command";
import { getMpm } from "../lib";

export default {
  data: new SlashCommandBuilder()
    .setName("getmpm")
    .setDescription("Gets the messages per minute for the specified channel.")
    .addChannelOption(
      (option) =>
        option
          .setName("channel")
          .setDescription(
            "The channel to get the MPM of. Defaults to the current channel if none specified."
          )
          .addChannelType(0) // GuildText
    ),
  execute: async (interaction) => {
    const channel =
      (interaction.options.getChannel("channel") as TextChannel | null) ??
      (interaction.channel as TextChannel);

    interaction.reply(
      `The channel ${channel} has a MPM of ${getMpm(channel)}.`
    );
  },
} as Command;

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../structures/command";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("This command helps."),
  execute: async (interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Variable Speed Limit Sign Operational Manual")
          .setDescription(
            "This bot lets you set rules to adaptively change the slowmode for a channel depending on it's activity.\n\nCommands:"
          )
          .addFields(
            {
              name: "/setrule",
              value:
                'Adds a new rule or overwrites an existing rule for a channel.\n*The user requires the "Manage Messages" or "Manage Channels" permissions to use this command.*',
            },
            {
              name: "/clearrules",
              value:
                'Clears the rules for a channel.\n*The user requires the "Manage Messages" or "Manage Channels" permissions to use this command.*',
            },
            {
              name: "/showrules",
              value: "Shows the rules for a channel.",
            },
            {
              name: "/getmpm",
              value:
                "Gets the current MPM (messages per minute) of a channel. Mainly for debug purposes, but it can be used for fun.",
            }
          ),
      ],
    });
  },
} as Command;

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

const {
  BOT_TOKEN: token,
  BOT_CLIENT_ID: clientId,
  DEV_GUILD_IDS: guildIds,
} = process.env;

const rest = new REST({ version: "9" }).setToken(token);

Promise.all(
  guildIds.split(",").map(async (guildId) => {
    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: [],
      });

      console.log(
        `Successfully undeployed slash commands for guild ID ${guildId}`
      );
    } catch (error) {
      console.error(error);
    }
  })
);

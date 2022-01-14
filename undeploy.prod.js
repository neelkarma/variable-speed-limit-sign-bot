const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

const { BOT_TOKEN: token, BOT_CLIENT_ID: clientId } = process.env;

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(clientId), {
      body: [],
    });

    console.log("Successfully undeployed slash commands globally.");
  } catch (error) {
    console.error(error);
  }
})();

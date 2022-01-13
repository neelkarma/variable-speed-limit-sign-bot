import { Command } from "structures/command";

declare module "discord.js" {
  interface Client {
    commands: Map<string, Command>;
  }
}

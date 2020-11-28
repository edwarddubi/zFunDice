import { config } from "./config.js";
import Discord from "discord.js";
import {rollDice, initGame, playersReached, instructions} from './game_functions.js'
//const Discord = require("discord.js");

const client = new Discord.Client();

const token = config.botToken;
const initPlay = "Init FunDice";

client.once("ready", () => {
  console.log("zFunDice is now online!");
});
let comps = {
  maxPlayers: 0,
  maxPlays : 3,
  awake : false,
  done : false,
  temp_players : [],
  players : [],
  message : null,
}
client.on("message", (message) => {
  comps["message"] = message;
  if (comps["awake"]) {
    if (message.content.toLowerCase().startsWith("play")) {
     initGame(comps);
    } else if (message.content.toLowerCase().startsWith("start")) {
      playersReached(comps)
    } else if (comps["done"] && message.content.toLowerCase().startsWith("rolldice")) {
      let res = rollDice(comps)
     if(res){
       comps = res
     }
    }
  } else {
    if (
      message.content.toLowerCase().startsWith(initPlay.toLowerCase()) &&
      !message.author.bot
    ) {
      message.channel.send(instructions());
      comps["awake"] = true;
      
    }
  }

  if(comps["awake"] && message.content.toLowerCase().startsWith("quit")){
    comps = {
      maxPlayers: 0,
      maxPlays : 3,
      awake : false,
      done : false,
      temp_players : [],
      players : [],
      message : null,
    }
    return message.channel.send("Awwww ;( Back to sleeping then. Lemme know whenever you wanna play with me.");
  }

  //const args = message.content.slice(initPlay.length).split("#");

  //console.log(args.shift().toLowerCase())
});



client.login(token);

//import { config } from "./config.js";
import Discord from "discord.js";
import {rollDice, initGame, playersReached, instructions} from './game_functions.js'
//const Discord = require("discord.js");

const client = new Discord.Client();


//let token = config.botToken;

const initPlay = "Init FunDice";

client.once("ready", () => {
  console.log("zFunDice is now online!");
});
let comps = {
  maxPlayers: 0,
  maxPlays : 3,
  rounds : 1,
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
     
    } else if (message.content.toLowerCase().startsWith("start") && comps["players"].length > 0) {
      let args = message.content.split(",");
      let round_str = args[1];
      if(!round_str){
        round_str = "3";
      }
      try{
        let count = parseInt(round_str);
        if(count < 1){
          count = 3;
        }else{
          comps["maxPlays"] = count;
        }
        
      }catch(err){
        comps["maxPlays"] = 3
      }
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
      rounds : 1,
      awake : false,
      done : false,
      temp_players : [],
      players : [],
      message : null,
    }
    return message.channel.send("Aw! ;( Back to sleeping. Lemme know whenever you wanna play with me.");
  }

  //const args = message.content.slice(initPlay.length).split("#");

  //console.log(args.shift().toLowerCase())
});


//client.login(token);
client.login(process.env.BOT_TOKEN);

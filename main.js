import { config } from "./config.js";
import Discord from "discord.js";
//const Discord = require("discord.js");

const client = new Discord.Client();

const token = config.botToken;
const initPlay = "Init FunDice";

client.once("ready", () => {
  console.log("zFunDice is now online!");
});
let players = [];
let temp_players = players.slice(0);
let maxPlayers = 0;
let maxPlays = 3;
let round_num = 1;
let awake = false;
let done = false;
client.on("message", (message) => {
  if (awake) {
    if (message.content.toLowerCase().startsWith("play")) {
      maxPlayers += 1;
      let currentPlayer = {
        id: message.author.id,
        username: message.author.username,
        turn: maxPlayers,
        points: 0,
      };
      const name = currentPlayer["username"];
      if (players.length === 0) {
        players.push(currentPlayer);
        message.channel.send(`${name} joined the game!`);
      } else {
        let found = false;
        players.forEach((player) => {
          if (player["id"] === currentPlayer["id"]) {
            found = true;
          }
        });
        if (!found) {
          players.push(currentPlayer);
          message.channel.send(`${name} joined the game!`);
        } else {
          message.channel.send(
            `${name}, hold up! You cannot join a game you're already part of!`
          );
        }
      }
      return;
    } else if (message.content.toLowerCase().startsWith("done")) {
      let team = "Please take turns according to this list:\n";
      let c = 1;
      players.forEach((player) => {
        team += c + ". " + player["username"] + "\n";
        c++;
      });
      team += "This is the beginning of round 1:";
      message.channel.send(team);
      temp_players = players.slice(0);
      done = true;
      return;
    } else if (done && message.content.toLowerCase().startsWith("rolldice")) {
      if (temp_players.length === 0) {
        temp_players = players.slice(0);
        maxPlays -= 1;
        if (maxPlays === 0) {
          let team = "Let's see who got the Crown:\n";
          let c = 1;
          players.forEach((player) => {
            team +=
              c + ". " + player["username"] + ": " + player["points"] + "\n";
            c++;
          });
          const winner_player = winner(players);
          team += winner_player["username"] + " won!!";
          message.channel.send(team);
          awake = false;
          done = false;
          players = [];
          maxPlayers = 0;
          maxPlays = 5;
          temp_players = players.slice(0);
          return;
        } else {
          message.channel.send(`This is the next Round: `);
        }
      }
      console.log("rounds left:", maxPlays);
      console.log("total players:", temp_players.length);
      const id = message.author.id;
      let found = false;
      let c = 0;
      temp_players.forEach((player) => {
        if (player["id"] === id) {
          found = true;
          temp_players.splice(c, 1);
        }
        c++;
      });

      if (found) {
        players.forEach((player) => {
          if (player["id"] === id) {
            const rand = Math.floor(Math.random() * 6) + 1;
            message.channel.send(`${player["username"]}, rolled a ${rand}`);
            player["points"] = player["points"] + rand;
          }
        });
      } else {
        message.channel.send(
          "You need to wait for your turn in the next Round."
        );
      }
    }
  } else {
    if (
      message.content.toLowerCase().startsWith(initPlay.toLowerCase()) &&
      !message.author.bot
    ) {
      message.channel.send(
        `Thanks for waking me up from my slumber.\nRules for the game are:\n1. Players should type "play" to be added to game.\n2. Anyone can type "done" when all participating players have joined.\n3. Now, to start playing, type "rollDice".\n4. You will roll a number between 1-6.\n5. Rounds to be played (3), so players would take turns until each round has ended.\n6. Total number rolled during the game will determine the winner\n6. Play away!! And test how good your RNG is...hahahaha`
      );
      awake = true;
      return;
    }
  }

  //const args = message.content.slice(initPlay.length).split("#");

  //console.log(args.shift().toLowerCase())
});

const winner = (players) => {
  let player = players[0];
  players.forEach((element) => {
    if (player["points"] < element["points"]) {
      player = element;
    }
  });

  return player;
};

client.login(token);

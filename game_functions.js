const instructions = () => {
  return `Thanks for waking me up from my slumber.\nRules for the game are:\n1. Players should type "play" to be added to the game.\n2. Anyone can type "start, n" when all participating players have joined.\n3. Where n is the number of rounds; for example, "start, 3". If no rounds are specified, the default round is a 3.\n4. To start playing, type "rollDice".\n5. You will roll a number between 1-6.\n6. Rounds to be played, 3, so players would take turns until each round has ended.\n7. Total number rolled during the game will determine the winner\n8. Play away!! And test how good your RNG is...haha`;
};

const initGame = (comps) => {
  comps["maxPlayers"] += 1;
  const message = comps["message"];
  if (comps["done"]) {
    return message.channel.send("Sorry, you cannot join an ongoing game...");
  }
  let currentPlayer = {
    id: message.author.id,
    username: message.author.username,
    points: 0,
  };
  const name = currentPlayer["username"];
  if (comps["players"].length === 0) {
    comps["players"].push(currentPlayer);
    message.channel.send(`${name} joined the game!`);
  } else {
    let found = false;
    comps["players"].forEach((player) => {
      if (player["id"] === currentPlayer["id"]) {
        found = true;
      }
    });
    if (!found) {
      comps["players"].push(currentPlayer);
      message.channel.send(`${name} joined the game!`);
    } else {
      message.channel.send(
        `${name}, hold up! You cannot join a game you're already part of!`
      );
    }
  }
};

const rollDice = (comps) => {
  const message = comps["message"];
  const id = message.author.id;
  const name = message.author.username;
  const players = comps["players"];
  if (!isPlayer(players, id)) {
    return message.channel.send(
      `${name}, hold up! You cannot participate in this game. Wait until the current game has ended.`
    );
  }

  
  console.log("rounds left:", comps["maxPlays"]);
  console.log("total players:", comps["temp_players"].length);

  let found = false;
  let c = 0;
  comps["temp_players"].forEach((player) => {
    if (player["id"] === id) {
      found = true;
      comps["temp_players"].splice(c, 1);
    }
    c++;
  });

  if (found) {
   
    rewardPoints(comps);
    if (comps["temp_players"].length === 0) {
      comps["temp_players"] = comps["players"].slice(0);
      comps["maxPlays"] -= 1;
      comps["rounds"] += 1;
      
    }
    
   
    if (comps["maxPlays"] === 0) {
      let team = "Let's see who got the RNG Crown...\n";
      let c = 1;
      comps["players"].forEach((player) => {
        team += c + ". " + player["username"] + ": " + player["points"] + "\n";
        c++;
      });
      let players = comps["players"];
      const winner_player = winner(players);
      team += winner_player["username"] + " won!!";
      message.channel.send(team);
      return (comps = {
        maxPlayers: 0,
        maxPlays: 3,
        rounds: 1,
        awake: false,
        done: false,
        temp_players: [],
        players: [],
        message: null,
      });
    }
  } else {
    message.channel.send(
      `${name}, hold up! You need to wait for your turn in the next round.`
    );
  }

  return null;
};

const isPlayer = (players, id) => {
  let c = 0;
  while (c < players.length) {
    if (players[c]["id"] === id) {
      return true;
    }
    c++;
  }
  return false;
};

const playersReached = (comps) => {
  const mp = comps["maxPlays"];
  console.log(mp);

  const message = comps["message"];
  if (comps["players"][0]["points"] > 0) {
    return message.channel.send(
      'You cannot do that! The game is still ongoing. If you would like to exit from current game, please use the "quit" command'
    );
  }
  let team = "This is the Player list. Take turns while playing.\n";
  let c = 1;
  comps["players"].forEach((player) => {
    team += c + ". " + player["username"] + "\n";
    c++;
  });
  team += "This is the beginning of round 1...";
  message.channel.send(team);
  comps["temp_players"] = comps["players"].slice(0);
  comps["done"] = true;
};

const rewardPoints = (comps) => {
  const message = comps["message"];
  const id = message.author.id;
  comps["players"].forEach((player) => {
    if (player["id"] === id) {
      const rand = Math.floor(Math.random() * 6) + 1;
      message.channel.send(`${player["username"]} rolled a ${rand}`);
      player["points"] = player["points"] + rand;
    }
  });
  if (comps["temp_players"].length === 0) {
    if(comps["maxPlays"] === 1){
      message.channel.send(
        `This is the end of the game.`
      );
    }else{
      message.channel.send(
        `This is the end of Round ${comps["rounds"]}. Starting next round...`
      );
    }
    
  }
};

const winner = (players) => {
  let player = players[0];
  players.forEach((element) => {
    if (player["points"] < element["points"]) {
      player = element;
    }
  });

  return player;
};

export {
  initGame,
  instructions,
  winner,
  rewardPoints,
  playersReached,
  rollDice,
};



const instructions = () => {
    return `Thanks for waking me up from my slumber.\nRules for the game are:\n1. Players should type "play" to be added to the game.\n2. Anyone can type "start" when all participating players have joined.\n3. Now, to start playing, type "rollDice".\n4. You will roll a number between 1-6.\n5. Rounds to be played, 3, so players would take turns until each round has ended.\n6. Total number rolled during the game will determine the winner\n6. Play away!! And test how good your RNG is...hahahaha`;
  }
  
  
  const initGame = (comps) =>{
    comps["maxPlayers"] += 1;
    const message = comps["message"];
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
  
  }
  
  const rollDice = (comps) => {
      const message = comps["message"]
    if (comps["temp_players"].length === 0) {
        comps["temp_players"] = comps["players"].slice(0);
        comps["maxPlays"] -= 1;
      if (comps["maxPlays"] === 0) {
        let team = "Let's see who got the Crown:\n";
        let c = 1;
        comps["players"].forEach((player) => {
          team +=
            c + ". " + player["username"] + ": " + player["points"] + "\n";
          c++;
        });
        let players = comps["players"]
        const winner_player = winner(players);
        team += winner_player["username"] + " won!!";
        message.channel.send(team);
        return comps = {
            maxPlayers: 0,
            maxPlays : 3,
            awake : false,
            done : false,
            temp_players : [],
            players : [],
            message : null,
          }
      } else {
        message.channel.send(`This is the next Round: `);
      }
    }
    console.log("rounds left:", comps["maxPlays"]);
    console.log("total players:", comps["temp_players"].length);
    const id = message.author.id;
    let found = false;
    let c = 0;
    let name = null;
    comps["temp_players"].forEach((player) => {
      if (player["id"] === id) {
        found = true;
        name = player["username"]
        comps["temp_players"].splice(c, 1);
      }
      c++;
    });
  
    if (found) {
      rewardPoints(comps)
    } else {
      message.channel.send(
        "Hold up! You need to wait for your turn in the next round."
      );
    }

    return null;
  
  }
  
  const playersReached = (comps) =>{
      const message = comps["message"];
    let team = "Please take turns according to this list:\n";
        let c = 1;
        comps["players"].forEach((player) => {
          team += c + ". " + player["username"] + "\n";
          c++;
        });
        team += "This is the beginning of round 1:";
        message.channel.send(team);
        comps["temp_players"] = comps["players"].slice(0);
        comps["done"] = true;
  }
  
  const rewardPoints = (comps) =>{
      const message = comps["message"]
      const id = message.author.id;
    comps["players"].forEach((player) => {
      if (player["id"] === id) {
        const rand = Math.floor(Math.random() * 6) + 1;
        message.channel.send(`${player["username"]}, rolled a ${rand}`);
        player["points"] = player["points"] + rand;
      }
    });
  }
  
  const winner = (players) => {
    let player = players[0];
    players.forEach((element) => {
      if (player["points"] < element["points"]) {
        player = element;
      }
    });
  
    return player;
  };

  export {initGame, instructions, winner, rewardPoints, playersReached, rollDice}
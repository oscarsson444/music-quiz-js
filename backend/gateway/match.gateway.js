const {
  addScore,
  getParticipantBySocket,
} = require("../services/participant.service");
const { removeMatch, getScore } = require("../services/match.service");
var {
  getSong,
  removeSong,
  getSongByName,
} = require("../services/song.service");

// Contains all the timers for each match (start time and timeout)
var matchTimers = {};

// Contains the number of participants in each match
var numParticipants = {};

// Contains the number of guesses in each match for every song
var numGuesses = {};

// Contains the score for each participant in each round
var roundScore = {};

// Every song from Deezer is max 30 seconds long
const SONG_DURATION = 31000;

/*
 * Removes all local variables for a match.
 */
const clearMatch = (matchId) => {
  if (matchTimers[matchId]) {
    console.log("Clearing timer: ", matchTimers);
    clearTimeout(matchTimers[matchId].roundTimeout);
    delete matchTimers[matchId];
  }

  delete roundScore[matchId];
  delete numParticipants[matchId];
  delete numGuesses[matchId];

  console.log("Removing match: ", matchTimers, numParticipants, numGuesses);
  removeMatch(matchId);
};

module.exports = function (io) {
  /*
   * Chooses a new song from the database and sends it to the clients. Also has Timeout
   * for when noone guesses the right song and the countdown before the song starts.
   */
  const chooseNewSong = async (data) => {
    const song = await getSong(data.matchId);
    let counter = 4;
    if (song === null) {
      io.to(data.matchId).emit("match", {
        status: "SONG",
        songTitle: null,
      });
      return;
    }

    numGuesses[data.matchId] = 0;

    // For the countdown before a song begins to play
    const timer = setInterval(() => {
      io.to(data.matchId).emit("match", {
        status: "TIMER",
        counter: counter--,
      });
    }, 1000);

    // Emit song after 5 seconds (the countdown above)
    setTimeout(async () => {
      clearInterval(timer);

      io.to(data.matchId).emit("match", {
        status: "SONG",
        songUrl: song?.url ?? null,
        songTitle: song?.title ?? null,
        songImage: song?.bigImage ?? null,
        participantId: song.participantId ?? null,
      });
      // If noone has guessed the right answer after the song is finished, choose new song
      const timeout = setTimeout(async () => {
        io.to(data.matchId).emit("match", {
          status: "TIMEOUT",
        });
        await removeSong(song._id);
        chooseNewSong(data);
      }, SONG_DURATION);
      matchTimers[data.matchId] = {
        startTime: Date.now(),
        roundTimeout: timeout,
      };
    }, 5100);
  };

  io.on("connection", (socket) => {
    console.log("A user connected!");

    /*
     * Create a match and a room, then add the player to that room.
     */
    socket.on("createMatch", (data) => {
      if (!(data.matchId in socket.rooms)) {
        console.log("User joined match: ", data.matchId);
        numParticipants[data.matchId] = 1;
        roundScore[data.matchId] = 0;
        socket.join(data.matchId);
        io.to(data.matchId).emit("match", {
          status: "CREATE",
          username: data.username,
        });
      }
    });

    /*
     * Join a room.
     */
    socket.on("joinMatch", (data) => {
      if (!(data.matchId in socket.rooms)) {
        console.log(data.username, " join match: ", data.matchId);
        numParticipants[data.matchId] += 1;
        socket.join(data.matchId);
        socket
          .to(data.matchId)
          .emit("match", { status: "JOIN", username: data.username });
      }
    });

    /*
     * Event triggered when a user leaves a match by the "Back" button.
     */
    socket.on("leaveMatch", (data) => {
      console.log("User left: ", data.matchId);
      socket.to(data.matchId).emit("match", {
        status: "LEAVE",
        socketId: socket.id,
      });
      socket.leave(data.matchId);

      // If no users are left in the room, remove the match.
      numParticipants[data.matchId] -= 1;
      if (numParticipants[data.matchId] === 0) {
        console.log("No users left in room, removing match, leavematch");
        clearMatch(data.matchId);
      }
    });

    /*
     * Host change everyones view to song_select.
     */
    socket.on("selectSongs", (data) => {
      io.to(data.matchId).emit("match", {
        status: "SONG_SELECT",
      });
    });

    /*
     * Event activated when the host starts the match.
     */
    socket.on("getSong", (data) => {
      socket.to(data.matchId).emit("match", { status: "START" });
      chooseNewSong(data, socket);
    });

    /*
     * When someone guesses the right song, give them points and choose new song.
     */
    socket.on("score", async (data) => {
      // Give points to the participant that guessed the right song
      numGuesses[data.matchId] += 1;
      const timeLeft =
        SONG_DURATION - (Date.now() - matchTimers[data.matchId]?.startTime);
      const score = (timeLeft / 1000).toFixed(1);
      await addScore(data.participantId, score);
      roundScore[data.matchId] += score;

      // If everyone has guessed the right song, show the score and choose new song.
      // also give points to the one who chose the song.
      if (numGuesses[data.matchId] === numParticipants[data.matchId] - 1) {
        const song = await getSongByName(data.matchId, data.url);
        const spectatorScore = (
          roundScore[data.matchId] / numParticipants[data.matchId]
        ).toFixed(1);

        await addScore(song.participantId, spectatorScore);
        const score = await getScore(data.matchId);
        await removeSong(song._id);
        roundScore[data.matchId] = 0;
        setTimeout(() => {
          io.to(data.matchId).emit("match", {
            status: "SCORE",
            score: score,
          });
          clearTimeout(matchTimers[data.matchId].roundTimeout);
          chooseNewSong(data, socket);
        }, 1500);
      }
    });

    /*
     * When a user closes the browser window.
     */
    socket.on("disconnecting", async () => {
      console.log("User disconnecting");

      // Find participant that is leaving by socketId and emit to match
      const participant = await getParticipantBySocket(socket.id);
      if (!participant) return;
      io.to(participant.matchId).emit("match", {
        status: "LEAVE",
        socketId: socket.id,
      });

      // Remove user from room and check if there are any users left
      // If not, remove match from database
      const room = participant.matchId.toString();
      numParticipants[room] -= 1;
      if (numParticipants[room] == 0) {
        console.log("No users left in room, removing match");
        clearMatch(room);
      }
    });
  });
};

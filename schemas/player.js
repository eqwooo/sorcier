const { Schema, model } = require("mongoose");

const playerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  playerId: String,
  playerName: String,
  score: { type: Number, default: 0 },
});

module.exports = model("Player", playerSchema, "players");

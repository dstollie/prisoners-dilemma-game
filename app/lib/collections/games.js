/**
 * @author  Dennis Stolmeijer
 * @since   06/04/15
 */

Games = new Meteor.Collection('games', {
	transform: function(doc) {
		return new Game(doc);
	}
});

Game = function(doc) {
	_.extend(this, doc);
};

_.extend(Game.prototype, {
	gameRounds: function() {
		return GameRounds.find({ gameId: this._id }).fetch();
	},
	rounds: function() {
		return GameRounds.find({ gameId: this._id });
	},
	getOpponent: function() {
		var player = _.find(this.players, function(player) {
			return player.userId !== Meteor.userId();
		});

		console.log(player);

		if(player)
			return Meteor.users.findOne({ _id: player.userId });

		return player;
	},
	gamePlayers: function() {
		if(!this.players)
			return null;

		playerIds = _.pluck(this.players, 'userId');

		return Meteor.users.find({_id: {$in: playerIds}});
	},
	getMe: function() {
		var player = _.find(this.players, function(player) {
			return player.userId === Meteor.userId();
		});

		return player;
	}
});

Meteor.methods({
	addPlayerIfNotExists: function(gameId, player) {
		// If the user is already a known player, we don't want to add him
		var existingUser = Games.findOne({ _id: gameId, 'players': {$elemMatch: { userId: player.userId }}});

		//console.log(existingUser);
		if(!existingUser) {
			// Add the user as a player to the game
			Games.update(
				{ _id: gameId },
				{ $addToSet: { players: player } }
			);
		}
	},
	updateScore: function(gameRoundId) {

		var gameRound = GameRounds.findOne(gameRoundId);

		if(gameRound.answers && gameRound.answers.length > 1) {

			var firstAnswer = gameRound.answers[0];
			var secondAnswer = gameRound.answers[1];

			var scores = determineScore([ firstAnswer.value, secondAnswer.value ]);

			if(scores) {
				Games.update({ _id: gameRound.gameId, 'players.userId': firstAnswer.userId }, { $inc : {"players.$.score" : scores[0]} });
				Games.update({ _id: gameRound.gameId, 'players.userId': secondAnswer.userId }, { $inc : {"players.$.score" : scores[1]} });
			}
		}

	},
	incrementLastRound: function(gameRoundId) {
		var gameRound = GameRounds.findOne(gameRoundId);

		Games.update({_id: gameRound.gameId, 'players.userId': Meteor.userId()}, { $inc : {"players.$.lastRound" : 1} });
	}

});

determineScore = function(scores) {
	if(!_.isArray(scores) || scores.length < 2)
		return null;

	// Meewerken (1) - Meewerken (1) = 3 - 3
	if(scores[0] === MEEWERKEN && scores[0] === scores[1] )
		return [3, 3];

	// Meewerken (1) - Niet-meewerken (0) = 0 - 5
	if(scores[0] === MEEWERKEN && scores[0] !== scores[1] )
		return [0, 5];

	if(scores[0] === NIET_MEEEWERKEN && scores[0] !== scores[1])
		return [5 ,0];

	return [1, 1];
};

determineType = function(scores) {
	if(!_.isArray(scores) || scores.length < 2)
		return null;

	// Meewerken (1) - Meewerken (1) = 3 - 3
	if(scores[0] === '3' && scores[0] === scores[1] )
		return [1, 1];

	// Meewerken (1) - Niet-meewerken (0) = 0 - 5
	if(scores[0] === '0' && scores[0] !== scores[1] )
		return [1, 0];

	if(scores[0] === '5' && scores[0] !== scores[1])
		return [0 , 1];

	return [0, 0];
};
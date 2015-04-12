/**
 * @author  Dennis Stolmeijer
 * @since   10/04/15
 */

Template.gamePlay.helpers({
	template: function() {
		if(this.currentGameRound().getAnsweredByMe()) {
			return '_gamePlaySee';
		} else {
			return '_gamePlayPick';
		}
	}
});

Template._gamePlaySee.helpers({
	gameFinished: function() {
		return (this.currentGameRound().roundCount + 1) > this.game().roundsCount;
	},
	pickedChoice: function() {
		var myAnswer = this.currentGameRound().getOpponent();

		if(myAnswer)
			return myAnswer.value === MEEWERKEN ? 'meewerken' : 'niet-meewerken';

		return null;
	},
	currentScore: function() {
		var me = this.game().getMe();
		return me.score;
	},
	obtainedPoints: function() {
		var opponent = this.currentGameRound().getOpponent();
		var me = this.currentGameRound().getMe();


		var scores = determineScore([ me.value, opponent.value ]);
		if(scores)
			return scores[0];

		return 0;
	}
});

Template._gamePlaySee.events({
	'click .next-round': function() {
		var nextRoundCount = parseInt(this.currentGameRound().roundCount) + 1;

		Router.go('gamePlay', { gameId: this.game()._id, roundCount: nextRoundCount });
	}
});

Template._gamePlayPick.helpers({
	answeredByMe: function() {
		return this.currentGameRound().getAnsweredByMe();
	}
});

var roundDone = function(gameRound) {
	console.log(gameRound);
	if(!gameRound.answers)
		return false;
	return gameRound.answers.length > 1;
};

Template._gamePlayPick.events({
	'click .meewerken': function() {

		var answer = {
			userId : Meteor.userId(),
			value: MEEWERKEN
		};

		if(!this.currentGameRound().getAnsweredByMe()) {
			// Update the picked answer to the game round
			GameRounds.update({ _id: this.currentGameRound()._id }, { $addToSet: { answers: answer }});

			// Update the last round for the current user
			Meteor.call('incrementLastRound', this.currentGameRound()._id);

			// Update the scores
			Meteor.call('updateScore', this.currentGameRound()._id);

		}
	},
	'click .niet-meewerken': function() {

		var answer = {
			userId : Meteor.userId(),
			value: NIET_MEEEWERKEN
		};

		if(!this.currentGameRound().getAnsweredByMe()) {
			// Update the picked answer to the game round
			GameRounds.update({ _id: this.currentGameRound()._id }, { $addToSet: { answers: answer }});

			// Update the last round for the current user
			Meteor.call('incrementLastRound', this.currentGameRound()._id);

			// Update the scores
			Meteor.call('updateScore', this.currentGameRound()._id);

		}
	}
});
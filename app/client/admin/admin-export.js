/**
 * @author  Dennis Stolmeijer
 * @since   19/04/15
 * @see     #change_with_requirement_code
 */

Template.adminExport.helpers({
	'opponentUsername': function() {
		return this.getOpponent().username;
	},
	'opponentMeewerkenCount': function() {
		var rounds = this.gameRounds();
		console.log(rounds);
		var count = 0;

		rounds.forEach(function(round) {
			var opponent = _.find(round.answers, function(answer) {
				return answer.userId !== Meteor.userId();
			});

			if(opponent.value === MEEWERKEN) {
				count += 1;
			}
		});

		return count;
	},
	'opponentNietMeewerkenCount': function() {
		var rounds = this.gameRounds();
		console.log(rounds);
		var count = 0;

		rounds.forEach(function(round) {
			var opponent = _.find(round.answers, function(answer) {
				return answer.userId !== Meteor.userId();
			});

			if(opponent.value === NIET_MEEEWERKEN) {
				count += 1;
			}
		});

		return count;
	},
	'score': function() {
		var player = _.find(this.players, function(player) {
			return player.userId !== Meteor.userId();
		});

		return player.score;
	}
});
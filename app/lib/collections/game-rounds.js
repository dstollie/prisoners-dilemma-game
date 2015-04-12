/**
 * @author  Dennis Stolmeijer
 * @since   06/04/15
 */

MEEWERKEN = 1;
NIET_MEEEWERKEN = 0;

TYPE_POSITIEF = 'positief';
TYPE_NEGATIEF = 'negatief';

GameRounds = new Meteor.Collection('game-rounds', {
	transform: function(doc) {
		return new GameRound(doc);
	}
});

GameRound = function(doc) {
	_.extend(this, doc);
};

_.extend(GameRound.prototype, {
	getMe: function() {
		var answer = _.find(this.answers, function(answer) {
			return answer.userId === Meteor.userId();
		});

		return answer;
	},
	getOpponent: function() {
		var answer = _.find(this.answers, function(answer) {
			return answer.userId !== Meteor.userId();
		});

		return answer;
	},
	getAnsweredByMe: function() {
		return !!_.findWhere(this.answers, { userId: Meteor.userId() });
	}
});
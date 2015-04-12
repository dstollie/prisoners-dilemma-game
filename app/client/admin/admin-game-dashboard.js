/**
 * @author  Dennis Stolmeijer
 * @since   08/04/15
 */

Template.adminGameDashboard.events({
    'click .add-game': function(e) {
        e.preventDefault();

		var roundsCount = 25;

		var players = [];
		players.push({
			userId: Meteor.userId(),
			lastRound: 25,
			score: 0
		});

		var gameId = Games.insert({
			'name': 'Game ' +  (Games.find().count() + 1),
			'type': TYPE_POSITIEF,
			'roundsCount': roundsCount,
			'players': players
		});

		for(var i = 0; i < roundsCount; i++) {

			var answers = [];

			answers.push({
				userId: Meteor.userId(),
				// Generate a random number between 0 and 1
				value: Math.round(Math.random())
			});

			GameRounds.insert({
				gameId: gameId,
				roundCount: i + 1,
				answers: answers
			});
		}
    },
    'click table tr': function() {
        Router.go('adminGameDetail', {gameId: this._id});
    },
	'click .intro-video': function(e) {
		e.preventDefault();

		bootbox.dialog({
			title: "Introductie filmpje",
			message: '<video width="568px" src="intro.MOV" autoplay controls preload></video>'
		});
	}
});
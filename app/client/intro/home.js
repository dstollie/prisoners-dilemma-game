/**
 * @author  Dennis Stolmeijer
 * @since   06/04/15
 */

Template.home.events({
	'change input[name=code]': function(e) {
		e.preventDefault();

		var code = $('[name=code]').val();

		enterGame(code);
	},
	'submit form': function(e) {
		e.preventDefault();

		var code = $('[name=code]').val();

		enterGame(code);
	}
});

enterGame = function(code) {
	if(!code || code.length < 6)
		return;

	if(!Meteor.userId()) {
		FlashMessages.sendError("Log eerst in voordat je de game kan starten.");
		return;
	}

	var game = Games.findOne(code);
	if(!game)
		return;

	var player = {
		userId: Meteor.userId(),
		lastRound: 0,
		score: 0
	};

	Meteor.call('addPlayerIfNotExists', code, player);

	Router.go('gameIntroOne', { gameId: game._id });
}
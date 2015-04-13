/**
 * @author  Dennis Stolmeijer
 * @since   06/04/15
 */

Router.configure({
    layoutTemplate: 'baseLayout',
    waitOn: function() {
        return [
            Meteor.subscribe('users')
        ]
    }
});

var requireAdmin = function() {
    if (!isAdmin()) {
		FlashMessages.sendError("Je moet eerst ingelogd zijn als admin.");
        this.render('home');
    } else {
        this.next();
    }
};

var requireLogin = function() {
	if(!Meteor.userId()) {
		FlashMessages.sendError("Je moet eerst ingelogd zijn.");
		this.render('home');
	} else {
		this.next();
	}
};

Router.onBeforeAction(requireLogin, { expect: ['home']});
Router.onBeforeAction(requireAdmin, { only: ['adminGameDashboard', 'adminGameDetail']});

/* Game Play Shizzle */

Router.route('/', {
	name: 'home'
});

GameIntroController = RouteController.extend({
	data: function() {
		var params = this.params;
		return {
			game: function() {
				return Games.findOne(params.gameId);
			}
		}
	}
});

GamePlayController = GameIntroController.extend({
	data: function() {
		var params = this.params;

		var game = Games.findOne(params.gameId);
		var currentGameRound = GameRounds.findOne({ gameId: params.gameId, roundCount: parseInt(params.roundCount) });

		if(!game)
			return this.render('loading');

		// Search if the current logged in user already is known as a player for the game
		var player = _.findWhere(game.players, { userId: Meteor.userId() });
		if(player) {

			if(player.lastRound + 1 > game.roundsCount)  {

				Router.go('gamePlay', { gameId: params.gameId, roundCount: game.roundsCount });
			}
			else if(player.lastRound > params.roundCount) {
				FlashMessages.sendInfo("Je hebt al een antwoord gegeven op deze ronde, vraag je proefleider of hij/zij naar ronde '" + player.lastRound + 1 + "' voor je wil gaan.");
			}
		} else {
			if(params.roundCount !== 1)
				Router.go('gamePlay', { gameId: params.gameId, roundCount: 1 });
		}

		return {
			game: function() {
				return game;
			},
			currentGameRound: function() {
				return currentGameRound;
			},
			playerStats: function() {
				return player;
			}
		}
	}
});

Router.route('/games/:gameId', {
	name: 'gameIntroOne',
	controller: 'GameIntroController'
});

Router.route('/games/:gameId/step2', {
    name: 'gameIntroTwo',
	controller: 'GameIntroController'
});

Router.route('/games/:gameId/play', {
    name: 'gameIntroThree',
	controller: 'GameIntroController'
});

Router.route('/games/:gameId/play/:roundCount', {
	name: 'gamePlay',
	controller: 'GamePlayController'
});

/* Admin Shizzle */

Router.route('/admin', {
    name: 'adminGameDashboard',
    data: function() {
        return Games.find();
    }
});

Router.route('/admin/games/:gameId', {
    name: 'adminGameDetail',
    data: function() {
		var params = this.params;

		var game = Games.findOne(params.gameId);
		if(!game)
			return false;

        return {
			game: function() {
				return game;
			}
		}
    }
});
/**
 * @author  Dennis Stolmeijer
 * @since   08/04/15
 */

Template.adminGameDetail.helpers({
	'positiveOptionValue': function() {
		return TYPE_POSITIEF
	},
	'negativeOptionValue': function() {
		return TYPE_NEGATIEF
	},
    'checkedPositive': function() {
        return this.game().type === TYPE_POSITIEF ? 'checked': '';
    },
	'checkedNegative': function() {
		return this.game().type === TYPE_NEGATIEF ? 'checked': '';
	},
	'getAnswer': function() {
		if(this.value === 1 || this.value === 0) {
			return this.value === 1 ? 'meewerken' : 'niet-meewerken';
		}
		return null;
	},
	'username': function() {
		var user = findUserById(this.userId);
		return user.username;
	},
	'changeable': function() {
		// When there are two players in the game, the game may not be changed anymore
		return this.game().players.length > 1;
	},
	'disabledChangeable': function() {
		return this.game().players.length > 1 ? 'disabled' : '';
	}
});

Template.adminGameDetail.events({
	'submit form': function(e) {
		e.preventDefault();

		if(this.game().players.length > 1) {
			FlashMessages.sendError('Deze game is al gestart en daarom kan deze niet meer aangepast worden')
			return;
		}

		var game = {
			type: $(e.target).find('[name=type]').val(),
			roundsCount: parseInt($(e.target).find('[name=roundsCount]').val())
		};

		check(game.roundsCount, Number);

		Games.update({ _id: this.game()._id }, { $set: game });

	},
	'click .remove-game': function() {
		if(this.game().players.length > 1) {
			FlashMessages.sendError('Deze game is al gestart en daarom kan deze niet meer verwijderd worden')
			return;
		}

		Games.remove(this.game()._id);
		FlashMessages.sendSuccess('Game is succesvol verwijderd');
		Router.go('adminGameDashboard');
	}
});
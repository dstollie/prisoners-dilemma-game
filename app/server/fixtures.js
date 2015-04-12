/**
 * @author  Dennis Stolmeijer
 * @since   06/04/15
 * @see     #change_with_requirement_code
 */

function loadUsers() {
    if (Meteor.users.find().count() === 0) {
        var userId = Accounts.createUser({
            password: 'admin',
            username: 'eoonderzoek123'
        });

        updateAdmin(userId, true);
    }
}

function loadGameTypes() {
    if (GameTypes.find().count() === 0) {
        GameTypes.insert({
            name: 'positief',
            src: 'http://www.google.nl'
        });

        GameTypes.insert({
            name: 'negatief',
            src: 'http://www.google.nl'
        });
    }
}

loadUsers();
loadGameTypes();
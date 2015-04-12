/**
 * @author  Dennis Stolmeijer
 * @since   06/04/15
 */

Meteor.publish('users', function() {
    return Meteor.users.find();
});
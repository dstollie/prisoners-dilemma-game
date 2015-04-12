/**
 * @author  Dennis Stolmeijer
 * @since   06/04/15
 */

isAdmin = function(user){
    user = (typeof user === 'undefined') ? Meteor.user() : user;
    return !!user && !!user.isAdmin;
};

updateAdmin = function(userId, admin) {
    Meteor.users.update(userId, {$set: {isAdmin: admin}});
};

findUserById = function(userId) {
	return Meteor.users.findOne(userId);
};
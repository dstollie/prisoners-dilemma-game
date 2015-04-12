/**
 * @author  Dennis Stolmeijer
 * @since   09/04/15
 */

//Template.gameIntroOne.rendered = function() {
//	$(function() {
//		$('.intro-container').summernote();
//	})
//};

Template.gameIntroTwo.helpers({
	'isPositive': function() {
		return this.game().type === 'positief';
	}
});

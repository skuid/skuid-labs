//inline javascript snippet
(function(skuid){
var $ = skuid.$;

$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};


$(window).scroll(function() {  
    var noButton = false;
    var model = skuid.$M('Accounts');  //name of model you'd like to load more rows into
    var flagModel = skuid.$M('Controller'); //optional: used if you'd like to display a message, like loading more rows. 
    var row = flagModel.getFirstRow();
    $('.nx-list-loadmore').each(function() {
            if ($(this).isInViewport()) {
                noButton = true;
                flagModel.updateRow(row, {showLoadingMore: true});  //updating custom field called 'showLoadingMore' which is used to conditionally display a message
                model.loadNextOffsetPage();
            }
          });
     if(!noButton){
            flagModel.updateRow(row, {showLoadingMore: false});
        }
    });
    
})(skuid);

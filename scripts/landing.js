var animatePoints = function() {
    var revealPoint = function() {
        $(this).css({
            opacity: 1;
            transform: 'scaleX(1) translateY(0)'
        });
    };
    
    $.each($('.point'), revealPoint);
};


$(window).load(function() {
    
    //automatically animates the points on a tall screen where scrolling can't trigger the animation
    if ($(window).height() > 950) {
        animatePoints();
    }
    
    if ($(window).scroll(function(event) {
    //animate points when scroll below the image, around 500 pixels
        if($(window).scrollTop() >= 500 {
           animatePoints();
        }
    });

});
var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(pointsArray) {
     
     var revealPoint = function(point) {
         point.style.opacity = 1;
         point.style.transform = "scaleX(1) translateY(0)";
         point.style.msTransform = "scaleX(1) translateY(0)";
         point.style.WebkitTransform = "scaleX(1) translateY(0)";   
      };
    
      forEach(pointsArray, revealPoint);

 };

 

window.onload = function() {
    
    //automatically animates the points on a tall screen where scrolling can't trigger the animation
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    }
    
    window.addEventListener('scroll', function(event) {
    //animate points when scroll below the image, around 500 pixels
        if(pointsArray[0].getBoundingClientRect().top <= 500) {
            animatePoints(pointsArray);
        }
    });

}
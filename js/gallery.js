// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/


/*swapPhoto() will change the source of the current photo in the
slideshow. It will also change the details according to which photo
is currently being displayed.*/

function swapPhoto() {
  if(mCurrentIndex == mImages.length-1){
    mCurrentIndex = -1;
  }
  mCurrentIndex++;
  $('#photo').attr('src', mImages[mCurrentIndex].src);
  $('.location').text('Location: ' + mImages[mCurrentIndex].location);
  $('.description').text('Description: ' + mImages[mCurrentIndex].description);
  $('.date').text('Date: ' + mImages[mCurrentIndex].date);


}

//Return the GET variable accordind to the parameter of the function.
function getQueryParams(qs) {
  qs = qs.split("+").join(" ");
  var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;
      while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      }
      return params;
}

var $_GET = getQueryParams(document.location.search);

//Check to see if the GET variable is set.
//If not, make the default URL "images.json".
if($_GET['mUrl'] == "undefined" || $_GET['mUrl'] == null){
  $_GET['mUrl'] = "images.json";
}

// Counter for the mImages array
var mCurrentIndex = -1;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// Retrieves the
var mUrl = $_GET['mUrl'];

//$.getJSON('images.json', function(data){
//  console.log(data);
//});

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {

	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();

  //Rotates the arrow within the slideshow.
  $('.moreIndicator').click(function(){
    $('.moreIndicator').toggleClass('rot90 rot270');
    $('.details').fadeToggle(500);
  });

  //Increments the slideshow by 1 photo.
  $('#nextPhoto').click(function(){
    if(mCurrentIndex == mImages.length-1){
      mCurrentIndex = -1;
    }
    swapPhoto();
    mLastFrameTime = 0;
  });

  //Decrements the slideshow by 1 photo.
  $('#prevPhoto').click(function(){
    if(mCurrentIndex == 0){
      mCurrentIndex = mImages.length-2;
    }
    else{
      mCurrentIndex-=2;
    }
    swapPhoto();
    mLastFrameTime = 0;
  });


});

window.addEventListener('load', function() {

	console.log('window loaded');

}, false);

//Assigns the value of the current Json object into an object.
function GalleryImage(location, description, date, src) {
  this.location = location;
  this.description = description;
  this.date = date;
  this.src = src;
}

function reqListener () {
  console.log(this.responseText);
}

mRequest.onreadystatechange = function() {
// Do something interesting if file is opened successfully
  if (mRequest.readyState == 4 && mRequest.status == 200) {
      try {
      // Let’s try and see if we can parse JSON
      mJson = JSON.parse(mRequest.responseText);
      // Let’s print out the JSON; It will likely show as “obj”
      //console.log(mJson);
    } catch(err) {
      console.log(err.message)
    }
  }
};
mRequest.open("GET", mUrl, true);
mRequest.send();

/* A short-hand AJAX request instead of the default one. This function
will query the mUrl variable, parse its objects, and assign each one's
values to a GalleryImage object in the mImages array. */

$.ajax({
  url: mUrl,
  dataType: 'json',
  type: 'get',
  cache: 'false',
  success: function(data){
    $(data.images).each(function(index, val){
      //var name = index.to
      var name = new GalleryImage(
        val.imgLocation,
        val.description,
        val.date,
        val.imgPath);
      mImages.push(name);
    });
  }
});

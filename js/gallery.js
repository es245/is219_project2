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
    console.log(currentTime);
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

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

function changeSrc(currentIndex){
  $('#photo').attr('src', mImages[currentIndex].src);
  $('.location').text('Location: ' + mImages[currentIndex].location);
  $('.description').text('Description: ' + mImages[currentIndex].description);
  $('.date').text('Date: ' + mImages[currentIndex].date);

}

// Counter for the mImages array
var mCurrentIndex = -1;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'images.json';


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
  console.log(mImages);
  //---------------------
  $('.moreIndicator').click(function(){
    $('.moreIndicator').toggleClass('rot90 rot270');
    $('.details').fadeToggle(500);
  });

  $('#nextPhoto').click(function(){
    if(mCurrentIndex == mImages.length-1){
      mCurrentIndex = -1;
    }
    swapPhoto();
    mLastFrameTime = 0;
  });

  $('#prevPhoto').click(function(){
    if(mCurrentIndex == 0){
      mCurrentIndex = mImages.length-2;
    }
    else{
      mCurrentIndex-=2;
    }
    swapPhoto();
    mLastFrameTime = 0;
    console.log(mCurrentIndex);
  });


});

window.addEventListener('load', function() {

	console.log('window loaded');

}, false);

function GalleryImage(location, description, date, src) {

  this.location = location;
  this.description = description;
  this.date = date;
  this.src = src;
	//implement me as an object to hold the following data about an image:
	//1. location where photo was taken
	//2. description of photo
	//3. the date when the photo was taken
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
}

function reqListener () {
  console.log(this.responseText);
}


$.ajax({
  url: 'images.json',
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

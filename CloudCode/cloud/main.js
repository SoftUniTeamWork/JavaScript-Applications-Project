
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("likesCount", function(request, response) {
  var query = new Parse.Query("Like");
  query.equalTo("photoId", {__type: 'Pointer', className: 'Photo', objectId: request.params.photoId});
  query.find({
    success: function(results) {
      var likes = results.length,
          liked = false,
          likeId;

      for (var i = 0; i < likes; ++i) {
        if(results[0].get('userId').id == request.params.userId) {
          liked = true;
          likeId = results[0].id;
          break;
        }
      }
     
      response.success({likes: likes, likedPhoto: {liked: liked, likeId: likeId}});
    },
    error: function() {
      response.error("likes lookup failed");
    }
  });
});

Parse.Cloud.define('getMostLikedUserPhotos', function(request, response) {
  var userId = request.params['userId'];

  var Category = Parse.Object.extend('Category');
  var categoryQuery = new Parse.Query(Category);
  categoryQuery.equalTo('userId', {"__type": "Pointer","className": "_User","objectId": userId});

  var Album = Parse.Object.extend('Album');
  var albumQuery = new Parse.Query(Album);
  albumQuery.matchesQuery('categoryId', categoryQuery);

  var Photo = Parse.Object.extend('Photo');
  var photoQuery = new Parse.Query(Photo);
  photoQuery.matchesQuery('albumId', albumQuery);
  photoQuery.descending('likes');
  photoQuery.limit(6);

  photoQuery.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error('photos lookup failed');
    }
  });
});

Parse.Cloud.define('getMostLikedPhotos', function(request, response) {
  var Photo = Parse.Object.extend('Photo');
  var photoQuery = new Parse.Query(Photo);
  photoQuery.descending('likes');
  photoQuery.limit(6);

  photoQuery.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error('photos lookup failed');
    }
  });
});

Parse.Cloud.afterSave('Like', function(request) {
  Parse.Cloud.useMasterKey();
  var photoId = request.object.get('photoId').id;

  query = new Parse.Query("Photo");
  query.get(photoId, {
    success: function(photo) {
      photo.increment("likes", 1);
      photo.save();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});

Parse.Cloud.afterDelete("Like", function(request, response) {
  Parse.Cloud.useMasterKey();
  var photoId = request.object.get('photoId').id;

  query = new Parse.Query("Photo");
  query.get(photoId, {
    success: function(photo) {
      photo.increment("likes", -1);
      photo.save();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });

});
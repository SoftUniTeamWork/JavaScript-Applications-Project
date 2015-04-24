
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

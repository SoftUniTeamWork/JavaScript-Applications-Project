define(['noty', 'mustache'], function (Noty, Mustache) {
    function LikeController(data) {
        this._data = data;
    }

    LikeController.prototype.create = function (id) {
        var _this = this,
            userId = this._data.usersRepository.getUserData().userId,
            likeData = {
                photoId: {__type: 'Pointer', className: 'Photo', objectId: id},
                userId: {__type: 'Pointer', className: '_User', objectId: userId}
            };

        this._data.likesRepository.add(likeData, userId)
            .then(
            function(data) {
                LikeController.prototype.showLikes.call(_this, id, '#likes');
                Noty.success('Like successfully submitted.');
            },
            function(erorr) {
                Noty.error('Error submitting like.');
            });
    }

    LikeController.prototype.delete = function(id, photoId) {
        var _this = this,
            userId = this._data.usersRepository.getUserData().userId;
        this._data.likesRepository.delete(id)
            .then(function(data) {
                LikeController.prototype.showLikes.call(_this, photoId, '#likes');
            },
            function(erorr) {
                Noty.error('Error deleting like.');
            })
    }

    LikeController.prototype.showLikes = function(photoId, selector) {
        var userId = this._data.usersRepository.getUserData().userId;

        this._data.functionsRepository.execute('likesCount', {photoId: photoId, userId: userId})
            .then(
            function(data){
                var likesData = {};
                likesData['likes'] = data['result'];
                likesData['photoId'] = photoId;
                $.get('./views/like/likes-for-photo.html', function (view) {
                    output = Mustache.render(view, likesData);
                    $(selector).html(output);
                });
            },
            function(error){
                console.log(error);
            });
    }

    return LikeController;
});

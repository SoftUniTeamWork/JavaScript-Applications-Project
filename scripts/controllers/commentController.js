var app=app||{};

app.CommentController = (function () {
    function CommentController(data) {
        this._data = data;
    }

    CommentController.prototype.showCommentsForPhoto = function (id, selector) {
        var userId = this._data.users.getUserData().userId;
        this._data.commentsRepository.getCommentsByPhotoId(id)
            .then(
            function (data) {
                var comments = data['results'];
                comments.forEach(function (comment) {
                    comment['createdAt'] = formatDate(comment['createdAt']);
                    if (comment['ACL'][userId] && comment['ACL'][userId]['write']) {
                        comment['showButtons'] = true;
                    }
                });

                $.get('./views/comment/comments-for-photo.html', function (view) {
                    output = Mustache.render(view, data);
                    $(selector).html(output);
                });
            },
            function (error) {
                Noty.error("Error loading comments.");
            }
        );
    }

    CommentController.prototype.create = function (params) {
        var _this = this,
            userId = this._data.users.getUserData().userId,
            commentData = {
                content: params['content'],
                photoId: {__type: 'Pointer', className: 'Photo', objectId: params['id']},
                userId: {__type: 'Pointer', className: '_User', objectId: userId}
            };

        this._data.commentsRepository.add(commentData, userId)
            .then(
            function(data) {
                CommentController.prototype.showCommentsForPhoto.call(_this, params['id'], '#comments');
                Noty.success('Comment successfully added.');
            },
            function (erorr) {
                Noty.error('Error creating comment.');
            });
    }

    CommentController.prototype.delete = function(id, photoId) {
        var _this = this;
        this._data.commentsRepository.delete(id)
            .then(function(data) {
                CommentController.prototype.showCommentsForPhoto.call(_this, photoId, '#comments');
            },
            function(erorr) {
                Noty.error('Error deleting comment.');
            });
    }

    return CommentController;
})();

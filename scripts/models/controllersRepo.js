var app = app || {};

app.controllersRepo = (function () {

    return {
        getControllers: function (data) {
            return {
                categoryController: new app.CategoryController(data),
                logController: new app.LogController(data),
                albumController: new app.AlbumController(data),
                photoController: new app.PhotoController(data),
                navigationController: new app.NavigationController(data),
                commentController: new app.CommentController(data),
                likeController: new app.LikeController(data),
                userController: new app.UserController(data)
                // add new controllers here
            }
        }
    }
}());
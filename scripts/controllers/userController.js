var app=app||{};

app.UserController = (function () {
    var USERS_PER_PAGE = 10;

    function UserController(data) {
        this._data = data;
    }

    UserController.prototype.showAllUsers = function (page, selector) {

        if (!this._data.users.isLogged()) {
            Noty.error("You must be logged in to see all users")
            redirectTo('#/login');
        } else {
            var page = parseInt(page),
                nextPage = page + 1,
                prevPage = page - 1 < 1 ? 1 : page - 1;

            this._data.users.getAll(USERS_PER_PAGE, page)
                .then(
                function (data) {
                    if (data['results'].length === 0 && page > 1) {
                        redirectTo('#/users/showall/' + id + '/' + (page - 1));
                    }
                    data['pageInfo'] = {nextPage: nextPage, prevPage: prevPage};

                    $.get('./views/user/user-all.html', function (view) {
                        output = Mustache.render(view, data);
                        $(selector).html(output);
                    });
                },
                function (error) {
                    Noty.error("Error loading users data.");
                }
            );
        }
        ;
    }

    UserController.prototype.showProfile = function (userId, selector) {
        if (!this._data.users.isLogged()) {
            Noty.error("You must be logged in first to view profile")
            redirectTo('#/login');
        } else {
            this._data.users.getById(userId)
                .then(
                function (data) {
                    data['createdAt'] = formatDate(data['createdAt']);
                    $.get('./views/user/user-profile.html', function (view) {
                        output = Mustache.render(view, data);
                        $(selector).html(output);
                    });
                },
                function (error) {
                    Noty.error("Error loading user data.");
                }
            );
        }
    }

    UserController.prototype.showTopPhotosOfUser = function (userId, selector) {
        if (!this._data.users.isLogged()) {
            Noty.error("You must be logged in first to see top user photos")
            redirectTo('#/login');
        } else {
            var sendData = {userId: userId};
            this._data.functionsRepository.execute('getMostLikedUserPhotos', sendData)
                .then(
                function (data) {
                    $.get('./views/user/user-home-top-photos.html', function (view) {
                        output = Mustache.render(view, data);
                        $(selector).prepend(output);
                    });
                },
                function (error) {
                    Noty.error("Error loading user's most liked photos.");
                }
            );
        }
    }

    UserController.prototype.showTopPhotosOfAllUsers = function (selector) {
        if (!this._data.users.isLogged()) {
            Noty.error("You must be logged in first to view top photos")
            redirectTo('#/login');
        } else {
            this._data.functionsRepository.execute('getMostLikedPhotos')
                .then(
                function (data) {
                    $.get('./views/user/user-home-top-photos-all.html', function (view) {
                        output = Mustache.render(view, data);
                        $(selector).append(output);
                    });
                },
                function (error) {
                    Noty.error("Error loading most liked photos.");
                }
            );
        }
    }

    return UserController;
})();

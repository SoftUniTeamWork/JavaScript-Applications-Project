define(['helperFunctions', 'noty', 'mustache'], function (helpers, Noty, Mustache) {
    var USERS_PER_PAGE = 10;

    function UserController(data) {
        this._data = data;
    }

    UserController.prototype.showAllUsers = function (page, selector) {

        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in to see all users")
            helpers.redirectTo('#/login');
        } else {
            var page = parseInt(page),
                nextPage = page + 1,
                prevPage = page - 1 < 1 ? 1 : page - 1;

            this._data.usersRepository.getAll(USERS_PER_PAGE, page)
                .then(
                function (data) {
                    if (data['results'].length === 0 && page > 1) {
                        helpers.redirectTo('#/users/showall/' + id + '/' + (page - 1));
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
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to view profile")
            helpers.redirectTo('#/login');
        } else {
            this._data.usersRepository.getById(userId)
                .then(
                function (data) {
                    data['createdAt'] = helpers.formatDate(data['createdAt']);
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
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to see top user photos")
            helpers.redirectTo('#/login');
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
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to view top photos")
            helpers.redirectTo('#/login');
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
});

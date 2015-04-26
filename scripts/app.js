var app = app || {};

(function () {
    var baseUrl = "https://api.parse.com/1/";
    var ajaxRequester = app.ajaxRequester.get();
    var data = app.data.get(baseUrl, ajaxRequester);

    var controllers = app.controller.getControllers(data);
    //controller.attachEventHandlers();

    app.router = Sammy(function () {
        var mainSelector = '#main',
            headerSelector = '#header';

        // Category routes
        this.get('#/categories/new', function () {

                controllers.navigationController.showProfileNavigation(headerSelector);

                controllers.categoryController.new(mainSelector);

        });

        this.post('#/categories/create', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.categoryController.create(this.params);
        });

        this.get('#/categories/showall/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.categoryController.showCategories(this.params['id'], mainSelector);
        });

        this.get('#/categories/edit/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.categoryController.edit(this.params['id'], mainSelector);
        });

        this.put('#/categories/update/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.categoryController.update(this.params);
        });

        this.get('#/categories/delete/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.categoryController.delete(this.params['id']);
        });

        //user control
        this.get('#/login', function () {
            controllers.navigationController.showDefaultNavigation(headerSelector);
            controllers.logController.loadLogin(mainSelector);
        });

        this.get('#/register', function () {
            controllers.navigationController.showDefaultNavigation(headerSelector);
            controllers.logController.loadRegister(mainSelector);

        });

        this.get('#/logout', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.logController.logout(mainSelector);
        });

        //User routes
        this.get('#/users/showall/:page', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.userController.showAllUsers(this.params['page'], mainSelector);
        });

        this.get('#/users/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.userController.showProfile(this.params['id'], mainSelector);
        });

        this.get('#/users/home/:id', function () {
            $(mainSelector).html('');
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.userController.showTopPhotosOfUser(this.params['id'], mainSelector);
            controllers.userController.showTopPhotosOfAllUsers(mainSelector)
        });

        // Album routes
        this.get('#/albums/new', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.albumController.new(mainSelector);
        });

        this.post('#/albums/create', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.albumController.create(this.params);
        });

        this.get('#/albums/edit/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.albumController.edit(this.params['id'], mainSelector);
        });

        this.put('#/albums/update/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.albumController.update(this.params);
        });

        this.get('#/albums/delete/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.albumController.delete(this.params['id']);
        });

        this.get('#/albums/:categoryId', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.albumController.showAlbumsFromCategory(this.params['categoryId'], mainSelector);
        });

        // Photos routes
        this.get('#/photos/new/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.photoController.new(this.params['id'], mainSelector);
        });

        this.post('#/photos/create/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.photoController.create(this.params);
        });

        this.get('#/photos/showalbum/:albumId/:page', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.photoController.showPhotosFromAlbum(this.params['albumId'], this.params['page'], mainSelector);
        });

        this.get('#/photos/delete/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.photoController.delete(this.params['id']);
        });

        this.get('#/photos/show/:id', function () {
            $(mainSelector).html('');
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.photoController.showPhoto(this.params['id'], mainSelector);
            controllers.commentController.showCommentsForPhoto(this.params['id'], mainSelector)
        });

        // Comments routes
        this.post('#/comments/create/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.commentController.create(this.params);
        });

        this.get('#/comments/delete/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.commentController.delete(this.params['id']);
        });

        // Likes routes
        this.get('#/likes/create/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.likeController.create(this.params['id']);
        });

        this.get('#/likes/delete/:id', function () {
            controllers.navigationController.showProfileNavigation(headerSelector);
            controllers.likeController.delete(this.params['id']);
        });
    });

    app.router.run('#/login');
}());


// var a = {userId, userId};
//             this._data.functionsRepository.execute('getMostLikedUserPhotos', a)
//                 .then(function(data) {console.log(data);}, function(error) {console.log(error);});
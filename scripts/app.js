var app = app || {};

(function() {
    var baseUrl = "https://api.parse.com/1/";
    var ajaxRequester = app.ajaxRequester.get();
    var data = app.data.get(baseUrl, ajaxRequester);

    var controllers = app.controller.getControllers(data);
    //controller.attachEventHandlers();

    app.router = Sammy(function () {
        var mainSelector = '#main',
            headerSelector = '#header';

        // this.get('#/', function (){
        //     controller.loadHeader(headerSelector);
        //     controller.loadHome(mainSelector);
        // });

        // this.get('#/login', function () {
        //     controller.loadHeader(headerSelector);
        //     controller.loadLogin(mainSelector);
        // });

        // this.get('#/register', function () {
        //     controller.loadHeader(headerSelector);
        //     controller.loadRegister(mainSelector);
        // });

        // this.get('#/profile/edit', function () {
        //     controller.loadHeader(headerSelector);
        //     controller.loadEditProfile(mainSelector);
        // });

        // this.get('#/logout', function () {
        //     controller.logout();
        // });

        // New routes

        // Category routes
        this.get('#/categories', function () {
            controllers.categoryController.showAll(mainSelector);
        });

        this.get('#/categories/new', function () {
            controllers.categoryController.new(mainSelector);
        });

        this.post('#/categories/create', function () {
            controllers.categoryController.create(this.params);
        });

        this.get('#/categories/edit/:id', function () {
            controllers.categoryController.edit(this.params['id'], mainSelector);
        });

        this.put('#/categories/update/:id', function () {
            controllers.categoryController.update(this.params);
        });

        this.get('#/categories/delete/:id', function () {
            controllers.categoryController.delete(this.params['id']);
        });

        // Album routes
        this.get('#/albums/new', function () {
            controllers.albumController.new(mainSelector);
        });

        this.post('#/albums/create', function () {
            controllers.albumController.create(this.params);
        });

        this.get('#/albums/edit/:id', function () {
            controllers.albumController.edit(this.params['id'], mainSelector);
        });

        this.put('#/albums/update/:id', function () {
            controllers.albumController.update(this.params);
        });

        this.get('#/albums/delete/:id', function () {
            controllers.albumController.delete(this.params['id']);
        });

        this.get('#/albums/:categoryId', function () {
            controllers.albumController.showAlbumsFromCategory(this.params['categoryId'], mainSelector);
        });


    });

    app.router.run('#/');
}());
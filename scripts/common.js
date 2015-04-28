requirejs.config({

    baseUrl: 'scripts',

    paths: {
        ajaxRequester: 'ajax-requester',
        app: 'app',
        noty: 'noty',
        
        data: 'models/data',
        albumRepo: 'models/albumRepo',
        categoryRepo: 'models/categoryRepo',
        commentRepo: 'models/commentRepo',
        credentials: 'models/credentials',
        fileRepo: 'models/fileRepo',
        functionRepo: 'models/functionRepo',
        likeRepo: 'models/likeRepo',
        photoRepo: 'models/photoRepo',
        userRepo: 'models/userRepo',

        helperFunctions: 'helpers/helperFunctions',

        controllers: 'controllers/controllers',
        albumController: 'controllers/albumController',
        categoryController: 'controllers/categoryController',
        commentController: 'controllers/commentController',
        likeController: 'controllers/likeController',
        logController: 'controllers/logController',
        navigationController: 'controllers/navigationController',
        photoController: 'controllers/photoController',
        userController: 'controllers/userController',
        
        notyLib: '../libs/node_modules/noty/js/noty/packaged/jquery.noty.packaged',
        mustache: '../libs/node_modules/mustache/mustache',
        Q: '../libs/node_modules/q/q',
        Sammy: '../libs/node_modules/shimney-sammy/main',
        jQuery: '../libs/node_modules/jquery/dist/jquery'
    }
});

requirejs(['jQuery', 'app'], function ($, app) {
    app.router.run('#/login');
});
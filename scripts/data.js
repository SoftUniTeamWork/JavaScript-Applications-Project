var app = app || {};

app.data = (function () {

    function Data (baseUrl, ajaxRequester) {
        this.users = new Users(baseUrl, ajaxRequester);
        this.categoriesRepository = new CategoriesRepository(baseUrl, ajaxRequester);
        this.albumsRepository = new AlbumsRepository(baseUrl, ajaxRequester);
        this.photosRepository = new PhotosRepository(baseUrl, ajaxRequester);
        this.filesRepository = new FilesRepository(baseUrl, ajaxRequester);
        this.commentsRepository = new CommentsRepository(baseUrl, ajaxRequester);
        this.functionsRepository = new FunctionsRepository(baseUrl, ajaxRequester);
        this.likesRepository = new LikesRepository(baseUrl, ajaxRequester);
    }

    var credentials = (function () {

        function getHeaders() {
            var headers = {
                    'X-Parse-Application-Id': 'Jzz7mwlDky5ROWzs4fgY74ZuEAACu6jDyE0jVZks',
                    'X-Parse-REST-API-Key': 'Pd0a05VUVLGNEFUyTqQNUF20GlrJhPDmsmpD0Dv1'
                },
                currentUser = getSessionToken();

            if (currentUser) {
                headers['X-Parse-Session-Token'] = currentUser;
            }
            return headers;
        }

        function getSessionToken() {
            return localStorage.getItem('sessionToken');
        }

        function setSessionToken(sessionToken) {
            localStorage.setItem('sessionToken', sessionToken);
        }

        function getUserId() {
            return localStorage.getItem('userId');
        }

        function setUserId(userId) {
            return localStorage.setItem('userId', userId);
        }

        function getUsername() {
            return localStorage.getItem('username');
        }

        function setUsername(sessionToken) {
            localStorage.setItem('username', sessionToken);
        }
        
        function clearLocalStorage() {
            delete localStorage['username'];
            delete localStorage['sessionToken'];
            delete localStorage['userId'];
        }

        return {
            getSessionToken: getSessionToken,
            setSessionToken: setSessionToken,
            getUsername: getUsername,
            setUsername: setUsername,
            getUserId: getUserId,
            setUserId: setUserId,
            getHeaders: getHeaders,
            clearLocalStorage: clearLocalStorage
        }
    }());

    var Users = (function (argument) {
        var USERS_URL = 'users';

        function Users(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl;
            this._ajaxRequester = ajaxRequester;
        }

        Users.prototype.login = function (username, password) {

            var url = this._serviceUrl + 'login?username=' + username + '&password=' + password;
            console.log(url);
            return this._ajaxRequester.get(url, credentials.getHeaders())
                .then(function (data) {
                    credentials.setSessionToken(data.sessionToken);
                    credentials.setUsername(data.username);
                    credentials.setUserId(data.objectId);
                    return data;
                });
        }

        Users.prototype.register = function (userRegData) {
            var url = this._serviceUrl + 'users';

            return this._ajaxRequester.post(url, userRegData, credentials.getHeaders())
                .then(function (data) {
                    return data;
                });
        }

        Users.prototype.editProfile = function (userId, userProfileData) {
            var url = this._serviceUrl + 'users/' + userId ;

            return this._ajaxRequester.put(url, userProfileData, credentials.getHeaders())
                .then(function (data) {
                    return data;
                });
        }

        Users.prototype.getById = function (userId) {
            var url = this._serviceUrl + 'users/' + userId;
            return this._ajaxRequester.get(url, credentials.getHeaders());
        }

        Users.prototype.getAll = function(usersPerPage, page) {
            var skip = (page - 1) * usersPerPage;
            var url = this._serviceUrl + '/users' + '?skip=' + skip + '&limit=' + usersPerPage;
            return this._ajaxRequester.get(url, credentials.getHeaders());
        }

        Users.prototype.isLogged = function() {
            return credentials.getSessionToken();
        }

        Users.prototype.validateToken = function (sessionToken) {
            var url = this._serviceUrl + 'users/me';
            return this._ajaxRequester.get(url, credentials.getHeaders());
        }

        Users.prototype.getUserData = function () {
            return {
                userId: credentials.getUserId(),
                username: credentials.getUsername(),
                sessionToken: credentials.getSessionToken()
            }
        }

        Users.prototype.logout = function() {
            credentials.clearLocalStorage();
        }

        return Users;
    }());

    // var Posts = (function () {
    //     var POSTS_URL = 'classes/Post';

    //     function Posts(baseUrl, ajaxRequester) {
    //         this._serviceUrl = baseUrl + POSTS_URL;
    //         this._ajaxRequester = ajaxRequester;
    //     }

    //     Posts.prototype.getAll = function () {
    //         var url = this._serviceUrl + "?include=createdBy";
    //         return this._ajaxRequester.get(url, credentials.getHeaders());
    //     }

    //     Posts.prototype.getById = function (objectId) {
    //         return this._ajaxRequester.get(this._serviceUrl + '/' + objectId, credentials.getHeaders());
    //     }

    //     Posts.prototype.add = function (post, objectOwnerId) {
    //         post.ACL = { };
    //         post.ACL[objectOwnerId] = {"write": true, "read": true};
    //         post.ACL['*'] = {"read": true};
    //         return this._ajaxRequester.post(this._serviceUrl, post, credentials.getHeaders());
    //     }

    //     Posts.prototype.delete = function (objectId) {
    //         var url = this._serviceUrl + '/' + objectId;
    //         return this._ajaxRequester.delete(url, credentials.getHeaders());
    //     }

    //     return Posts;
    // }());
    
    // Category repository

    var CategoriesRepository = (function() {
        var CATEGORIES_URL = 'classes/Category';

        function CategoriesRepository(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl + CATEGORIES_URL;
            this._ajaxRequester = ajaxRequester;
        }

        CategoriesRepository.prototype.add = function(category, objectOwnerId) {
            category.ACL = { };
            category.ACL[objectOwnerId] = {"write": true, "read": true};
            category.ACL['*'] = {"read": true};
            return this._ajaxRequester.post(this._serviceUrl, category, credentials.getHeaders());
        }

        CategoriesRepository.prototype.getCategoriesByUserId = function(id) {
            return this._ajaxRequester.get(this._serviceUrl + '?where={"userId":{"__type": "Pointer","className": "_User","objectId": "' + id + '"}}'
                , credentials.getHeaders());
        }

        CategoriesRepository.prototype.getById = function(id) {
            return this._ajaxRequester.get(this._serviceUrl + '/' + id, credentials.getHeaders());
        }

        CategoriesRepository.prototype.updateCategory = function(id, data) {
            return this._ajaxRequester.put(this._serviceUrl + '/' + id, data, credentials.getHeaders());
        }

        CategoriesRepository.prototype.delete = function(id) {
            return this._ajaxRequester.delete(this._serviceUrl + '/' + id, credentials.getHeaders());
        }

        return CategoriesRepository;
    })();

    // Album repository

    var AlbumsRepository = (function() {
        var ALBUMS_URL = 'classes/Album';

        function AlbumsRepository(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl + ALBUMS_URL;
            this._ajaxRequester = ajaxRequester;
        }

        AlbumsRepository.prototype.add = function(album, objectOwnerId) {
            album.ACL = { };
            album.ACL[objectOwnerId] = {"write": true, "read": true};
            album.ACL['*'] = {"read": true};
            return this._ajaxRequester.post(this._serviceUrl, album, credentials.getHeaders());
        }

        AlbumsRepository.prototype.getAlbumsByCategoryId = function(id) { 
            return this._ajaxRequester.get(this._serviceUrl + '?where={"categoryId":{"__type": "Pointer","className": "Category","objectId": "' + id + '"}}&include=categoryId',
                credentials.getHeaders());
        }

        AlbumsRepository.prototype.getById = function(id) {
            return this._ajaxRequester.get(this._serviceUrl + '/' + id, credentials.getHeaders());
        }

        AlbumsRepository.prototype.updateAlbum = function(id, data) {
            return this._ajaxRequester.put(this._serviceUrl + '/' + id, data, credentials.getHeaders());
        }

        AlbumsRepository.prototype.delete = function(id) {
            return this._ajaxRequester.delete(this._serviceUrl + '/' + id, credentials.getHeaders());
        }

        return AlbumsRepository;
    })();

    // Photos repository

    var PhotosRepository = (function() {
        var PHOTOS_URL = 'classes/Photo';

        function PhotosRepository(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl + PHOTOS_URL;
            this._ajaxRequester = ajaxRequester;
        }

        PhotosRepository.prototype.add = function(photoData, objectOwnerId) {
            photoData.ACL = { };
            photoData.ACL[objectOwnerId] = {"write": true, "read": true};
            photoData.ACL['*'] = {"read": true};
            var headers = credentials.getHeaders();
            headers['Content-Type'] = 'application/json';
            return this._ajaxRequester.post(this._serviceUrl, photoData, headers);
        }

        PhotosRepository.prototype.getPhotosByAlbumId = function(id, photosPerPage, page) {
            var skip = (page - 1) * photosPerPage;
            return this._ajaxRequester.get(this._serviceUrl + '?where={"albumId":{"__type": "Pointer","className": "Album","objectId": "' + id + '"}}&include=albumId&skip=' + skip + '&limit=' + photosPerPage,
                credentials.getHeaders());
        }

        PhotosRepository.prototype.getById = function(id) {
            return this._ajaxRequester.get(this._serviceUrl + '/' + id, credentials.getHeaders());
        }

        PhotosRepository.prototype.delete = function(id) {
            return this._ajaxRequester.delete(this._serviceUrl + '/' + id, credentials.getHeaders());
        }

        return PhotosRepository;
    })();

    // Comments repository

    var CommentsRepository = (function() {
        var COMMENTS_URL = 'classes/Comment';

        function CommentsRepository(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl + COMMENTS_URL;
            this._ajaxRequester = ajaxRequester;
        }

        CommentsRepository.prototype.add = function(commentData, objectOwnerId) {
            commentData.ACL = { };
            commentData.ACL[objectOwnerId] = {"write": true, "read": true};
            commentData.ACL['*'] = {"read": true};
            return this._ajaxRequester.post(this._serviceUrl, commentData, credentials.getHeaders());
        }

        CommentsRepository.prototype.getCommentsByPhotoId = function(id) { 
            return this._ajaxRequester.get(this._serviceUrl + '?where={"photoId":{"__type": "Pointer","className": "Photo","objectId": "' + id + '"}}&include=userId',
                credentials.getHeaders());
        }

        CommentsRepository.prototype.delete = function(id) {
            return this._ajaxRequester.delete(this._serviceUrl + '/' + id, credentials.getHeaders());
        }

        return CommentsRepository;
    })();

    var FilesRepository = (function() {
        var FILE_URL = 'files/';

        function FilesRepository(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl + FILE_URL;
            this._ajaxRequester = ajaxRequester;
        }

        FilesRepository.prototype.upload = function(file) {
            var headers = credentials.getHeaders();
            headers['Content-Type'] = file.type;
            return this._ajaxRequester.post(this._serviceUrl + file.name, file, headers, false, false);
        }

        return FilesRepository;
    })();

    var FunctionsRepository = (function() {
        var FUNCTION_URL = 'functions/';

        function FunctionsRepository(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl + FUNCTION_URL;
            this._ajaxRequester = ajaxRequester;
        }

        FunctionsRepository.prototype.execute = function(name, data) {
            return this._ajaxRequester.post(this._serviceUrl + name, data, credentials.getHeaders());
        }

        return FunctionsRepository;
    })();

    var LikesRepository = (function() {
        var LIKES_URL = 'classes/Like';

        function LikesRepository(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl + LIKES_URL;
            this._ajaxRequester = ajaxRequester;
        }

        LikesRepository.prototype.add = function(likeData, objectOwnerId) {
            likeData.ACL = { };
            likeData.ACL[objectOwnerId] = {"write": true, "read": true};
            likeData.ACL['*'] = {"read": true};
            return this._ajaxRequester.post(this._serviceUrl, likeData, credentials.getHeaders());
        }

        LikesRepository.prototype.delete = function(id) {
            return this._ajaxRequester.delete(this._serviceUrl + '/' + id, credentials.getHeaders());
        }

        return LikesRepository;
    })();

    return {
        get: function (baseUrl, ajaxRequester) {
            return new Data(baseUrl, ajaxRequester);
        }
    }
}());
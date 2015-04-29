define(['credentials'], function(credentials) {
    var USERS_URL = 'users';

    function Users(baseUrl, ajaxRequester) {
        this._serviceUrl = baseUrl;
        this._ajaxRequester = ajaxRequester;
    }

    Users.prototype.login = function (username, password) {
        var url = this._serviceUrl + 'login?username=' + username + '&password=' + password;

        return this._ajaxRequester.get(url, credentials.getHeaders());
    }

    Users.prototype.register = function (userRegData) {
        var url = this._serviceUrl + 'users';

        return this._ajaxRequester.post(url, userRegData, credentials.getHeaders());
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

    Users.prototype.setUserData = function (data) {
        credentials.setUsername(data['username']);
        credentials.setSessionToken(data['sessionToken']);
        credentials.setUserId(data['objectId']);
    }

    Users.prototype.logout = function() {
        var _credentials = credentials.getHeaders();
        var url = this._serviceUrl + 'logout';
        credentials.clearLocalStorage();
        return this._ajaxRequester.post(url, null, _credentials);
    }

    return Users;
});

var app = app||{};

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

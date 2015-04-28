define(['credentials'], function (credentials) {
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
});
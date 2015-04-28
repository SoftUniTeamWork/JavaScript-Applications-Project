define(['credentials'], function(credentials) {
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
        return this._ajaxRequester.get(this._serviceUrl + '?where={"photoId":{"__type": "Pointer","className": "Photo","objectId": "' + id + '"}}&include=userId&order=createdAt',
            credentials.getHeaders());
    }

    CommentsRepository.prototype.delete = function(id) {
        return this._ajaxRequester.delete(this._serviceUrl + '/' + id, credentials.getHeaders());
    }

    return CommentsRepository;
});

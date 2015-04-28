var app=app||{};

app.AlbumsRepository = (function() {
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


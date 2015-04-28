define(['credentials'], function (credentials) {
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
        return this._ajaxRequester.get(this._serviceUrl + '?where={"albumId":{"__type": "Pointer","className": "Album","objectId": "'
             + id + '"}}&include=albumId&skip=' + skip + '&limit=' + photosPerPage, credentials.getHeaders());
    }

    PhotosRepository.prototype.getById = function(id) {
        return this._ajaxRequester.get(this._serviceUrl + '/' + id, credentials.getHeaders());
    }

    PhotosRepository.prototype.delete = function(id) {
        return this._ajaxRequester.delete(this._serviceUrl + '/' + id, credentials.getHeaders());
    }

    return PhotosRepository;
});

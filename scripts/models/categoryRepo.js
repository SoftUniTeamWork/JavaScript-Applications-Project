define(['credentials'], function(credentials) {
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
});


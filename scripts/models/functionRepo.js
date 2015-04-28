define(['credentials'], function (credentials) {
    var FUNCTION_URL = 'functions/';

    function FunctionsRepository(baseUrl, ajaxRequester) {
        this._serviceUrl = baseUrl + FUNCTION_URL;
        this._ajaxRequester = ajaxRequester;
    }

    FunctionsRepository.prototype.execute = function(name, data) {
        return this._ajaxRequester.post(this._serviceUrl + name, data, credentials.getHeaders());
    }

    return FunctionsRepository;
});
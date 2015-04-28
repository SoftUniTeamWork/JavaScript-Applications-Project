define(['credentials'], function(credentials) {
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
});

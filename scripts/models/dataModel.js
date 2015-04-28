var app = app || {};

app.data = (function () {

    function Data (baseUrl, ajaxRequester) {
        this.users = new app.Users(baseUrl, ajaxRequester);
        this.categoriesRepository = new app.CategoriesRepository(baseUrl, ajaxRequester);
        this.albumsRepository = new app.AlbumsRepository(baseUrl, ajaxRequester);
        this.photosRepository = new app.PhotosRepository(baseUrl, ajaxRequester);
        this.filesRepository = new app.FilesRepository(baseUrl, ajaxRequester);
        this.commentsRepository = new app.CommentsRepository(baseUrl, ajaxRequester);
        this.functionsRepository = new app.FunctionsRepository(baseUrl, ajaxRequester);
        this.likesRepository = new app.LikesRepository(baseUrl, ajaxRequester);
    }


    return {
        get: function (baseUrl, ajaxRequester) {
            return new Data(baseUrl, ajaxRequester);
        }
    }
}());
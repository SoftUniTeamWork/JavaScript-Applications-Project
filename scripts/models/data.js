define(['albumRepo', 'categoryRepo', 'commentRepo', 'fileRepo', 'functionRepo', 'likeRepo', 'photoRepo', 'userRepo'],
        function(AlbumsRepository, CategoriesRepository, CommentsRepository, FilesRepository, FunctionsRepository, LikesRepository, PhotosRepository, UsersRepository) {

    function Data (baseUrl, ajaxRequester) {
        this.usersRepository = new UsersRepository(baseUrl, ajaxRequester);
        this.categoriesRepository = new CategoriesRepository(baseUrl, ajaxRequester);
        this.albumsRepository = new AlbumsRepository(baseUrl, ajaxRequester);
        this.photosRepository = new PhotosRepository(baseUrl, ajaxRequester);
        this.filesRepository = new FilesRepository(baseUrl, ajaxRequester);
        this.commentsRepository = new CommentsRepository(baseUrl, ajaxRequester);
        this.functionsRepository = new FunctionsRepository(baseUrl, ajaxRequester);
        this.likesRepository = new LikesRepository(baseUrl, ajaxRequester);
    }


    return {
        get: function (baseUrl, ajaxRequester) {
            return new Data(baseUrl, ajaxRequester);
        }
    }
});
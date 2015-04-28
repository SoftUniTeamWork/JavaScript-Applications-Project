define(['helperFunctions', 'noty', 'mustache'], function (helpers, Noty, Mustache) {

    function AlbumController(data) {
        this._data = data;
    }

    AlbumController.prototype.showAlbumsFromCategory = function (id, selector) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to view albums")
            helpers.redirectTo('#/login');
        } else {
            var userId = this._data.usersRepository.getUserData().userId;
            this._data.albumsRepository.getAlbumsByCategoryId(id)
                .then(
                function (data) {
                    var albums = data['results'];
                    albums.forEach(function (album) {
                        if (album['ACL'][userId] && album['ACL'][userId]['write']) {
                            album['showButtons'] = true;
                        }
                    });

                    $.get('./views/album/albums-from-category.html', function (view) {
                        output = Mustache.render(view, data);
                        $(selector).html(output);
                    });
                },
                function (error) {
                    Noty.error("Error loading albums.");
                }
            );
        }
    }

    AlbumController.prototype.new = function (selector) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to create album")
            helpers.redirectTo('#/login');
        } else {
            var userId = this._data.usersRepository.getUserData().userId;
            this._data.categoriesRepository.getCategoriesByUserId(userId)
                .then(function (data) {
                    $.get('./views/album/new-album.html', function (view) {
                        output = Mustache.render(view, data);
                        $(selector).html(output);
                    });
                },
                function (erorr) {
                    Noty.error('Error getting categories list.');
                })
        }
    }

    AlbumController.prototype.create = function (params) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to create album!")
            helpers.redirectTo('#/login');
        } else {
            var userId = this._data.usersRepository.getUserData().userId;
            var albumData = {
                name: params['album-name'],
                categoryId: {__type: 'Pointer', className: 'Category', objectId: params['category-id']}
            };

            this._data.albumsRepository.add(albumData, userId)
                .then(
                function(data) {
                    helpers.redirectTo('#/albums/' + params['category-id']);
                    Noty.success('Album successfully added.');
                },
                function(erorr) {
                    Noty.error('Error creating album.');
                })
        }
    }

    AlbumController.prototype.edit = function (id, selector) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to use this function!")
            helpers.redirectTo('#/login');
        } else {
            this._data.albumsRepository.getById(id)
                .then(function (data) {
                    $.get('./views/album/edit-album.html', function (view) {
                        output = Mustache.render(view, data);
                        $(selector).html(output);
                    });
                },
                function (erorr) {
                    Noty.error('Error getting album info.');
                })
        }
    }

    AlbumController.prototype.update = function (params) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to use this function!")
            helpers.redirectTo('#/login');
        } else {
            var userId = this._data.usersRepository.getUserData().userId;
            var albumData = {
                name: params['album-name']
            }

            this._data.albumsRepository.updateAlbum(params['id'], albumData)
                .then(function(data) {
                    helpers.redirectTo('#/albums/' + params['category-id']);
                },
                function(erorr) {
                    Noty.error('Error updating album.');
                })
        }
    }

    AlbumController.prototype.delete = function (id, categoryId) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to use this function!")
            helpers.redirectTo('#/login');
        } else {
            var userId = this._data.usersRepository.getUserData().userId;
            this._data.albumsRepository.delete(id)
                .then(function (data) {
                    helpers.redirectTo('#/albums/' + categoryId);
                },
                function (erorr) {
                    Noty.error('Error deleting album.');
                })
        }
    }

    return AlbumController;
});
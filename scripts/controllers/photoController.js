define(['helperFunctions', 'noty', 'mustache'], function (helpers, Noty, Mustache) {
    function PhotoController(data) {
        this._data = data;
    }

    var PHOTOS_PER_PAGE = 12,
        PHOTO_MAX_SIZE = 5242880;

    PhotoController.prototype.showPhotoTemplate = function(photoId, selector) {
        $.get('./views/photo/photo.html', function (view) {
            data = {photoId: photoId};
            output = Mustache.render(view, data);
            $(selector).html(output);
        });
    }

    PhotoController.prototype.showPhoto = function (id, selector) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to use this function!")
            helpers.redirectTo('#/login');
        } else {
            var userId = this._data.usersRepository.getUserData().userId,
                photoData = {},
                _this = this;

            this._data.photosRepository.getById(id)
                .then(
                function (data) {
                    photoData['photo'] = data;
                    if (data['ACL'][userId] && data['ACL'][userId]['write']) {
                        photoData['photo']['showButtons'] = true;
                    }

                    $.get('./views/photo/show-photo.html', function (view) {
                        output = Mustache.render(view, photoData);
                        $(selector).html(output);
                    });
                },
                function (error) {
                    Noty.error("Error loading photo.")
                });
        }
    }

    PhotoController.prototype.showPhotosFromAlbum = function (id, page, selector) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to use this function!")
            helpers.redirectTo('#/login');
        } else {
            var userId = this._data.usersRepository.getUserData().userId;
            var page = parseInt(page),
                nextPage = page + 1,
                prevPage = page - 1 < 1 ? 1 : page - 1;

            this._data.photosRepository.getPhotosByAlbumId(id, PHOTOS_PER_PAGE, page)
                .then(
                function (data) {
                    if (data['results'].length === 0 && page > 1) {
                        helpers.redirectTo('#/photos/showalbum/' + id + '/' + (page - 1));
                    }

                    var photos = data['results'];
                    photos.forEach(function (photo) {
                        if (photo['ACL'][userId] && photo['ACL'][userId]['write']) {
                            photo['showButtons'] = true;
                        }
                    });

                    data['pageInfo'] = {nextPage: nextPage, prevPage: prevPage};
                    $.get('./views/photo/photos-from-album.html', function (view) {
                        output = Mustache.render(view, data);
                        $(selector).html(output);
                    });
                },
                function (error) {
                    Noty.error("Error loading photos.");
                }
            );
        }
    }

    PhotoController.prototype.new = function (id, selector) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first add photo!")
            helpers.redirectTo('#/login');
        } else {
            $.get('./views/photo/new-photo.html', function (view) {
                var data = {
                    albumId: id
                }
                var output = Mustache.render(view, data);
                $(selector).html(output);
            });
        }
    }

    PhotoController.prototype.create = function (params) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to use this function")
            helpers.redirectTo('#/login');
        } else {
            var _this = this,
                userId = this._data.usersRepository.getUserData().userId,
                picInput = document.getElementById('photoInput'),
                picture = picInput.files[0],
                size = picture.size || picture.fileSize,
                mime = picture.type || picture.mimeType;

            if (picture.size > PHOTO_MAX_SIZE) {
                Noty.error('Photo size is too large');
                return;
            } else if (!mime.match(/image\/.*/)) {
                Noty.error('File is not in correct format');
                return;
            }

            this._data.filesRepository.upload(picture)
                .then(
                function (data) {
                    var photoData = {
                        name: params['photo-name'],
                        picture: {
                            '__type': 'File',
                            'url': data.url,
                            'name': data.name
                        },
                        albumId: {__type: 'Pointer', className: 'Album', objectId: params['id']}
                    }
                    _this._data.photosRepository.add(photoData, userId)
                        .then(
                        function (data) {
                            Noty.success('Photo successfully added.');
                            helpers.redirectTo('#/photos/show/' + data['objectId']);
                        },
                        function (data) {
                            Noty.error('Error adding photo.');
                        })
                },
                function (erorr) {
                    Noty.error('Error uploading file.');
                })
        }
    }

    PhotoController.prototype.delete = function (id, albumId) {
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to delete photo")
            helpers.redirectTo('#/login');
        } else {
            var userId = this._data.usersRepository.getUserData().userId;
            this._data.photosRepository.delete(id)
                .then(function (data) {
                    helpers.redirectTo('#/photos/showalbum/' + albumId + '/1');
                },
                function (erorr) {
                    Noty.error('Error deleting photo.');
                })
        }
    }
    
    return PhotoController;
});

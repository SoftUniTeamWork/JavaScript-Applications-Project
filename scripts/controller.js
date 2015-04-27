var app = app || {};

app.controller = (function () {

    function BaseController(data) {
        this._data = data;
    }

    BaseController.prototype.loadHeader = function (headerSelector) {
        var userData;
        if (!this._data.users.isLogged()) {
            $(headerSelector).html("");
        } else {
            userData = this._data.users.getUserData();

            this._data.users.getById(userData.userId)
                .then(function (data) {
                    $.get('./views/user-header.html', function (view) {
                        var output = Mustache.render(view, data);
                        $(headerSelector).html(output);
                    });
                }
            );
        }
    }

    BaseController.prototype.loadHome = function (selector) {
        var output,
            _this = this,
            data;

        if (!this._data.users.isLogged()) {
            $(selector).load('./views/default-home.html');
        } else {
            data = _this._data.posts.getAll()
                .then(
                function (data) {
                    $.get('./views/posts.html', function (view) {
                        data.results.forEach(function (e) {
                            var isoDateString = e.createdAt;
                            e.createdAt = formatDate(isoDateString);
                        });

                        output = Mustache.render(view, data);
                        $(selector).html(output);
                    });
                },
                function (error) {
                    Noty.error("Error loading posts.");
                }
            );
        }
    }


    BaseController.prototype.loadRegister = function (selector) {
        $(selector).load('./views/log/register.html');
    }

    BaseController.prototype.logout = function (selector) {
        this._data.users.logout();
        Noty.success("Successfully logged out.");
        redirectTo('.#/login');
    }

    BaseController.prototype.loadEditProfile = function (selector) {
        var userData;
        if (!this._data.users.isLogged()) {
            redirectTo('#/login');
        }
        else {
            userData = this._data.users.getUserData();
            this._data.users.getById(userData.userId)
                .then(function (data) {
                    $.get('views/edit-profile.html', function (view) {
                        var output = Mustache.render(view, data),
                            gender = data.gender;
                        $(selector).html(output);
                        $('input[type="radio"][value=' + gender + ']')
                            .attr('checked', true);
                    });
                });
        }
    }

    BaseController.prototype.attachEventHandlers = function () {
        var selector = '#main',
            headerSelector = '#header';

        attachLoginHandler.call(this, selector);
        attachRegisterHandler.call(this, selector);
        attachHoverHandler.call(this, selector);
        attachShowPostHandler.call(this, headerSelector);
        attachSubmitPostHandler.call(this, selector);
        attachPictureUploadHandler.call(this, selector);
        attachEditProfileHandler.call(this, selector);
    }

    var attachSubmitPostHandler = function (selector) {
        var _this = this;

        $(selector).on('click', '#submit-post-btn', function () {
            var userId = _this._data.users.getUserData().userId;

            var post = {
                content: $('#post-content').val(),
                createdBy: {
                    __type: "Pointer",
                    className: "_User",
                    objectId: userId
                }
            };

            _this._data.posts.add(post, userId)
                .then(function (data) {
                    _this.loadHome(selector);
                    Noty.success('Post successfully added.');
                },
                function (error) {
                    Noty.error('Error submitting post.');
                });
        });
    }

    var attachPictureUploadHandler = function (selector) {
        $(selector).on('click', '#upload-file-button', function () {
            $('#picture').click();
        });

        $(selector).on('change', '#picture', function () {
            var file = this.files[0];
            if (file.type.match(/image\/.*/)) {
                var reader = new FileReader();
                reader.onload = function () {
                    $('.picture-name').text(file.name);
                    $('.picture-preview').attr('src', reader.result);
                    $('#picture').attr('data-picture-data', reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                Noty.error("Invalid file format.");
            }
        });
    }

    var attachShowPostHandler = function (selector) {
        $(selector).on('click', '#post-btn', function () {
            var container = $('#post-container');
            container.is(':visible') ? container.slideUp() : container.slideDown();
        });
    }

    var attachHoverHandler = function (selector) {
        var that = this;
        $(selector).on('mouseenter', '.profile-link', function () {
            var thisPerson = this,
                id = $(thisPerson).attr('data-user-id');

            var offset = $(thisPerson).offset();
            $('.hover-box')
                .css({
                    top: offset.top + 30,
                    left: offset.left + 10
                })
                .show();

            that._data.users.getById(id)
                .then(
                function (data) {
                    $.get('views/hover-box.html', function (view) {
                            var output = Mustache.render(view, data);
                            $('.hover-box').html(output);
                        }
                    );
                },
                function (error) {
                    Noty.error("Error retrieving data.");
                }
            )
        });

        $(selector).on('mouseleave', '.profile-link', function () {
            $('.hover-box').html("<p>Loading...</p>");
            $('.hover-box').hide();
        });
    }

    var attachEditProfileHandler = function (selector) {
        var _this = this;
        $(selector).on('click', '#save-btn', function () {
            var userId = _this._data.users.getUserData().userId,
                userEditProfileData = {
                    password: $('#password').val(),
                    name: $('#name').val(),
                    about: $('#about').val(),
                    gender: $('input[name="gender-radio"]:checked').val(),
                    picture: $('#picture').attr('data-picture-data')
                };

            _this._data.users.editProfile(userId, userEditProfileData)
                .then(function (data) {
                    Noty.success("Profile successfully edited.");
                    redirectTo('#/');
                },
                function (error) {
                    Noty.error("Error saving changes. Please try again.");
                });
        });

        $(selector).on('click', '.cancel-btn', function () {
            redirectTo('#/');
        });
    }

    var attachLoginHandler = function (selector, data) {

        var _data = data;
        var _this = this;

        $(selector).find('#login-btn').click(function () {
            var username = $('#login-username').val(),
                password = $('#login-password').val();
            console.log(username);

            data.users.login(username, password)
                .then(function (data) {
                    _data.users.setUserData(data);
                    Noty.success("Successfully logged in.");
                    redirectTo('#/users/home/' + _data.users.getUserData().userId);
                },
                function (error) {
                    Noty.error("Incorrect username/password.");
                }
            );
        });
    }

    var attachRegisterHandler = function (selector, data) {


        $(selector).on('click', '#reg-btn', function () {


            var userRegData = {
                username: $('#reg-username').val(),
                password: $('#reg-password').val(),
                //repeatPass: $('#repeat-password').val(),
                email: $('#reg-email').val()
            };

            if ($('#repeat-password').val() !== userRegData.password) {
                Noty.error("passwords do not match");
            }
            else {
                data.users.register(userRegData)
                    .then(function (data) {
                        Noty.success("Registration successful.");
                        redirectTo('#/login');
                    },
                    function (error) {
                        Noty.error("Your registration has encountered an error.");
                    });
            }
        });

    }

    function formatDate(isoString) {
        var timestamp = new Date(Date.parse(isoString)),
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return timestamp.getDate() + '-' + months[timestamp.getMonth()] + '-' + timestamp.getFullYear()
            + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes();
    }

    // Keep this method
    function redirectTo(url) {
        window.location = url;
    }


    var LogController = (function () {
        function LogController(data) {
            this._data = data
        }

        LogController.prototype.loadRegister = function (selector) {
            var data = this._data;
            $(selector).load('./views/log/register.html', function () {
                attachRegisterHandler(selector, data)
            });
        }

        LogController.prototype.loadLogin = function (selector) {
            var data = this._data;
            $(selector).load('./views/log/login.html', function () {
                attachLoginHandler(selector, data);
            });
        }

        LogController.prototype.logout = function (selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to logout")
                redirectTo('#/login');
            } else {
                this._data.users.logout()
                    .then(
                    function (data) {
                        console.log('kur');
                        Noty.success("Successfully logged out.");
                        redirectTo('#/login');
                    },
                    function (error) {
                        console.log("kur2");
                        Noty.error("Error logging out.");
                    });
            }
        }

        return LogController;
    })();

    // Users controller

    var UserController = (function () {
        var USERS_PER_PAGE = 10;

        function UserController(data) {
            this._data = data;
        }

        UserController.prototype.showAllUsers = function (page, selector) {

            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in to see all users")
                redirectTo('#/login');
            } else {
                var page = parseInt(page),
                    nextPage = page + 1,
                    prevPage = page - 1 < 1 ? 1 : page - 1;

                this._data.users.getAll(USERS_PER_PAGE, page)
                    .then(
                    function (data) {
                        if (data['results'].length === 0 && page > 1) {
                            redirectTo('#/users/showall/' + id + '/' + (page - 1));
                        }
                        data['pageInfo'] = {nextPage: nextPage, prevPage: prevPage};

                        $.get('./views/user/user-all.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                    },
                    function (error) {
                        Noty.error("Error loading users data.");
                    }
                );
            }
            ;
        }

        UserController.prototype.showProfile = function (userId, selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to view profile")
                redirectTo('#/login');
            } else {
                this._data.users.getById(userId)
                    .then(
                    function (data) {
                        data['createdAt'] = formatDate(data['createdAt']);
                        $.get('./views/user/user-profile.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                    },
                    function (error) {
                        Noty.error("Error loading user data.");
                    }
                );
            }
        }

        UserController.prototype.showTopPhotosOfUser = function (userId, selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to see top user photos")
                redirectTo('#/login');
            } else {
                var sendData = {userId: userId};
                this._data.functionsRepository.execute('getMostLikedUserPhotos', sendData)
                    .then(
                    function (data) {
                        $.get('./views/user/user-home-top-photos.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).prepend(output);
                        });
                    },
                    function (error) {
                        Noty.error("Error loading user's most liked photos.");
                    }
                );
            }
        }

        UserController.prototype.showTopPhotosOfAllUsers = function (selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to view top photos")
                redirectTo('#/login');
            } else {
                this._data.functionsRepository.execute('getMostLikedPhotos')
                    .then(
                    function (data) {
                        $.get('./views/user/user-home-top-photos-all.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).append(output);
                        });
                    },
                    function (error) {
                        Noty.error("Error loading most liked photos.");
                    }
                );
            }
        }

        return UserController;
    })();

    // Category Controller
    // Will be moved to separate script with require.js

    var CategoryController = (function () {
        function CategoryController(data) {
            this._data = data;
        }

        CategoryController.prototype.showCategories = function (userId, selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in to view your categories!")
                redirectTo('#/login');
            } else {
                var currentUserId = this._data.users.getUserData().userId;

                this._data.categoriesRepository.getCategoriesByUserId(userId)
                    .then(
                    function (data) {
                        var categories = data['results'];
                        categories.forEach(function (category) {
                            if (category['ACL'][currentUserId] && category['ACL'][currentUserId]['write']) {
                                category['showButtons'] = true;
                            }
                        });

                        $.get('./views/category/all-categories.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                    },
                    function (error) {
                        Noty.error("Error loading categories.");
                    }
                );
            }
        }
        CategoryController.prototype.new = function (selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to create category!")
                redirectTo('#/login');
            } else {
                $(selector).load('./views/category/new-category.html');
            }
        }

        CategoryController.prototype.create = function (params) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first create category")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
                var categoryData = {
                    name: params['category-name'],
                    userId: {__type: 'Pointer', className: '_User', objectId: userId}
                };

                this._data.categoriesRepository.add(categoryData, userId)
                    .then(
                    function (data) {
                        redirectTo('#/categories/showall/' + userId);
                        Noty.success('Category successfully added.');
                    },
                    function (erorr) {
                        Noty.error('Error submitting category.');
                    })
            }
        }

        CategoryController.prototype.edit = function (id, selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to edit category!")
                redirectTo('#/login');
            } else {
                this._data.categoriesRepository.getById(id)
                    .then(function (data) {
                        $.get('./views/category/edit-category.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                    },
                    function (erorr) {
                        Noty.error('Error getting category info.');
                    })
            }
        }

        CategoryController.prototype.update = function (params) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to update category")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
                categoryData = {
                    name: params['category-name']
                }

                this._data.categoriesRepository.updateCategory(params['id'], categoryData)
                    .then(function (data) {
                        redirectTo('#/categories/showall/' + userId);
                    },
                    function (erorr) {
                        Noty.error('Error updating category.');
                    })
            }
        }
        CategoryController.prototype.delete = function (id) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to delete category!")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
                this._data.categoriesRepository.delete(id)
                    .then(function (data) {
                        redirectTo('#/categories/showall/' + userId);
                    },
                    function (erorr) {
                        Noty.error('Error deleting category.');
                    })
            }
        }
        return CategoryController;
    })();

    var AlbumController = (function () {
        function AlbumController(data) {
            this._data = data;
        }

        AlbumController.prototype.showAlbumsFromCategory = function (id, selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to view albums")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
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
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to create album")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
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
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to create album!")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
                var albumData = {
                    name: params['album-name'],
                    categoryId: {__type: 'Pointer', className: 'Category', objectId: params['category-id']}
                };

                this._data.albumsRepository.add(albumData, userId) 
                    .then(
                    function(data) {
                        redirectTo('#/albums/' + params['category-id']);
                        Noty.success('Album successfully added.');
                    }, 
                    function(erorr) {
                        Noty.error('Error creating album.');
                    })
            }
        }

        AlbumController.prototype.edit = function (id, selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to use this function!")
                redirectTo('#/login');
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
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to use this function!")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
                var albumData = {
                    name: params['album-name']
                }

                this._data.albumsRepository.updateAlbum(params['id'], albumData)
                    .then(function(data) {
                        redirectTo('#/albums/' + params['category-id']);
                    }, 
                    function(erorr) {
                        Noty.error('Error updating album.');
                    })
            }
        }

        AlbumController.prototype.delete = function (id, categoryId) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to use this function!")
                redirectTo('#/login');
            } else {
            var userId = this._data.users.getUserData().userId;
            this._data.albumsRepository.delete(id)
                .then(function (data) {
                    redirectTo('#/albums/' + categoryId);
                },
                function (erorr) {
                    Noty.error('Error deleting album.');
                })
            }
        }

        return AlbumController;
    })();

    // Photo Controller
    // Will be moved to separate script with require.js

    var PhotoController = (function () {
        function PhotoController(data) {
            this._data = data;
        }

        var PHOTOS_PER_PAGE = 5,
            PHOTO_MAX_SIZE = 5242880;

        PhotoController.prototype.showPhotoTemplate = function(photoId, selector) {
            $.get('./views/photo/photo.html', function (view) {
                data = {photoId: photoId};
                output = Mustache.render(view, data);
                $(selector).html(output);
            });
        }

        PhotoController.prototype.showPhoto = function (id, selector) {
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to use this function!")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId,
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
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to use this function!")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
                var page = parseInt(page),
                    nextPage = page + 1,
                    prevPage = page - 1 < 1 ? 1 : page - 1;

                this._data.photosRepository.getPhotosByAlbumId(id, PHOTOS_PER_PAGE, page)
                    .then(
                    function (data) {
                        if (data['results'].length === 0 && page > 1) {
                            redirectTo('#/photos/showalbum/' + id + '/' + (page - 1));
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
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first add photo!")
                redirectTo('#/login');
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
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to use this function")
                redirectTo('#/login');
            } else {
                var _this = this,
                    userId = this._data.users.getUserData().userId,
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
                                redirectTo('#/photos/show/' + data['objectId']);
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
            if (!this._data.users.isLogged()) {
                Noty.error("You must be logged in first to delete photo")
                redirectTo('#/login');
            } else {
                var userId = this._data.users.getUserData().userId;
                this._data.photosRepository.delete(id)
                    .then(function (data) {
                        redirectTo('#/photos/showalbum/' + albumId + '/1');
                    },
                    function (erorr) {
                        Noty.error('Error deleting photo.');
                    })
            }
        }
        return PhotoController;
    })();

    // Comment Controller
    // Will be moved to separate script with require.js

    var CommentController = (function () {
        function CommentController(data) {
            this._data = data;
        }

        CommentController.prototype.showCommentsForPhoto = function (id, selector) {

            var userId = this._data.users.getUserData().userId;
            this._data.commentsRepository.getCommentsByPhotoId(id)
                .then(
                function (data) {
                    var comments = data['results'];
                    comments.forEach(function (comment) {
                        if (comment['ACL'][userId] && comment['ACL'][userId]['write']) {
                            comment['showButtons'] = true;
                        }
                    });

                    $.get('./views/comment/comments-for-photo.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                },
                function (error) {
                    Noty.error("Error loading comments.");
                }
            );
        }

        CommentController.prototype.create = function (params) {
            var userId = this._data.users.getUserData().userId;
            var commentData = {
                content: params['content'],
                photoId: {__type: 'Pointer', className: 'Photo', objectId: params['id']},
                userId: {__type: 'Pointer', className: '_User', objectId: userId}
            };

            this._data.commentsRepository.add(commentData, userId)
                .then(
                function(data) {
                    redirectTo('#/comments/show/' + params['id']);
                    Noty.success('Comment successfully added.');
                },
                function (erorr) {
                    Noty.error('Error creating comment.');
                }); 
        }

        CommentController.prototype.delete = function(id, photoId) {
            this._data.commentsRepository.delete(id)
                .then(function(data) {
                    redirectTo('#/comments/show/' + photoId);
                }, 
                function(erorr) {
                    Noty.error('Error deleting comment.');
                });
        }

        return CommentController;
    })();

    // Likes controller

    var LikeController = (function () {
        function LikeController(data) {
            this._data = data;
        }

        LikeController.prototype.create = function (id) {
            var userId = this._data.users.getUserData().userId;
            var likeData = {
                photoId: {__type: 'Pointer', className: 'Photo', objectId: id},
                userId: {__type: 'Pointer', className: '_User', objectId: userId}
            };

            this._data.likesRepository.add(likeData, userId)
                .then(
                function(data) {
                    redirectTo('#/likes/show/' + id);
                    Noty.success('Like successfully submitted.');
                }, 
                function(erorr) {
                    Noty.error('Error submitting like.');
                });  
        }

        LikeController.prototype.delete = function(id, photoId) {
            var userId = this._data.users.getUserData().userId;
            this._data.likesRepository.delete(id)
                .then(function(data) {
                    redirectTo('#/likes/show/' + photoId);
                }, 
                function(erorr) {
                    Noty.error('Error deleting like.');
                })
        }

        LikeController.prototype.showLikes = function(photoId, selector) {
            var userId = this._data.users.getUserData().userId;

            this._data.functionsRepository.execute('likesCount', {photoId: photoId, userId: userId})
                .then(
                    function(data){
                        var likesData = {};
                        likesData['likes'] = data['result'];
                        likesData['photoId'] = photoId;
                        $.get('./views/like/likes-for-photo.html', function (view) {
                            output = Mustache.render(view, likesData);
                            $(selector).html(output);
                        });
                    }, 
                    function(error){
                        console.log(error);
                    });
        }

        return LikeController;
    })();

    // Navigation Controller
    // Will be moved to separate script with require.js

    var NavigationController = (function () {
        function NavigationController(data) {
            this._data = data;
        }

        NavigationController.prototype.showProfileNavigation = function (selector) {
            var _this = this;
            $.get('./views/navigation/profile-navigation.html', function (view) {
                var data = _this._data.users.getUserData();
                output = Mustache.render(view, data);
                $(selector).html(output);
            });
        }

        NavigationController.prototype.showDefaultNavigation = function (selector) {
            $.get('./views/navigation/default.html', function (view) {
                $(selector).html(view);
            });
        }

        return NavigationController;
    })();

    return {
        getControllers: function (data) {
            return {
                categoryController: new CategoryController(data),
                logController: new LogController(data),
                albumController: new AlbumController(data),
                photoController: new PhotoController(data),
                navigationController: new NavigationController(data),
                commentController: new CommentController(data),
                likeController: new LikeController(data),
                userController: new UserController(data)
                // add new controllers here
            }
        }
    }
}());
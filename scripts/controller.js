var app = app || {};

app.controller = (function () {

    function BaseController(data) {
        this._data = data;
    }

    BaseController.prototype.loadHeader = function(headerSelector) {
        var userData;
        if (!this._data.users.isLogged()) {
            $(headerSelector).html("");
        } else {
            userData = this._data.users.getUserData();

            this._data.users.getById(userData.userId)
                .then(function(data) {
                    $.get('./views/user-header.html', function(view) {
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
        redirectTo('.#/');
    }

    BaseController.prototype.loadEditProfile = function (selector) {
        var userData;
        if (!this._data.users.isLogged()) {
            redirectTo('#/');
            return;
        }

        userData = this._data.users.getUserData();
        this._data.users.getById(userData.userId)
            .then(function(data) {
                $.get('views/edit-profile.html', function(view) {
                    var output = Mustache.render(view ,data),
                        gender = data.gender;
                    $(selector).html(output);
                    $('input[type="radio"][value=' + gender + ']')
                        .attr('checked', true);
                });
            });
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

        $(selector).on('click', '#submit-post-btn', function() {
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
                .then(function(data) {
                    _this.loadHome(selector);
                    Noty.success('Post successfully added.');
                },
                function(error) {
                    Noty.error('Error submitting post.');
                });
        });
    }

    var attachPictureUploadHandler = function (selector) {
        $(selector).on('click', '#upload-file-button', function() {
            $('#picture').click();
        });

        $(selector).on('change', '#picture', function() {
            var file = this.files[0];
            if (file.type.match(/image\/.*/)) {
                var reader = new FileReader();
                reader.onload = function() {
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
        $(selector).on('click', '#post-btn', function() {
            var container = $('#post-container');
            container.is(':visible') ? container.slideUp() : container.slideDown();
        });
    }

    var attachHoverHandler = function (selector) {
        var that = this;
        $(selector).on('mouseenter', '.profile-link', function() {
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
                function(data) {
                    $.get('views/hover-box.html', function (view) {
                            var output = Mustache.render(view, data);
                            $('.hover-box').html(output);
                        }
                    );
                },
                function(error) {
                    Noty.error("Error retrieving data.");
                }
            )
        });

        $(selector).on('mouseleave', '.profile-link', function() {
            $('.hover-box').html("<p>Loading...</p>");
            $('.hover-box').hide();
        });
    }

    var attachEditProfileHandler = function (selector) {
        var _this = this;
        $(selector).on('click', '#save-btn', function() {
            var userId = _this._data.users.getUserData().userId,
                userEditProfileData = {
                    password: $('#password').val(),
                    name: $('#name').val(),
                    about: $('#about').val(),
                    gender: $('input[name="gender-radio"]:checked').val(),
                    picture: $('#picture').attr('data-picture-data')
            };

            _this._data.users.editProfile(userId, userEditProfileData)
                .then(function(data) {
                    Noty.success("Profile successfully edited.");
                    redirectTo('#/');
                },
                function(error) {
                    Noty.error("Error saving changes. Please try again.");
                });
        });

        $(selector).on('click', '.cancel-btn', function() {
            redirectTo('#/');
        });
    }

    var attachLoginHandler = function (selector,data) {


        $(selector).on('click', '#login-btn', function () {
            var username = $('#login-username').val(),
                password = $('#login-password').val();

            data.users.login(username, password)
                .then(function (data) {
                    redirectTo('#/');
					Noty.success("Successfully logged in.");
                },
                function (error) {
                    Noty.error("Incorrect username/password.");
                }
            );
        });
    }

    var attachRegisterHandler = function (selector,data) {


        $(selector).on('click', '#reg-btn', function () {


            var userRegData = {
                username: $('#reg-username').val(),
                password: $('#reg-password').val(),
                email: $('#reg-email').val()
            };

            data.users.register(userRegData)
                .then(function (data) {
                    Noty.success("Registration successful.");
                    redirectTo('#/');
                },
                function (error) {
                    Noty.error("Your registration has encountered an error.");
                });
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

    function LogController(data){
        this._data = data
    }

    LogController.prototype.loadRegister = function (selector) {
        var data = this._data;
        $(selector).load('./views/log/register.html',function(){
            attachRegisterHandler(selector,data)
        });
    }

    LogController.prototype.loadLogin = function (selector) {
        var data = this._data
        $(selector).load('./views/log/login.html', function(){
            attachLoginHandler(selector,data);
        });
    }

    LogController.prototype.logout = function (selector) {
        //console.log(this._data)
        this._data.users.logout();
        Noty.success("Successfully logged out.");
        redirectTo('#/');
    }



    // Category Controller
    // Will be moved to separate script with require.js

    var CategoryController = (function(){
        function CategoryController(data) {
            this._data = data;
        }

        CategoryController.prototype.showCategory = function(selector) {
            
        }

        CategoryController.prototype.showCategories = function(userId, selector) {
            this._data.categoriesRepository.getCategoriesByUserId(userId)
                .then(
                function(data) {
                    $.get('./views/category/all-categories.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                },
                function(error) {
                    Noty.error("Error loading categories.");
                }
            );
        }

        CategoryController.prototype.new = function(selector) {
            $(selector).load('./views/category/new-category.html');
        }

        CategoryController.prototype.create = function(params) {
            var userId = this._data.users.getUserData().userId;
            var categoryData = {
                    name: params['category-name'],
                    userId: {__type: 'Pointer', className: '_User', objectId: userId}
                };
            
            this._data.categoriesRepository.add(categoryData, userId) 
                .then(
                function(data) {
                    redirectTo('#/categories/' + userId);
                    Noty.success('Category successfully added.');
                }, 
                function(erorr) {
                    Noty.error('Error submitting category.');
                })
        }

        CategoryController.prototype.edit = function(id, selector) {
            this._data.categoriesRepository.getById(id)
                .then(function(data) {
                    $.get('./views/category/edit-category.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                }, 
                function(erorr) {
                    Noty.error('Error getting category info.');
                })
        }

        CategoryController.prototype.update = function(params) {
            var userId = this._data.users.getUserData().userId;
            categoryData = {
                name: params['category-name']
            }

            this._data.categoriesRepository.updateCategory(params['id'], categoryData)
                .then(function(data) {
                    redirectTo('#/categories/' + userId);
                }, 
                function(erorr) {
                    Noty.error('Error updating category.');
                })
        }

        CategoryController.prototype.delete = function(id) {
            var userId = this._data.users.getUserData().userId;
            this._data.categoriesRepository.delete(id)
                .then(function(data) {
                    redirectTo('#/categories/' + userId);
                }, 
                function(erorr) {
                    Noty.error('Error deleting category.');
                })
        }

        return CategoryController;
    })();

    // Events for categories views 

    // CategoryController.prototype.attachEventHandlers = function() {
    //     var selector = "#main";

    //     attachNewCategoryEvents.call(this, selector);
    // }

    // var attachNewCategoryEvents = function(selector) {
    //     var _this = this;

    //     // events for new category view
    // }

    // Album Controller
    // Will be moved to separate script with require.js

    var AlbumController = (function(){
        function AlbumController(data) {
            this._data = data;
        }

        AlbumController.prototype.showAlbum = function(selector) {
            
        }

        AlbumController.prototype.showAlbumsFromCategory = function(id, selector) {
            this._data.albumsRepository.getAlbumsByCategoryId(id)
                .then(
                function(data) {
                    $.get('./views/album/albums-from-category.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                },
                function(error) {
                    Noty.error("Error loading albums.");
                }
            );
        }

        AlbumController.prototype.new = function(selector) {
            var userId = this._data.users.getUserData().userId;
            this._data.categoriesRepository.getCategoriesByUserId(userId)
                .then(function(data) {
                    $.get('./views/album/new-album.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                }, 
                function(erorr) {
                    Noty.error('Error getting categories list.');
                })
        }

        AlbumController.prototype.create = function(params) {
            var userId = this._data.users.getUserData().userId;
            var albumData = {
                    name: params['album-name'],
                    categoryId: {__type: 'Pointer', className: 'Category', objectId: params['category-id']}
                };
        
            this._data.albumsRepository.add(albumData, userId) 
                .then(
                function(data) {
                    redirectTo('#/categories/' + userId);
                    Noty.success('Album successfully added.');
                }, 
                function(erorr) {
                    Noty.error('Error creating album.');
                })
        }

        AlbumController.prototype.edit = function(id, selector) {
            this._data.albumsRepository.getById(id)
                .then(function(data) {
                    $.get('./views/album/edit-album.html', function (view) {
                            output = Mustache.render(view, data);
                            $(selector).html(output);
                        });
                }, 
                function(erorr) {
                    Noty.error('Error getting album info.');
                })
        }

        AlbumController.prototype.update = function(params) {
            var userId = this._data.users.getUserData().userId;
            var albumData = {
                name: params['album-name']
            }

            this._data.albumsRepository.updateAlbum(params['id'], albumData)
                .then(function(data) {
                    redirectTo('#/categories/' + userId);
                }, 
                function(erorr) {
                    Noty.error('Error updating album.');
                })
        }

        AlbumController.prototype.delete = function(id) {
            var userId = this._data.users.getUserData().userId;
            this._data.albumsRepository.delete(id)
                .then(function(data) {
                    redirectTo('#/categories/' + userId);
                }, 
                function(erorr) {
                    Noty.error('Error deleting album.');
                })
        }

        return AlbumController;
    })();



    return {
        getControllers: function (data) {
            return {
                categoryController: new CategoryController(data),
                logController: new LogController(data),
                albumController: new AlbumController(data)
                // add new controllers here
            }
        }
    }
}());
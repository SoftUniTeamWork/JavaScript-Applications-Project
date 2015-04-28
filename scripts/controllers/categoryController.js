var app=app||{};

app.CategoryController = (function () {
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

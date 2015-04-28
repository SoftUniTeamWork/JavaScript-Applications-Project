define(['mustache'], function (Mustache) {
    function NavigationController(data) {
        this._data = data;
    }

    NavigationController.prototype.showProfileNavigation = function (activeTab, selector) {
        var _this = this;
        $.get('./views/navigation/profile-navigation.html', function (view) {
            var data = _this._data.usersRepository.getUserData();
            data['activeTab'] = activeTab;
            output = Mustache.render(view, data);
            $(selector).html(output);
        });
    }

    NavigationController.prototype.showDefaultNavigation = function (activeTab, selector) {
        $.get('./views/navigation/default.html', function (view) {
            var data = {activeTab: activeTab};
            output = Mustache.render(view, data);
            $(selector).html(output);
        });
    }

    return NavigationController;
});


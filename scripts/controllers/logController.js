define(['helperFunctions', 'noty'], function (helpers, Noty) {
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
        if (!this._data.usersRepository.isLogged()) {
            Noty.error("You must be logged in first to logout")
            helpers.redirectTo('#/login');
        } else {
            this._data.usersRepository.logout()
                .then(
                function (data) {
                    Noty.success("Successfully logged out.");
                    helpers.redirectTo('#/login');
                },
                function (error) {
                    Noty.error("Error logging out.");
                });
        }
    }

    var attachLoginHandler = function (selector, data) {

        var _data = data;
        var _this = this;

        $(selector).find('#login-btn').click(function () {
            var username = $('#login-username').val(),
                password = $('#login-password').val();

            data.usersRepository.login(username, password)
                .then(function (data) {
                    _data.usersRepository.setUserData(data);
                    Noty.success("Successfully logged in.");
                    helpers.redirectTo('#/users/home/' + _data.usersRepository.getUserData().userId);
                },
                function (error) {
                    Noty.error("Incorrect username/password.");
                }
            );
        });
    }

    var attachRegisterHandler = function (selector, data) {


        $(selector).find('#reg-btn').click(function () {


            var userRegData = {
                username: $('#reg-username').val(),
                password: $('#reg-password').val(),
                email: $('#reg-email').val()
            };

            if ($('#repeat-password').val() !== userRegData.password) {
                Noty.error("passwords do not match");
            }
            else {
                data.usersRepository.register(userRegData)
                    .then(function (data) {
                        Noty.success("Registration successful.");
                        helpers.redirectTo('#/login');
                    },
                    function (error) {
                        Noty.error("Your registration has encountered an error.");
                    });
            }
        });

    }

    return LogController;
});

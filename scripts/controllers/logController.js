var app=app||{};

app.LogController = (function () {
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


        $(selector).find('#reg-btn').click(function () {


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

    return LogController;
})();
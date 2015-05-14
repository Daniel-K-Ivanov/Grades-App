(function () {
    $(function () {
        registerEventHandlers();
        var currentUser = userSession.getCurrentUser();
        if (currentUser) {
            showGradesView()
        } else {
            showHomeView();
        }

    });
    function registerEventHandlers() {
        $("#btnShowLoginView").click(showLoginView);
        $("#btnShowRegisterView").click(showRegisterView);
        $("#btnLogin").click(login);
        $("#btnRegister").click(register);
        $('#addBtn').click(addGrade);
    }

    function showHomeView() {
        $("main > *").hide();
        $("#homeView").show();
        $('header span').text('Grades App').attr('style', 'padding-left:0px');
    }

    function showLoginView() {
        $("main > *").hide();
        $("#loginView").show();
    }

    function showRegisterView() {
        $("main > *").hide();
        $("#registerView").show();
    }

    function login() {
        var username = $("#txtLoginUsername").val();
        var password = $("#txtLoginPassword").val();
        ajaxRequester.login(username, password, authSuccess, loginError);
    }

    
    function register() {
        var username = $("#txtRegisterUsername").val();
        var password = $("#txtRegisterPassword").val();
        ajaxRequester.register(username, password,
            function (data) {
                data.username = username;
                authSuccess(data);
            },
            loginError);
    }

    function loginError() {
        alert("Login failed.");
    }

    function authSuccess(data) {
        userSession.login(data);
        showGradesView();
    }

    function showGradesView() {
        var currentUser = userSession.getCurrentUser(); 
        if (currentUser) {
            $("main > *").hide();
            $('header span').text(currentUser.username + '`s grades').attr('style','padding-left:150px');
            $('<a href="#">').attr('id', "logout").attr('style', 'float:right').text("Logout").click(logout).appendTo("header span");
            var sessionToken = currentUser.sessionToken;
            ajaxRequester.getGrades(sessionToken, loadGradesSuccess,
                function myfunction() {
                    alert("Failed to load grades.");
                }
            );
        } else {
            showHomeView();
        }
    }

    function loadGradesSuccess(data) {
        var $gradesUl = $("#gradesView ul");
        $gradesUl.html('');
        for (var g in data.results) {
            var grade = data.results[g];
            $('<li>').attr('id', g).text(grade.Subject + " - " + grade.Grade).data("grade", grade).appendTo("#gradesUl");
            $('<a href="#">').attr('id', g).text("delete").attr('style','margin-left:35px').click(removeGrade).appendTo("#"+g);
            $('<br />').appendTo("#gradesUl");
        }
        $('#gradesView').show();
    }

    function errorLoadGrade() {
        alert("fail");
    };

    //ADD Grade
    function addGrade() {
        var subject = $('#subject').val();
        var grade = $('#grade').val();
        if (subject != "" && isNaN(subject) && !isNaN(grade)) {
            var currentUser = userSession.getCurrentUser();
            ajaxRequester.createGrade(subject, grade, currentUser.objectId, showGradesView,
                function errorAddGrade() {
                    alert("failed to add bookmark");
                })
        }
        else {
            alert("Invalid operation.");
        }
        clearInput();
    }

    function errorAddGrade() {
        alert("failed to add bookmark");
    }

    function logout() {
        userSession.logout();
        showHomeView();
        clearInput();
    }

    function clearInput() {
        $("#txtLoginUsername").val('');
        $("#txtLoginPassword").val('');
        $("#txtRegisterUsername").val('');
        $("#txtRegisterPassword").val('');
        $('#subject').val('');
        $('#grade').val('');
    }

    //Remove Grade
    function removeGrade() {
        var grade = $(this).parent().data('grade');
        var currentUser = userSession.getCurrentUser();
        var sessionToken = currentUser.sessionToken;
        ajaxRequester.removeGrade(sessionToken, grade.objectId, showGradesView,
            function () {
                alert("Delete failed.")
            });
    }

})();
var ajaxRequester = (function () {
    var baseUrl = "https://api.parse.com/1/";
    var headers = {
        "X-Parse-Application-Id": "20j1lyfIpuRrr4vcMMneYmWiOskc8d9YtEVNIAeW",
        "X-Parse-REST-API-Key": "TSkdI6NxUabmCKGLPf2KQC5OuIFIcgEqUgrnafnm"
    };

    function login(username, password, success, error) {
        jQuery.ajax({
            method: "GET",
            headers: headers,
            url: baseUrl + "login",
            data: { username: username, password: password },
            success: success,
            error: error
        });
    };

    function register(username, password, success, error) {
        jQuery.ajax({
            method: "POST",
            headers: headers,
            url: baseUrl + "users",
            data: JSON.stringify({ username: username, password: password }),
            success: success,
            error: error
        });
    };


    function getGrades(sessionToken, success, error) {
        var headersWithSessionToken = getHeadersWithSessionToken(sessionToken);
        $.ajax({
            method: "GET",
            headers: headersWithSessionToken,
            url: baseUrl + "classes/Grades",
            success: success,
            error: error
        });
    };

    function getHeadersWithSessionToken(sessionToken) {
        var headersWithToken = JSON.parse(JSON.stringify(headers));
        headersWithToken['X-Parse-Session-Token'] = sessionToken;
        return headersWithToken;
    };

    function createGrade(subject, grade, userId, success, error) {
        var mark = { Subject: subject, Grade: Number(grade), ACL: {} };
        mark.ACL[userId] = { "write": true, "read": true };
        jQuery.ajax({
            method: "POST",
            headers: headers,
            url: baseUrl + "classes/Grades",
            data: JSON.stringify(mark),
            success: success,
            error: error
        });
    }

    function removeGrade(sessionToken, gradeId, success, error) {
        var headersWithToken = getHeadersWithSessionToken(sessionToken);
        jQuery.ajax({
            method: "DELETE",
            headers: headersWithToken,
            url: baseUrl + "classes/Grades/" + gradeId,
            success: success,
            error: error
        });
    }

    return {
        login: login,
        register: register,
        getGrades: getGrades,
        createGrade: createGrade,
        removeGrade: removeGrade
    };
})();
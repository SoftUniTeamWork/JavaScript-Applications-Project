define(['Q'], function (Q) {
    function AjaxRequester() {
        this.get = makeGetRequest;
        this.post = makePostRequest;
        this.put = makePutRequest;
        this.delete = makeDeleteRequest;
    }

    function makeRequest(url, method, data, headers, processData, stringify) {
        var queue = Q.defer();
        processData = processData === undefined || processData === true;
        data = stringify === undefined || stringify === true ? JSON.stringify(data) : data;

        $.ajax({
            url: url,
            method: method,
            processData: processData,
            contentType: "application/json",
            data: data,
            headers: headers,
            success: function(data) {
                queue.resolve(data);
            },
            error: function(error) {
                queue.reject(error);
            }
        });

        return queue.promise;
    }

    function makeGetRequest(url, headers) {
        return makeRequest(url, "GET", null, headers);
    }

    function makePostRequest(url, data, headers, processData, stringify) {
        return makeRequest(url, "POST", data, headers, processData, stringify);
    }

    function makePutRequest(url, data, headers) {
        return makeRequest(url, "PUT", data, headers);
    }

    function makeDeleteRequest(url, headers) {
        return makeRequest(url, "DELETE", null, headers);
    }

    return {
        get: function() {
            return new AjaxRequester();
        }
    }
});
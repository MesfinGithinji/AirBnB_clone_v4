/**
 *
    If in the status is “OK”, add the class available to the div#api_status
    Otherwise, remove the class available to the div#api_status
 */
$('document').ready(function () {
    const url = 'http://0.0.0.0:5001/api/v1/status/';
    $.get(url, function (data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });
});

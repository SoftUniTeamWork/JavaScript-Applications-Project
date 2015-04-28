function formatDate(isoString) {
    var timestamp = new Date(Date.parse(isoString)),
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return timestamp.getDate() + '-' + months[timestamp.getMonth()] + '-' + timestamp.getFullYear()
        + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes();
}
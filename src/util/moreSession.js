module.exports = {
    getMoreSession(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].moreId == id) {
                return arr[i];
            }
        }
        return null;
    },
    setMoreSession(arr, data) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].moreId == data.moreId) {
                arr[i].moreStatus = data.moreStatus;
                return;
            }
        }
        arr.push(data);
    },
    deleteMoreSession(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].moreId == id) {
                arr.splice(i, 1);
                return;
            }
        }
    }
}
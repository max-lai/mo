module.exports = function (res) {
    res.send(JSON.stringify({
        "status":gener.string(20)
    }));
};
.pragma library
.import QtQuick.LocalStorage 2.0 as Sql
.import "Formatter.js" as Formatter

function getDatabase() {
    return Sql.LocalStorage.openDatabaseSync("Personal Log", "1.0", "Contains log information", 1000000);
}

function readLog(callback) {
    var db = getDatabase();
    db.transaction(
                function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS Log(time, user, entry)");

                    var data = tx.executeSql("SELECT * FROM Log");
                    var result = [];
                    for(var i = 0; i < data.rows.length; i++) {
                        var time = new Date(parseInt(data.rows[i].time)),
                                user = data.rows[i].user,
                                entry = data.rows[i].entry;
                        result.push(Formatter.formatEntry(time, user, entry));
                    }
                    callback(result);
                });
}

function addEntry(time, user, entry) {
    var db = getDatabase();
    db.transaction(
                function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS Log(time, user, entry)");
                    tx.executeSql("INSERT INTO Log VALUES(?, ?, ?)", [time.getTime(), user, entry]);
                });
}

function getUsers(callback) {
    var db = getDatabase();
    db.transaction(
                function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS Users(username)");

                    var data = tx.executeSql("SELECT * FROM Users");
                    var result = [];
                    for(var i = 0; i < data.rows.length; i++) {
                        result.push(data.rows[i].user);
                    }
                    callback(result);
                });
}

function addUser(username) {
    var db = getDatabase();
    db.transaction(
                function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS Users(username)");
                    tx.executeSql("INSERT INTO Users VALUES(?)", [username]);
                });
}

function getSettings(callback) {
    var db = getDatabase();
    db.transaction(
                function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS Settings(key, value)");

                    var data = tx.executeSql("SELECT * from Settings");
                    var result = {};
                    for(var i = 0; i < data.rows.length; i++) {
                        result[data.rows[i].key] = data.rows[i].value;
                    }
                });
}

function changeSettings(key, value) {
    var db = getDatabase();
    db.transaction(
                function (tx) {
                   tx.executeSql("DELETE FROM Settings WHERE key = ?", [key]);
                    tx.executeSql("INSERT INTO Settings VALUES(?, ?)", [key, value]);
                });
}

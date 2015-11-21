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
                    var result = []
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

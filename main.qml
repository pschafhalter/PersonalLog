import QtQuick 2.3
import QtQuick.Controls 1.3
import "DBHandler.js" as DBHandler
import "Formatter.js" as Formatter

ApplicationWindow {
    visible: true
    width: 640
    height: 480
    title: qsTr("Personal Logger")

    menuBar: MenuBar {
        Menu {
            title: qsTr("File")
            MenuItem {
                text: qsTr("Exit")
                onTriggered: Qt.quit();
            }
        }
    }

    function addLog() {
        var time = new Date();
        logContents.append(Formatter.formatEntry(time, "Peter", inputField.text));
        DBHandler.addEntry(time, "Peter", inputField.text);
        inputField.text = "";
    }

    Column {
        anchors.fill: parent

        TextArea {
            id: logContents
            width: parent.width;
            height: parent.height - inputRow.height
            readOnly: true

            function loadLog(logArray) {
                for(var i = 0; i < logArray.length; i++) {
                    logContents.append(logArray[i]);
                }
            }

            Component.onCompleted: DBHandler.readLog(loadLog);
        }

        Row {
            id: inputRow
            width: parent.width

            TextField {
                id: inputField
                width: parent.width - logButton.width
                focus: true
                onAccepted: addLog();
            }

            Button {
                id: logButton
                text: "Log"
                onClicked: addLog();
            }
        }
    }
}


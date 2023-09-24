"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
var userId = undefined;

//Disable the send button until connection is established.
document.getElementById("send-button").disabled = true;

connection.on("ReceiveMessage", function (message, connectionId) {
    appendMessage("you", 'right', message, connectionId);
});

connection.on("ReceiveGroupMessage", function (userName, userMessage, connectionId) {
    appendMessage(userName, 'left', userMessage, connectionId);
});

// for appending message
function appendMessage(name, side, text, connectionId) {

    let bgColor = getBackgroundColor(connectionId);

    // creating the message with required elements and data
    const messageElement = document.createElement('div');
    const leftorright = document.createElement('div');
    if (side == 'left') {
        leftorright.classList.add("left-msg");
    } else {
        leftorright.classList.add("right-msg");
    }
    leftorright.classList.add("msg");

    const bub = document.createElement('div');
    bub.classList.add("msg-bubble");

    // setting the background color based on connection id
    bub.style.backgroundColor = bgColor;

    const inf = document.createElement('div');
    inf.classList.add("msg-info");

    const infname = document.createElement('div');
    infname.classList.add("msg-info-name");
    infname.innerText = name;

    const inftime = document.createElement("div");
    inftime.classList.add("msg-info-time");
    inftime.innerText = formatDate(new Date());

    inf.appendChild(infname);
    inf.appendChild(inftime);

    const msgte = document.createElement("div");
    msgte.classList.add("msg-text");
    msgte.innerText = text;

    bub.appendChild(inf);
    bub.appendChild(msgte);

    leftorright.appendChild(bub);
    messageElement.appendChild(leftorright);
    // creating of message is completed

    // message is placed in the container
    document.getElementById("message-container").append(messageElement);

}

// to format date in a required format
function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}

connection
    .start()
    .then(function () {
        document.getElementById("send-button").disabled = false;

        let hub = connection;
        let connectionUrl = hub["connection"].transport._webSocket.url;
        
        let r = /.*\=(.*)/
        let id = r.exec(connectionUrl)[1];
        userId = id;
        
        let roomName = document.getElementById("roomName").textContent.trim();
        if (roomName.length > 0)
            connection.invoke("JoinRoom", roomName).catch(function (err) {
                return console.error(err.toString());
            });

    }).catch(function (err) {
        return console.error(err.toString());
    });

document.getElementById("send-button").addEventListener("click", function (event) {

    event.preventDefault();
    
    let userName = document.getElementById("userName").textContent.trim();
    let roomName = document.getElementById("roomName").textContent.trim();
    if (userName.length < 0) {
        userName = userId;
    }

    let messageInput = document.getElementById("message-input");
    let message = messageInput.value;
    message = message.trim();

    if (message.length > 0 && roomName.length > 0) {
        connection.invoke("SendMessageToGroup", roomName, userName, message).catch(function (err) {
            return console.error(err.toString());
        });
    }

    messageInput.value = "";
});

/**
 * 
 * @param {String} - stringInput - 'xyz'
 * @returns {String} - color in hex color code - '#ae6204'
 */
function getBackgroundColor(stringInput) {
    const h = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const s = 95, l = 35 / 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
// ==UserScript==
// @name        Kaggle Notifications
// @namespace   Violentmonkey Scripts
// @match       https://www.kaggle.com/code/smartmanoj/browser-notifications-in-a-kaggle-kernel/edit*
// @grant       none
// @version     1.0
// @author      -
// @description 1/15/2025, 6:01:39 PM
// ==/UserScript==
(function() {
  // Wait for the DOM to be fully loaded
  window.addEventListener('load', function() {

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
        var key = e.message ? "message" : "data";
        var data = e[key];
        if (data=='run'){ new Notification("Notifications enabled!", {
                                body: "You have granted notification permission.",
                            });console.log('zz',data)}
    },false);
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = unsafeWindow[eventMethod];
    var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
    console.log('Kaggle Notification script injected');
    // Listen for messages from the child window
    eventer(
        messageEvent,
        function (e) {
            var key = e.message ? "message" : "data";
            var data = e[key];
            // Check if the message starts with "notify"
            if (Array.isArray(data) && data[0] === "notify") {
                // Request notification permission if not enabled
                if (Notification.permission !== "granted") {
                    Notification.requestPermission()
                        .then((permission) => {
                            if (permission === "granted") {
                                // Show the notification
                                new Notification("Notifications enabled!", {
                                    body: data[1] || "No message provided",
                                });
                                console.log("Notification displayed:", data[1]);
                            } else {
                                console.warn("Notification permission denied.");
                            }
                        })
                        .catch((err) => console.error("Error requesting permission:", err));
                } else {
                    // Permission already granted; show the notification
                    var notification = new Notification("Notifications from Kaggle!", data[1]);
                    notification.onclick = function () {
                        window.focus();
                        this.close();
                    };
                    console.log("Notification displayed:", data[1]);
                }
            }
        },
        false
    );
  });
})();

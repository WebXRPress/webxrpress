/**
 * @description IFrameMessaging provides simple iframe-parent window communication with automatic upgrade to real-time WebRTC if supported.
 * @param {*} iframe The iframe element to communicate to or defaults to first iframe found if present; otherwise parent window.
 * @returns Promise that resolves when connected via WebRTC.
 */

// Furnish internal debug messages
if (typeof debug_log == 'undefined') {
    function debug_log(msg) {
        //console.log(msg);
    }
}
function IFrameMessaging(iframe) {

    /**
     * @description Send the given message to the iframe or parent window
     * @param {*} message The message object to send to the iframe or parent window.
     */
    this.sendMessage = function(message) {

        // Use upgraded WebRTC data channel if connected
        if (typeof message.webrtcSetup == 'undefined' && this.sendChannel != null) {
            if (this.sendChannel.readyState == 'open') {
                debug_log("using sendWebRTC");
                this.sendWebRTC(message);
            }else{
                debug_log("using postMessage");
                this.iframe.postMessage(message, "*"); // Fallback
            }
        } else {
            debug_log("using postMessage");
            this.iframe.postMessage(message, "*"); // Fallback or webrtcSetup handshaking
        }
    }

    /**
     * @description An event listener callback to receieve message objects from the iframe or parent window.
     * @param {*} callback 
     */
    this.onReceiveMessage = function(callback) {
        receivers.push(callback);
    };
    window.addEventListener("message", function(event) {
        debug_log("using window.addEventListener message");

        // Route WebRTC handshaking messages
        if (typeof event.data.webrtcSetup != 'undefined') {
            self.onWebRTCHandshake(event.data);
            return;
        }
        for (var i = 0; i < receivers.length; i++) {
            receivers[i](event.data);
        }
    });

    // Establish WebRTC datachannel connections
    this.establishWebRTC = function() {
        debug_log("trying to establish WebRTC");
        if (window.parent == window) {
            var localConnection = new RTCPeerConnection();
            this.sendChannel = localConnection.createDataChannel("sendChannel");
            this.sendChannel.onmessage = function(event) {
                                  
                debug_log("using WebRTC sendChannel.onmessage");
                let data = JSON.parse(event.data);
                for (var i = 0; i < receivers.length; i++) {
                    receivers[i](data);
                }
            };
            localConnection.onicecandidate = function(e) {
                if (e.candidate) {
                    self.sendMessage({
                        webrtcSetup: true,
                        localCandidate: e.candidate.toJSON()
                    });
                }
            };
            localConnection.createOffer().then(function(offer) {
                return localConnection.setLocalDescription(offer);
            }).then(function() {
                self.sendMessage({
                    webrtcSetup: true,
                    localDescription: localConnection.localDescription.toJSON()
                });
            }).catch(function(e) {
                debug_log("localConnection error: " + e.toString());
            });
    
            // Provide disconnect method on local (parent window) connection
            this.disconnect = function() {
                this.sendChannel.close();
                this.sendChannel = null;
                localConnection.close();
                localConnection = null;
                this.sendMessage({
                    webrtcSetup: true,
                    localDisconnect: true
                });
            };
    
            // Handle local-side (parent window) WebRTC handshaking
            this.onWebRTCHandshake = function(message) {
                if (message.remoteDescription) {
                    localConnection.setRemoteDescription(message.remoteDescription);
                }
                if (message.remoteCandidate) {
                    localConnection.addIceCandidate(message.remoteCandidate).catch(function(e) {
                        debug_log("localConnection.addIceCandidate error: " + e.toString());
                    });
                }
            };
        }else{
    
            // Handle remote-side (iframe window) WebRTC handshaking
            var remoteConnection = null;
            var receiveChannel = null;
            debug_log("client awaiting server inquiry")
            this.onWebRTCHandshake = function(message) {
                if (message.localDescription) {
                    remoteConnection = new RTCPeerConnection();
                    remoteConnection.setRemoteDescription(message.localDescription).then(function() {
                        remoteConnection.createAnswer().then(function(answer) {
                            remoteConnection.setLocalDescription(answer).then(function() {
                                self.sendMessage({
                                    webrtcSetup: true,
                                    remoteDescription: remoteConnection.localDescription.toJSON()
                                });
                            });
                        });
                    });
    
                    // Process messages on upgrade WebRTC data channel in remote (iframe)
                    remoteConnection.ondatachannel = function(event) {
                        receiveChannel = event.channel;
                        self.sendChannel = receiveChannel;
                        receiveChannel.onmessage = function(event) {
                        
                            debug_log("using WebRTC receiveChannel.onmessage");
                            let data = JSON.parse(event.data);
                            for (var i = 0; i < receivers.length; i++) {
                                receivers[i](data);
                            }
                        };
                    };
                }
                if (message.localCandidate) {
                    remoteConnection.onicecandidate = function(e) {
                        if (e.candidate) {
                            self.sendMessage({
                                webrtcSetup: true,
                                remoteCandidate: e.candidate.toJSON()
                            });
                        }
                    };
                    remoteConnection.addIceCandidate(message.localCandidate).catch(function(e) {
                        debug_log("removeConnection.addIceCandidate error: " + e.toString());
                    });
                }
                if (message.localDisconnect) {
                    receiveChannel.close();
                    receiveChannel = null;
                    remoteConnection.close();
                    remoteConnection = null;
                }
                
            };
        }
    };

    if (typeof iframe == 'undefined') {
        this.iframe = document.getElementsByTagName('iframe');
        if (this.iframe.length > 0) {
            this.iframe = this.iframe[0].contentWindow;
        }else{
            this.iframe = window.parent;
        }
    }else{
        this.iframe = iframe.contentWindow;
    }

    // Provide upgraded message sending from local (parent window) via WebRTC 
    this.sendWebRTC = function(message) {
        this.sendChannel.send(JSON.stringify(message));
    };

    // Constructor returns promise
    var receivers = [];
    var self = this;
    var handshake = null;
    var retries = 0;

    return new Promise((resolve, reject) => {
        handshake = setInterval(function() {
            if (self.sendChannel != null) {
                if (self.sendChannel.readyState != 'open') {
                    self.establishWebRTC();
                    retries++;
                }else{
                    debug_log("established WebRTC");
                    clearInterval(handshake);
                    resolve(self);
                }
            }
            if (retries > 100) {
                clearInterval(handshake);
                reject("exceeded 10 seconds, multiple retires, giving up WebRTC");
            }
        }, 100);
        self.establishWebRTC();
    });
};

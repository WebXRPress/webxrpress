/**
 * @description IFrameMessaging provides simple iframe-parent window communication with automatic upgrade to real-time WebRTC if supported.
 * @param {*} iframe The iframe element to communicate to or defaults to first iframe found if present; otherwise parent window.
 */
function IFrameMessaging(iframe) {
    var receivers = [];
    var self = this;

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


    /**
     * @description Send the given message to the iframe or parent window
     * @param {*} message The message object to send to the iframe or parent window.
     */
    this.sendMessage = function(message) {

        // Use upgraded WebRTC data channel if connected
        if (typeof message.webrtcSetup == 'undefined' && this.sendChannel != null) {
            if (this.sendChannel.readyState == 'open') {
                console.log("using sendWebRTC");
                this.sendWebRTC(message);
            }else{
                console.log("using postMessage");
                this.iframe.postMessage(message, "*"); // Fallback
            }
        } else {
            console.log("using postMessage");
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
        console.log("using window.addEventListener message");

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
        console.log("trying to establish WebRTC");
        if (window.parent == window) {
            var localConnection = new RTCPeerConnection();
            this.sendChannel = localConnection.createDataChannel("sendChannel");
            this.sendChannel.onmessage = function(event) {
                                  
                console.log("using WebRTC sendChannel.onmessage");
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
                console.log("localConnection error: " + e.toString());
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
                        console.log("localConnection.addIceCandidate error: " + e.toString());
                    });
                }
            };
        }else{
    
            // Handle remote-side (iframe window) WebRTC handshaking
            var remoteConnection = null;
            var receiveChannel = null;
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
                            
                            console.log("using WebRTC receiveChannel.onmessage");
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
                        console.log("removeConnection.addIceCandidate error: " + e.toString());
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

    var handshake = setInterval(function() {
        if (self.sendChannel != null) {
            if (self.sendChannel.readyState != 'open') {
                self.establishWebRTC();
            }else{
                console.log("established WebRTC");
                clearInterval(handshake);
            }
        }
    }, 1000);
    this.establishWebRTC();

    // Provide upgraded message sending from local (parent window) via WebRTC 
    this.sendWebRTC = function(message) {
        this.sendChannel.send(JSON.stringify(message));
    };
};

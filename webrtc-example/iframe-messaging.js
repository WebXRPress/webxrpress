(function($) {
    $(function() {
        window.im = new function() {
            this.iframe = document.getElementsByTagName('iframe');
            if (this.iframe.length > 0) {
                this.iframe = this.iframe[0];
            }else{
                this.iframe = null;
            }
            
            // Send the given message to the iframe or parent window
            this.sendMessage = function(message) {
                if (this.iframe != null) {
                    this.iframe.contentWindow.postMessage(message, "*");
                }else{
                    window.parent.postMessage(message, "*");
                }
            }
        
            // Listen for messages from the iframe or parent window
            var receivers = [];
            this.onReceiveMessage = function(callback) {
                receivers.push(callback);
            };
            window.addEventListener("message", function(event) {
                for (var i = 0; i < receivers.length; i++) {
                    receivers[i](event.data);
                }
            });
        };
    });
})(jQuery);

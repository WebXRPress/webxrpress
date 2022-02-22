/**
 * Render content of the #render-div to an image and send it back to PlayCanvas
 * iframe parent. 
 * 
 * Copyright (c) 2022 Stephen J. Carnam
 * Released under MIT License
 */
 (function($) {
    $(function() {
        // Require unique id
        var guid = (new URLSearchParams(window.location.search)).get('guid');
        if (guid == null) return;

        // Support remote console for iframes in vr
        var oldConsole = window.console.log;
        window.console.log = function(msg) {
            oldConsole(msg);
            sendMessage({
                parentConsoleLog: msg
            });
        };
        
        // Implement our sendMessage routine
        window.sendMessage = function(message = {}) {
            
            // Only send the message if we are in an iframe
            if ( window.location !== window.parent.location ) {
                message.guid = guid; // always furnish our unique id
                window.parent.postMessage(message, '*');
            }      
        };

        // Implement our sendRender routine, with optional messages
        var renderDIV = document.getElementsByClassName("wxrp-render");
        if (renderDIV.length > 0) {
            renderDIV = renderDIV[0];
        }else{
            return;
        }
        window.sendRender = function(message = {}) {
            let re = (new URLSearchParams(window.location.search)).get('re');
            if (re == 'html2canvas') {
                html2canvas(renderDIV).then(function(canvas) {
                    message.dataUrl = canvas.toDataURL();
                    sendMessage(message);
                });
            }else{
                htmlToImage.toPng(renderDIV).then(function(dataUrl) {
                    message.dataUrl = dataUrl;
                    sendMessage(message);
                });
            }
        };
        
        // Process incoming message requests
        window.addEventListener('message', function(e) {
            // Load incoming html and execute scripts (thx jQuery!)
            if (e.data.html != undefined) {
                renderDIV.style.height = e.data.height + 'px';
                renderDIV.style.width = e.data.width + 'px';
                renderDIV.style.backgroundColor = e.data.backgroundColor;
                $(renderDIV).html(e.data.html);
                window.emulateCSSBehaviors(); 
            }

            // Process render requests
            if (e.data.requestRender != undefined) {
                window.sendRender();
            }
        });
        
        // Send DOM changed notifications
        var lastHTML = '';
        // window.domChangedInterval = setInterval(function() {
        //     if (lastHTML != renderDIV.innerHTML) {
        //         lastHTML = renderDIV.innerHTML;
        //         window.sendMessage({domChanged: true});
        //     }
        // }, 300);
                     
        // Tell parent we're ready
        sendMessage({ready: true});
    })
})(jQuery);
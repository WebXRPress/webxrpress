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
        
        // Implement our sendMessage routine
        window.sendMessage = function(message = {}) {
            
            // Only send the message if we are in an iframe
            //if ( window.location !== window.parent.location ) {
                message.guid = guid; // always furnish our unique id
                // window.parent.postMessage(message, '*');
                window.ifm.sendMessage(message);
            //}      
        };

        // Support remote console for iframes in vr
        var oldConsole = window.console.log;
        window.console.log = function(msg) {
            oldConsole(msg);
            window.sendMessage({
                parentConsoleLog: msg
            });
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
                    window.sendMessage(message);
                });
            }else{
                htmlToImage.toPng(renderDIV).then(function(dataUrl) {
                    message.dataUrl = dataUrl;
                    window.sendMessage(message);
                });
            }
        };
        
        // Process incoming message requests
        console.log("line 57");
        window.ifm.onReceiveMessage(function(data) {
            console.log("iframe got onReceiveMessage");

            // Load incoming html and execute scripts (thx jQuery!)
            if (data.html != undefined) {
                renderDIV.style.height = data.height + 'px';
                renderDIV.style.width = data.width + 'px';
                renderDIV.style.backgroundColor = data.backgroundColor;
                $(renderDIV).html(data.html);
                window.emulateCSSBehaviors(); 
            }

            // Process render requests
            if (data.requestRender != undefined) {
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
        window.sendMessage({ready: true});
    })
})(jQuery);
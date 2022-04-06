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

        // Create ifm
        new IFrameMessaging().then(function(ifm) {

            // Obtain the parent div to render
            var renderDIV = document.getElementsByClassName("wxrp-render");
            if (renderDIV.length > 0) {
                renderDIV = renderDIV[0];
            }else{
                return;
            }

            // Implement our sendRender routine, with optional messages
            window.sendRender = function(message = {}) {
                let re = (new URLSearchParams(window.location.search)).get('re');
                if (re == 'html2canvas') {
                    html2canvas(renderDIV).then(function(canvas) {
                        message.dataUrl = canvas.toDataURL();
                        message.guid = guid;
                        ifm.sendMessage(message);
                    });
                }else{
                    htmlToImage.toPng(renderDIV).then(function(dataUrl) {
                        message.guid = guid;
                        message.dataUrl = dataUrl;
                        ifm.sendMessage(message);
                    });
                }
            };
            
            // Process incoming message requests
            ifm.onReceiveMessage(function(data) {
                console.log("render2.js ifm.onReceiveMessage");
                console.log(data);
                
                // Load incoming html and execute scripts (thx jQuery!)
                if (data.html != undefined) {
                    renderDIV.style.height = data.height + 'px';
                    renderDIV.style.width = data.width + 'px';
                    renderDIV.style.backgroundColor = data.backgroundColor;
                    $(renderDIV).html(data.html);
                    //window.emulateCSSBehaviors(); 
                }

                // Process render requests
                if (data.requestRender != undefined) {
                    window.sendRender();
                }
            });

            // Tell parent we're ready
            ifm.sendMessage({
                guid: guid, 
                ready: true
            });

        }).catch(function(msg) {
            console.log(msg);
        });

        // // Process incoming message requests
        // window.ifm.onReceiveMessage(function(data) {
            
        //     // Load incoming html and execute scripts (thx jQuery!)
        //     if (data.html != undefined) {
        //         renderDIV.style.height = data.height + 'px';
        //         renderDIV.style.width = data.width + 'px';
        //         renderDIV.style.backgroundColor = data.backgroundColor;
        //         $(renderDIV).html(data.html);
        //         window.emulateCSSBehaviors(); 
        //     }

        //     // Process render requests
        //     if (data.requestRender != undefined) {
        //         window.sendRender();
        //     }
        // });
        
        // // Send DOM changed notifications
        // var lastHTML = '';
        // // window.domChangedInterval = setInterval(function() {
        // //     if (lastHTML != renderDIV.innerHTML) {
        // //         lastHTML = renderDIV.innerHTML;
        // //         window.sendMessage({domChanged: true});
        // //     }
        // // }, 300);
                     
        // // Tell parent we're ready
        // window.sendMessage({ready: true});
    });
})(jQuery);
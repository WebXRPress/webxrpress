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

        // Used for emulating mouse behaviors
        var lastMouseXY = { x: 0, y: 0 };

        // Use single render request
        var renderPending = false;

        // Create ifm
        new IFrameMessaging().then(function(ifm) {
            console.log("render2.js new IFrameMessaging().then(function(ifm) {");

            // Obtain the parent div to render
            var renderDIV = document.getElementsByClassName("wxrp-render");
            if (renderDIV.length > 0) {
                renderDIV = renderDIV[0];
            }else{
                return;
            }

            // Implement our sendRender routine, with optional messages
            window.sendRender = function(message = {}) {
                console.log("window.sendRender");
                let re = (new URLSearchParams(window.location.search)).get('re');
                if (re == 'html2canvas') {
                    html2canvas(renderDIV).then(function(canvas) {
                        message.dataUrl = canvas.toDataURL();
                        message.guid = guid;
                        console.log("sending html2canvas");
                        ifm.sendMessage(message);
                    });
                }else{
                    htmlToImage.toPng(renderDIV).then(function(dataUrl) {
                        message.guid = guid;
                        message.dataUrl = dataUrl;
                        console.log("sending htmlToImage");
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
                    emulateCSSBehaviors(); 
                }

                // Emulate a mouseover, mousemove event on any element at the given mouse position
                if (data.mouseXY != undefined) {
                    lastMouseXY = data.mouseXY;
                    let elm = document.elementFromPoint(lastMouseXY.x, lastMouseXY.y);
                    if (elm != null) {
                        let param = {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            clientX: lastMouseXY.x,
                            clientY: lastMouseXY.y
                        };
                        elm.dispatchEvent(new MouseEvent('mouseover', param));
                        elm.dispatchEvent(new MouseEvent('mousemove', param));
                    }
                }

                // Emulate mousedown, click, mouseup events on any element at the given mouse position
                if (data.mouseDown != undefined) {
                    let elm = document.elementFromPoint(lastMouseXY.x, lastMouseXY.y);
                    if (elm != null) {
                        let param = {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            clientX: lastMouseXY.x,
                            clientY: lastMouseXY.y
                        };
                        elm.dispatchEvent(new MouseEvent('mousedown', param));
                        elm.dispatchEvent(new MouseEvent('click', param));
                    }
                }
                if (data.mouseUp != undefined) {
                    let elm = document.elementFromPoint(lastMouseXY.x, lastMouseXY.y);
                    if (elm != null) {
                        let param = {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            clientX: lastMouseXY.x,
                            clientY: lastMouseXY.y
                        };
                        invokePendingMouseUps();
                    }
                }               

                // Process render requests
                if (data.requestRender != undefined) {
                    console.log("render2.js data.requestRender != undefined");
                    renderPending = true;
                }
            });

            // Listen for mouseover event and apply hover styles
            var pendingMouseOuts = [];
            document.body.addEventListener('mouseover', function(e) {
                if (pendingMouseOuts.indexOf(e.target) > -1) return;
                invokePendingMouseOuts();
                pendingMouseOuts.push(e.target);
                let bRender = false;
                e.target.classList.forEach(function(c) {
                    let hClass = c.toString() + '__hover';
                    if (c.indexOf(hClass) == -1) {
                        if (newRules.indexOf(hClass) > -1) {
                            e.target.classList.add(hClass);
                            bRender = true;
                        }
                    }
                });
                if (bRender) renderPending = true;
            });

            // Invoke any pending mouseouts from prior mouseovers
            function invokePendingMouseOuts() {
                while(pendingMouseOuts.length > 0) {
                    let elm = pendingMouseOuts.pop();
                    if (elm != null) {
                        let param = {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            clientX: lastMouseXY.x,
                            clientY: lastMouseXY.y
                        };
                        elm.dispatchEvent(new Event('mouseout', param));
                        elm.dispatchEvent(new Event('mouseleave', param));
                    }
                }
            }   

            // Listen for mousedown event and apply active styles
            var pendingMouseUps = [];
            document.body.addEventListener('mousedown', function(e) {
                pendingMouseUps.push(e.target);
                let bRender = false;
                e.target.classList.forEach(function(c) {
                    let aClass = c.toString() + '__active';
                    if (c.indexOf(aClass) == -1) {
                        if (newRules.indexOf(aClass) > -1) {
                            e.target.classList.add(aClass);
                            bRender = true;
                        }
                    }
                });
                if (bRender) renderPending = true;
            });

            // Invoke any pending mouseups from prior mousedowns
            function invokePendingMouseUps() {
                while(pendingMouseUps.length > 0) {
                    let elm = pendingMouseUps.pop();
                    if (elm != null) {
                        let param = {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            clientX: lastMouseXY.x,
                            clientY: lastMouseXY.y
                        };
                        elm.dispatchEvent(new Event('mouseup', param));
                    }
                }
            }

            // Listen for mouseout event and remove hover styles
            document.body.addEventListener('mouseout', function(e) {
                var removes = [];
                let bRender = false;
                e.target.classList.forEach(function(c) {
                    if (c.indexOf('__hover') > -1) {
                        removes.push(c); // Queue the class to be removed
                        bRender = true;
                    }
                });
                removes.forEach(function(r) {
                    e.target.classList.remove(r);
                });
                if (bRender) renderPending = true;
            });

            // Listen for mouseup event and remove active styles
            document.body.addEventListener('mouseup', function(e) {
                var removes = [];
                let bRender = false;
                e.target.classList.forEach(function(c) {
                    if (c.indexOf('__active') > -1) {
                        removes.push(c); // Queue the class to be removed
                        bRender = true;
                    }
                });
                removes.forEach(function(r) {
                    e.target.classList.remove(r);
                });
                if (bRender) renderPending = true;
            });

            // Tell parent we're ready ~1/2 second later
            setTimeout(function() {
                ifm.sendMessage({
                    guid: guid, 
                    ready: true
                });
            }, 500);

            // Render any pending changes
            setInterval(function() {
                if (renderPending) {
                    renderPending = false;
                    window.sendRender();
                }
            }, 500);

        }).catch(function(msg) {
            console.log(msg);
        });

        // Emulate CSS behaviors
        var newRules = [];
        function emulateCSSBehaviors() {
            console.log("emulateCSSBehaviors");

            // Analyze CSS looking for simple CSS hover and active behaviors
            for (var i = 0; i < document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                try {
                    var classes = document.styleSheets[i].cssRules;
                    for (var j = 0; j < classes.length; j++) {
                        var c = classes[j];
                        var st = c.selectorText;
                        try {
                            st = st.toString();
                        }catch(e){
                            st = "";
                            // Ignore CSSOMString access errors 'undefined'
                            // console.log(e.message);
                        }
        
                        // Find all classes with the hover and active selectors
                        if (st.indexOf(':hover') > -1 || st.indexOf(':active') > -1) {
                            let ac = st.split(' ');
                            ac.forEach(function(a) {
        
                                // Support simple hover and active rules with no sub-selectors
                                if ((a.indexOf(':hover') > -1 || a.indexOf(':active')) 
                                    && a.indexOf('[') == -1 && a.indexOf('(') == -1) {
        
                                    // Replace the hover selector with our mirror selector
                                    let b = a.replace(':hover', '__hover');
                                    b = b.replace(':active', '__active');
                                    b = b.replace(',', '');
        
                                    // Queue the new rule, we can't add it yet
                                    newRules.push(b + ' { ' + c.style.cssText + ' }');
                                }
                            })
                        }
                    }
                }catch(e){
                    // Ignore Uncaught DOMException: CSSStyleSheet.cssRules getter:
                    // Not allowed to access cross-origin and stylesheetrule.selectorText
                    // is undefined errors.
                    // console.log(e.message);
                }
            }
        
            // Create stylesheet for our hover & active mirrored styles
            if (newRules.length > 0) {
                var css = '';
                newRules.forEach(function(r) {
                   css += r; 
                });
                var style = document.createElement('style');
                document.body.appendChild(style); // !important, insert at bottom
                style.appendChild(document.createTextNode(css));

                // Keep list of classes for render tracking
                for (var i = 0; i < newRules.length; i++) {
                    newRules[i] = newRules[i].split(' ')[0].replace('.', '');
                }
            }
        }; // emulateCSSBehaviors

        // // Send DOM changed notifications
        // var lastHTML = '';
        // // window.domChangedInterval = setInterval(function() {
        // //     if (lastHTML != renderDIV.innerHTML) {
        // //         lastHTML = renderDIV.innerHTML;
        // //         window.sendMessage({domChanged: true});
        // //     }
        // // }, 300);
    });
})(jQuery);
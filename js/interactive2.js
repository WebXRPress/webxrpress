/**
 * Furnish interactive mouse events and CSS behaviors (hover, active) for
 * emulating the native behavior of an HTML page in virtual reality.
 * 
 * Copyright (c) 2022 Stephen J. Carnam
 * Released under MIT License
 */
 (function($) {
    $(function() {
        var newRules = [];
        
        window.emulateCSSBehaviors = function() {
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
        }; // window.emulateCSSBehaviors

        // Process incoming message requests
        var lastMouseXY = { x: 0, y: 0 };
        // function doMessage(e) {
        
        //     // Emulate a mouseover, mousemove event on any element at the given mouse position
        //     if (e.data.mouseXY != undefined) {
        //         lastMouseXY = e.data.mouseXY;
        //         let elm = document.elementFromPoint(lastMouseXY.x, lastMouseXY.y);
        //         if (elm != null) {
        //             let param = {
        //                 view: window,
        //                 bubbles: true,
        //                 cancelable: true,
        //                 clientX: lastMouseXY.x,
        //                 clientY: lastMouseXY.y
        //             };
        //             elm.dispatchEvent(new MouseEvent('mouseover', param));
        //             elm.dispatchEvent(new MouseEvent('mousemove', param));
        //         }
        //     }
        
        //     // Emulate mousedown, click, mouseup events on any element at the given mouse position
        //     if (e.data.mouseDown != undefined) {
        //         let elm = document.elementFromPoint(lastMouseXY.x, lastMouseXY.y);
        //         if (elm != null) {
        //             let param = {
        //                 view: window,
        //                 bubbles: true,
        //                 cancelable: true,
        //                 clientX: lastMouseXY.x,
        //                 clientY: lastMouseXY.y
        //             };
        //             elm.dispatchEvent(new MouseEvent('mousedown', param));
        //             elm.dispatchEvent(new MouseEvent('click', param));
        //         }
        //     }
        //     if (e.data.mouseUp != undefined) {
        //         let elm = document.elementFromPoint(lastMouseXY.x, lastMouseXY.y);
        //         if (elm != null) {
        //             let param = {
        //                 view: window,
        //                 bubbles: true,
        //                 cancelable: true,
        //                 clientX: lastMouseXY.x,
        //                 clientY: lastMouseXY.y
        //             };
        //             invokePendingMouseUps();
        //         }
        //     }
        // };
        // window.addEventListener('message', function(e) {
        //     doMessage(e);
        // });
        // window.ifm.onReceiveMessage(function(e) {
        //     doMessage(e);
        // });
        
        // Listen for mouseover event and apply hover styles
        var pendingMouseOuts = [];
        document.body.addEventListener('mouseover', function(e) {
            if (pendingMouseOuts.indexOf(e.target) > -1) return;
            var bRender = false;
            invokePendingMouseOuts();
            pendingMouseOuts.push(e.target);
            e.target.classList.forEach(function(c) {
                let hClass = c.toString() + '__hover';
                if (c.indexOf(hClass) == -1) {
                    if (newRules.indexOf(hClass) > -1) {
                        e.target.classList.add(hClass);
                        bRender = true;
                    }
                }
            });
        
            // Render if needed
            if (bRender) {
                window.sendRender();
            }
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
            var bRender = false;
            pendingMouseUps.push(e.target);
            e.target.classList.forEach(function(c) {
                let aClass = c.toString() + '__active';
                if (c.indexOf(aClass) == -1) {
                    if (newRules.indexOf(aClass) > -1) {
                        e.target.classList.add(aClass);
                        bRender = true;
                    }
                }
            });
        
            // Render if needed
            if (bRender) {
                window.sendRender();
            }
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
            var bRender = false;
            e.target.classList.forEach(function(c) {
                if (c.indexOf('__hover') > -1) {
                    removes.push(c); // Queue the class to be removed
                    bRender = true;
                }
            });
            removes.forEach(function(r) {
                e.target.classList.remove(r);
            });
        
            // Render if needed
            if (bRender) {
                window.sendRender();
            }
        });

        // Listen for mouseup event and remove active styles
        document.body.addEventListener('mouseup', function(e) {
            var removes = [];
            var bRender = false;
            e.target.classList.forEach(function(c) {
                if (c.indexOf('__active') > -1) {
                    removes.push(c); // Queue the class to be removed
                    bRender = true;
                }
            });
            removes.forEach(function(r) {
                e.target.classList.remove(r);
            });

            // Render if needed
            if (bRender) {
                window.sendRender();
            }
        });

    })
})(jQuery);

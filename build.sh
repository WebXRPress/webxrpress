#!/bin/bash
#
# Automate the retrieval of project depemdencies
#

#
# Bundle cmb for distribution as described at 
# https://github.com/CMB2/CMB2/wiki/Basic-Usage#caveats-for-bundling-and-including-cmb2
#
rm -rf ./cmb2
curl https://downloads.wordpress.org/plugin/cmb2.zip -L -o ./cmb2.zip
unzip -o cmb2.zip -d ./

#
# html-to-image
#
mkdir -p ./js
curl https://cdn.jsdelivr.net/npm/html-to-image@1.9.0/dist/html-to-image.min.js -L -o ./js/html-to-image.min.js
curl https://cdn.jsdelivr.net/npm/html-to-image@1.9.0/dist/html-to-image.js.map -L -o ./js/html-to-image.js.map

#
# html2canvas
#
curl https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js -L -o ./js/html2canvas.min.js

#
# Darwflow
#
curl https://cdn.jsdelivr.net/npm/drawflow@0.0.55/dist/drawflow.min.js -L -o ./js/drawflow.min.js
mkdir -p ./css
curl https://cdn.jsdelivr.net/npm/drawflow@0.0.55/dist/drawflow.min.css -L -o ./css/drawflow.min.css

#
# Build the pc folder from the "Runtime" scene, in WordXRPress Library.zip at
# https://playcanvas.com/project/873970/overview/webxrpress-library
#
rm -rf ./pc
unzip -o "./WebXRPress Library.zip" -d ./pc

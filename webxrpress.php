<?php
/**
 * Plugin Name: WebXRPress
 * Plugin URI: https://github.com/WebXRPress/webxrpress
 * Description: A plugin for WordPress that makes embedding and creating virtual reality, (and eventually augmented reality) WebXR based experiences easy.
 * Version: 0.0.1
 * Author: Stephen J. Carnam
 * Author URI: https://carnam.net/about/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */  

// Enable multi-threading/processes for WebXR/iframes
header('Origin-Agent-Cluster: ?1');

// Serve up a 'blank' page ready to have it's DOM manipulated and content
// rendered to image data and returned to PlayCanvas.
if ( 'blank' == $_GET['wxrp']) {
   require("blank.php");
   exit();
}

// Serve up the request WebXR World
if ( 'world' == $_GET['wxrp']) {
   require("world.php");
}

// Register the WebXRPress post type
require("webxrpress-post-type.php");

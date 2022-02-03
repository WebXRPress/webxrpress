<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>HTML Render</title>
        <script src="<?php echo includes_url('js/jquery/jquery.min.js'); ?>"></script>
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/html-to-image.js'; ?>"></script>
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/render.js'; ?>"></script>
        <style>
            /* Reset all */
            * {
                width:100%;
                height:100%;
                padding: 0;
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div id="render-div">
        </div>
    </body>
</html>
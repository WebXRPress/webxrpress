<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>WebXRPress Editor</title>
        <link rel="stylesheet" href="<?php echo plugin_dir_url( __FILE__ ) . 'css/drawflow.min.css'; ?>" />
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/drawflow.min.js'; ?>"></script>
        <script src="<?php echo includes_url('js/jquery/jquery.min.js'); ?>"></script>
        <?php if ($_GET['re'] == 'html2canvas'): ?>
            <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/html2canvas.min.js'; ?>"></script>
        <?php else: ?>
            <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/html-to-image.min.js'; ?>"></script>
        <?php endif; ?>
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/iframe-messaging.js?7'; ?>"></script>
        <script>
            console.log("line 16");
            document.write("line 17");
            window.ifm = new IFrameMessaging();
        </script>
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/render2.js?7'; ?>"></script>
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/interactive2.js?7'; ?>"></script>
    </head>
    <body>
        <div class="wxrp-render">
        </div>
    </body>
</html>
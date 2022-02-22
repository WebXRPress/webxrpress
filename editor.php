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
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/render.js'; ?>"></script>
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/interactive.js'; ?>"></script>
        <script>
        (function($) {
            $(function() {
                var id = document.getElementById("drawflow");
                const editor = new Drawflow(id);
                editor.start();
                editor.addNode("Hello", 2, 2, 100, 100, "mynode", {}, "test html");
                editor.addNode("Hello2", 2, 2, 100, 200, "mynode", {}, '<div style="background-color:orange;">test</div>html2');
            });
        })(jQuery);
        </script>
    </head>
    <body>
        <div class="wxrp-render">
            <div id="drawflow" style="height:800px;">
            </div>
        </div>
    </body>
</html>
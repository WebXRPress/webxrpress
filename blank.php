<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>HTML Render</title>
        <script src="<?php echo includes_url('js/jquery/jquery.min.js'); ?>"></script>
        <?php if ($_GET['re'] == 'html2canvas'): ?>
            <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/html2canvas.min.js'; ?>"></script>
        <?php else: ?>
            <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/html-to-image.min.js'; ?>"></script>
        <?php endif; ?>
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/render.js'; ?>"></script>
        <script src="<?php echo plugin_dir_url( __FILE__ ) . 'js/interactive.js'; ?>"></script>
    </head>
    <body>
        <div class="wxrp-render">
        </div>
    </body>
</html>
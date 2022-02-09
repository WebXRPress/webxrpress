<?php
/**
 * Serve up the WebXR World by valid post ID
 */
function init_webxr_world() {
    // Check for valid post ID
    $post = get_post( $_GET['post'] );
    var_dump($post);
    if (NULL == $post) {
        status_header( 404 );
        get_template_part( 404 );
        exit();
    }

    // Verify post type is WebXR
    if ($post->post_type != 'webxr_world' ) {
        status_header( 404 );
        get_template_part( 404 );
        exit();
    }

    // Output the world
    $index = file_get_contents(__DIR__ . '/pc/index.html');
    $base = esc_url( plugins_url( 'pc/', __FILE__ ));
    $index = str_replace('<head>', '<head>\n<base href="' . $base . '">', $index);
    $index = str_replace('<title>WebXRPress Library</title>', '<title>' . $post->post_title . '</title>', $index);
    echo apply_filters('webxrpress_webxr_word', $index);
    exit();
}
add_action( 'init', 'init_webxr_world' );

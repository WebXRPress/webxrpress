<?php
function register_post_type_webxrpress() {
    $labels = [
        'name' => __( 'WebXR Worlds', 'webxrpress' ),
        'singular_name' => __( 'WebXR World', 'webxrpress' ),
        'menu_name' => __( 'WebXR Worlds', 'webxrpress' ),
        'all_items' => __( 'All WebXR Worlds', 'webxrpress' ),
        'add_new' => __( 'Add New', 'webxrpress' ),
        'add_new_item' => __( 'Add New WebXR World', 'webxrpress' ),
        'edit_item' => __( 'Edit WebXR World', 'webxrpress' ),
        'new_item' => __( 'New WebXR World', 'webxrpress' ),
        'view_item' => __( 'View WebXR World', 'webxrpress' ),
        'search_items' => __( 'Search WebXR Worlds', 'webxrpress' ),
        'not_found' => __( 'No WebXR Worlds found', 'webxrpress' ),
        'not_found_in_trash' => __( 'No WebXR Worlds found in Trash', 'webxrpress' ),
        'parent' => __( 'Parent WebXR World', 'webxrpress' ),
        'feature_image' => __( 'Feature Image for this WebXR World', 'webxrpress' ),
        'set_featured_image' => __( 'Set Feature Image for this WebXR World', 'webxrpress' ),
        'remove_featured_image' => __( 'Remove Feature Image for this WebXR World', 'webxrpress' ),
        'use_featured_image' => __( 'Use as Feature Image for this WebXR World', 'webxrpress' ),
        'archives' => __( 'WebXR World Archives', 'webxrpress' ),
        'insert_into_item' => __( 'Insert into WebXR World', 'webxrpress' ),
        'uploaded_to_this_item' => __( 'Upload to this WebXR World', 'webxrpress' ),
        'filter_items_list' => __( 'Filter WebXR Worlds', 'webxrpress' ),
        'items_list_navigation' => __( 'WebXR Worlds navigation', 'webxrpress' ),
        'items_list' => __( 'WebXR Worlds list', 'webxrpress' ),
        'name_admin_bar' => __( 'WebXR World', 'webxrpress' ),
        'item_published' => __( 'WebXR World published.', 'webxrpress' ),
        'item_published_privately' => __( 'WebXR World published privately.', 'webxrpress' ),
        'item_reverted_to_draft' => __( 'WebXR World reverted to draft.', 'webxrpress' ),
        'item_scheduled' => __( 'WebXR World scheduled.', 'webxrpress' ),
        'item_updated' => __( 'WebXR World updated.', 'webxrpress' ),
        'parent_item_colon' => __( 'Parent WebXR World:', 'webxrpress' ),
    ];

    $args = [
        'labels' => __( 'WebXR Worlds', 'webxrpress' ),
        'labels' => $labels,
        'description' => __( 'List of WebXR Worlds', 'webxrpress' ),
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_admin_bar' => false,
        'show_in_nav_menus' => false,
        'delete_with_user' => true,
        'execlude_from_search' => true,
        'capability_type' => 'post',
        'map_meta_cap' => true,
        'hierarchical' => false,
        'rewrite' => false,
        'query_var' => true,
        'menu_position' => 40,
        'menu_icon' => 'data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MXB4IiBoZWlnaHQ9IjI0MnB4IiB2aWV3Qm94PSIwIDAgMjQxIDI0MiI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjI0LjUgOTAuMwpRIDIyMi43IDY4LjUgMTk4LjE1IDU2LjY1IDE2MS40NSA1MC4xNSAxMjQuMDUgNTAuMQpMIDEyNC4wNSA1MC4wNQpRIDgzLjM1IDQ5LjU1IDQzLjU1IDU2LjYgMTkuMDUgNjguNDUgMTcuMjUgOTAuMjUgMTUuNTUgMTA2Ljk1IDE1LjYgMTI0Ljc1IDE1LjU1IDE0MC43NSAxNi45IDE1Ny41NSAxOS44NSAxNzkuNzUgNDIuOCAxODgKTCA0Mi43NSAxODgKUSA1OS4xIDE5MiA3My4xNSAxOTIgNzYuNiAxOTIgNzkuOTUgMTkxLjcgOTkuMyAxNzAuMTUgMTE2LjY1IDE1OS4wNSAxMTguMzUgMTU3Ljg1IDEyMC40IDE1Ny42NSAxMjIuOSAxNTcuNjUgMTI1LjA1IDE1OS4xIDE0Mi40IDE3MC4yIDE2MS44IDE5MS44IDE2NS4xIDE5Mi4wNSAxNjguNTUgMTkyLjA1IDE4Mi42NSAxOTIuMDUgMTk4Ljk1IDE4OC4wNQpMIDE5OC45IDE4OC4wNQpRIDIyMS44NSAxNzkuOCAyMjQuOCAxNTcuNiAyMjYuMjUgMTQwLjggMjI2LjI1IDEyNC44IDIyNi4yNSAxMDcgMjI0LjUgOTAuMwpNIDE2NS40NSA4Ny4yNQpRIDE3Ny4yIDg3LjI1IDE4NS40NSA5NS41IDE5My43IDEwMy43NSAxOTMuNyAxMTUuNSAxOTMuNyAxMjcuMjUgMTg1LjQ1IDEzNS41NSAxNzcuMiAxNDMuOCAxNjUuNDUgMTQzLjggMTUzLjcgMTQzLjggMTQ1LjQ1IDEzNS41NSAxMzcuMTUgMTI3LjI1IDEzNy4xNSAxMTUuNSAxMzcuMTUgMTAzLjc1IDE0NS40NSA5NS41IDE1My43IDg3LjI1IDE2NS40NSA4Ny4yNQpNIDU2LjI1IDk1LjQ1ClEgNjQuNiA4Ny4xNSA3Ni4zIDg3LjE1IDg4LjA1IDg3LjE1IDk2LjMgOTUuNDUgMTA0LjYgMTAzLjcgMTA0LjYgMTE1LjQ1IDEwNC42IDEyNy4yIDk2LjMgMTM1LjUgODguMDUgMTQzLjc1IDc2LjMgMTQzLjc1IDY0LjYgMTQzLjc1IDU2LjI1IDEzNS41IDQ4IDEyNy4yIDQ4IDExNS40NSA0OCAxMDMuNyA1Ni4yNSA5NS40NSBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=',
        'supports' => [
            'author',
            'title',
            'excerpt',  
        ],
        'show_in_rest' => true,
        'show_in_graphql' => false,
    ];
    register_post_type( 'webxr_world', $args );
}
add_action( 'init', 'register_post_type_webxrpress' );

function add_meta_boxes_webxr_world() {

    add_meta_box( 'webxr-world', __( 'WebXR World', 'webxrpress' ), function() {
        global $post;
        if ($post->post_status == 'auto-draft') {
            echo '<div style="padding: 3em;">Please save the world before visting/editing content.</div>';
            return;
        }else{
            echo "Here's your world";
        }

    }, ['webxr_world'], 'normal', 'high' );

}
add_action( 'add_meta_boxes_webxr_world', 'add_meta_boxes_webxr_world' );
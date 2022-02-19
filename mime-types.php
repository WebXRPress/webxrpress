<?php
// WebXRPress expanded media upload types
function wxrp_get_mime_types() {
    $mime_types['css'] = 'text/css';
    $mime_types['exr'] = 'image/x-exr';
    $mime_types['fbx'] = 'application/octet-stream';
    $mime_types['glb'] = 'model/gltf-binary';
    $mime_types['gltf'] = 'model/gltf+json';
    $mime_types['hdr'] = 'image/vnd.radiance';
    $mime_types['js'] = 'text/javascript';
    $mime_types['json'] = 'application/json';
    $mime_types['otf'] = 'font/otf';
    $mime_types['ttc'] = 'font/collection';
    $mime_types['ttf'] = 'font/ttf';
    $mime_types['tga'] = 'image/x-targa';
    return $mime_types;
}

// Allow additional media mimetypes
function wxrp_upload_mimes( $mime_types ){ 
  return array_merge( $mime_types, wxrp_get_mime_types() ); 
}
add_filter('upload_mimes', 'wxrp_upload_mimes', 1, 1);

// Allow brute force upload when upload_mimes doesn't work
function wxrp_wp_check_filetype_and_ext( $types, $file, $filename, $mimes ) {
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $mime_types = wxrp_get_mime_types();
    if ( array_key_exists($ext, $mime_types) ) {
        $types['ext'] = $ext;
    }   $types['type'] = $mime_types[$ext];
    return $types;
}
add_filter('wp_check_filetype_and_ext', 'wxrp_wp_check_filetype_and_ext', 10, 4);

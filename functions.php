<?php

function _themename_assets() {
    wp_enqueue_style( '_themename-stylesheet', get_template_directory_uri() . '/dist/css/bundle.css', array(), '1.0.0', 'all' );

    wp_enqueue_script( '_themename-jquery', 'https://code.jquery.com/jquery-3.4.0.min.js', array('jquery'),  '1.0.0', true);

    wp_enqueue_script( '_themename-scripts', get_template_directory_uri() . '/dist/js/bundle.js', array(), '1.0.0', true );

//    wp_enqueue_script( '_themename-scripts', get_template_directory_uri() . '/dist/js/bundle.js', array('jquery'), '1.0.0', true );


}
add_action('wp_enqueue_scripts', '_themename_assets');
<?php

/*
Plugin Name: Kadence Fullpane Vertical Slider
Description: Requires Page builder and adds a widget which allows you to build custom fullpane vertical slider to show on any page.
Version: 1.0.5
Author: Kadence WP
Author URI: http://kadencewp.com/
License: GPLv2 or later
*/
function kadence_fullpane_activation() {
}
register_activation_hook( __FILE__, 'kadence_fullpane_activation' );

function kadence_fullpane_deactivation() {
}
register_deactivation_hook( __FILE__, 'kadence_fullpane_deactivation' );

// Define constants
define( 'KADENCE_FULLPANE_PATH', realpath( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR );
define( 'KADENCE_FULLPANE_URL', plugin_dir_url( __FILE__ ) );
define( 'KADENCE_FULLPANE_VERSION', '1.0.5' );

// Frontend Scripts
function kadence_fullpane_scripts() {
	wp_enqueue_style( 'kadence_fullpane_css', KADENCE_FULLPANE_URL . 'css/kadence-fullpane.css', false, KADENCE_FULLPANE_VERSION );
	wp_enqueue_script( 'kadence_fullpane_js', KADENCE_FULLPANE_URL . 'js/kadence-fullpane-slider.js', array( 'jquery' ), KADENCE_FULLPANE_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'kadence_fullpane_scripts', 100 );
function kadence_fullpane_admin_scripts( $hook ) {
	if ( $hook != 'edit.php' && $hook != 'post.php' && $hook != 'post-new.php' && $hook != 'widgets.php' ) {
		return;
	}
	wp_enqueue_style( 'kadence_fullpane_admin_css', KADENCE_FULLPANE_URL . 'css/admin-kadence-fullpane.css', false, KADENCE_FULLPANE_VERSION );
	wp_register_script( 'mustache-js', KADENCE_FULLPANE_URL . 'js/mustache.min.js' );
	wp_enqueue_script( 'kadence_fullpane_admin_js', KADENCE_FULLPANE_URL . 'js/admin-kadence-fullpane-slider.js', array( 'jquery', 'mustache-js', 'underscore', 'backbone' ), KADENCE_FULLPANE_VERSION, false );
}

add_action( 'admin_enqueue_scripts', 'kadence_fullpane_admin_scripts' );
// admin functions
add_action( 'admin_notices', 'kadence_fullpane_check_for_builder' );
function kadence_fullpane_check_for_builder() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	if ( ! class_exists( 'SiteOrigin_Panels_Settings' ) ) { ?>
		<div id="message" class="error">
			<p><?php echo __( 'For Kadence Fullpane Vertical Slider to work you must install/activate SiteOrigin Pagebuilder', 'kadence-fullpane-slider' ); ?></p>
		</div>
		<?php
	}
}
require_once( 'kadence-fullpane-widget.php' );
function kadence_fullpane_widget_init() {
	if ( defined( 'SITEORIGIN_PANELS_VERSION' ) ) {
		register_widget( 'kad_fullpane_widget' );
	}
}
add_action( 'widgets_init', 'kadence_fullpane_widget_init' );
function k_fullpane_theme_is_kadence() {
	if ( class_exists( 'kt_api_manager' ) ) {
		return true;
	}
	return false;
}

// Plugin Updates
add_action( 'after_setup_theme', 'kt_fullpane_updating', 1 );
function kt_fullpane_updating() {
	require_once KADENCE_FULLPANE_PATH . 'kadence-update-checker/kadence-update-checker.php';
	require_once( KADENCE_FULLPANE_PATH . '/admin/kadence-activation/kadence-plugin-api-manager.php' );
	if ( get_option( 'kt_api_manager_kadence_fullpane_slider_activated' ) === 'Activated' ) {
		$Kadence_Full_Pane_Update_Checker = Kadence_Update_Checker::buildUpdateChecker(
			'https://kernl.us/api/v1/updates/5a4ab14ef410b404b89d1af7/',
			__FILE__,
			'kadence-fullpane-slider'
		);
	}
}

/* text-domain */
function kadence_fullpane_textdomain() {
	load_plugin_textdomain( 'kadence-fullpane-slider', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}
add_action( 'plugins_loaded', 'kadence_fullpane_textdomain' );

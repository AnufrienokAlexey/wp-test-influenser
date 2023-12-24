<?php 
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
/*
 * Fullpane widget
 * THANKS TO PROTEUSTHEMES! Code based on there widget.
 */
class kad_fullpane_widget extends WP_Widget{
	private $used_IDs = array();

    public function __construct() {
        $widget_ops = array('classname' => 'kadence_fullpane_widget', 'description' => __('Adds slider panes that can hold widgets.', 'kadence-fullpane-slider'));
        parent::__construct('kadence_fullpane_widget', __('Fullpane Vertical Slider', 'kadence-fullpane-slider'), $widget_ops);
    }

       public function widget($args, $instance){ 
        extract( $args ); 
        if ( ! isset( $widget_id ) ) {
      		$widget_id = $this->id;
     	}
     	$instance['responsive_size'] 		= ! empty( $instance['responsive_size'] ) ? $instance['responsive_size'] : '0';
     	$instance['scroll_out'] 		= ! empty( $instance['scroll_out'] ) ? $instance['scroll_out'] : 'true';
        $items                	= isset( $instance['items'] ) ? array_values( $instance['items'] ) : array();
        $count = count($items);
        wp_enqueue_script( 'siteorigin-panels-front-styles' );
        // Prepare items data.
		foreach ( $items as $key => $item ) {
			$items[ $key ]['builder_id'] = empty( $item['builder_id'] ) ? uniqid() : $item['builder_id'];
		}
        echo $before_widget; 
        	?>
        	<div id="fullpage-wrapper" class="kadence-fullpane-outer-space" style="opacity: 0;">
        	<div class="siteorigin-panels-stretch panel-row-style kadence-fullpane-outer" data-stretch-type="full-stretched">
        	<div class="fullpage  kadence-fullpane-slider" id="full-pane-id<?php echo esc_attr($widget_id);?>" data-responsive-width="<?php echo esc_attr($instance['responsive_size'] );?>" data-scroll-out="<?php echo esc_attr($instance['scroll_out'] );?>" data-item-count="<?php echo esc_attr($count);?>">
				<?php
				if ( ! empty( $items ) ) :
						$i = 0;
						$items[0]['active'] = true; // First tab should be active.
					?>
						<?php foreach ( $items as $item ) : 
							if( isset( $item['background_image_url'] ) && ! empty( $item['background_image_url'] ) ) {
								$background_image = 'background-image:url('.esc_url( $item['background_image_url'] ).');';
							} else {
								$background_image = '';
							}
							if( isset( $item['background_color'] ) && ! empty( $item['background_color'] ) ) {
								$background_color = 'background-color:'.esc_attr( $item['background_color'] ).';';
							} else {
								$background_color = '';
							}
							if( isset($item['background_size']) && ! empty( $item['background_size'] ) ) {
								$background_size = 'background-size:'.esc_attr( $item['background_size'] ).';';
							} else {
								$background_size = '';
							}
							if( isset($item['background_position']) && ! empty( $item['background_position'] ) ) {
								$background_position = 'background-position:'.esc_attr( $item['background_position'] ).';';
							} else {
								$background_position = '';
							}

							?>
								<div class="kt-pane-section section" id="sectionnumber-<?php echo esc_attr($i);?>" style="<?php echo $background_image.$background_color.$background_size.$background_position; ?>">
									<div class="container">
											<?php echo siteorigin_panels_render( 'w'.$item['builder_id'], true, $item['panels_data'] ); ?>
									</div>
								</div>
						<?php $i ++; 
						endforeach; ?>
				<?php endif; ?>
			</div>
		</div>
		</div>


			<?php
        echo $after_widget;

    }

    private function format_id_from_name( $tab_title ) {

			// To lowercase.
			$tab_id = strtolower( $tab_title );
			// Clean up multiple dashes or whitespaces.
			$tab_id = preg_replace( '/[\s-]+/', ' ', $tab_id );
			// Convert whitespaces and underscore to dash.
			$tab_id = preg_replace( '/[\s_]/', '-', $tab_id );
			// Remove all specials characters that are not unicode letters, numbers or dashes.
			$tab_id = preg_replace( '/[^\p{L}\p{N}-]+/u', '', $tab_id );

			// Add suffix if there are multiple identical tab titles.
			if ( array_key_exists( $tab_id, $this->used_IDs ) ) {
				$this->used_IDs[ $tab_id ] ++;
				$tab_id = $tab_id . '-' . $this->used_IDs[ $tab_id ];
			}
			else {
				$this->used_IDs[ $tab_id ] = 0;
			}

			// Return unique ID.
			return $tab_id;
		}
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['responsive_size'] = (int) $new_instance['responsive_size'];
        $instance['scroll_out'] = sanitize_text_field( $new_instance['scroll_out'] );
        if ( ! empty( $new_instance['items'] )  ) {
			foreach ( $new_instance['items'] as $key => $item ) {
				$instance['items'][ $key ]['id']          = sanitize_key( $item['id'] );
				$instance['items'][ $key ]['background_color']	= sanitize_text_field( $item['background_color'] );
				$instance['items'][ $key ]['background_image_id']  = sanitize_text_field( $item['background_image_id'] );
				$instance['items'][ $key ]['background_image_url']  = esc_url_raw( $item['background_image_url'] );
				$instance['items'][ $key ]['background_position']  = sanitize_text_field( $item['background_position'] );
				$instance['items'][ $key ]['background_size']  = sanitize_text_field( $item['background_size'] );
				$instance['items'][ $key ]['builder_id']  = uniqid();
				$instance['items'][ $key ]['panels_data'] = is_string( $item['panels_data'] ) ? json_decode( $item['panels_data'], true ) : $item['panels_data'];
			}
		}
        // Sort items by ids, because order might have changed.
        if ( isset( $instance['items'] ) && is_array( $instance['items'] ) ) {
			usort( $instance['items'], array( $this, 'sort_by_id' ) );
		}

        return $instance;
    }

    function sort_by_id( $a, $b ) {
		return $a['id'] - $b['id'];
	}


  	public function form($instance){
  			$responsive_size = ! empty( $instance['responsive_size'] ) ? $instance['responsive_size'] : '';
			$scroll_out = isset( $instance['scroll_out'] ) ? $instance['scroll_out'] : 'true';
			$items        = isset( $instance['items'] ) ? $instance['items'] : array();
			// Page Builder fix when using repeating fields
			if ( 'temp' === $this->id ) {
				$this->current_widget_id = $this->number;
			}
			else {
				$this->current_widget_id = $this->id;
			}
			$scroll_out_options = array(array("slug" => "true", "name" => __('True', 'ascend')), array("slug" => "false", "name" => __('False', 'ascend')));
			$scroll_out_array = array();
			foreach ($scroll_out_options as $scroll_out_option) {
				if ($scroll_out == $scroll_out_option['slug']) { $selected=' selected="selected"';} else { $selected=""; }
				$scroll_out_array[] = '<option value="' . $scroll_out_option['slug'] .'"' . $selected . '>' . $scroll_out_option['name'] . '</option>';
			}
		?>
		<h3><?php esc_html_e( 'Settings:', 'kadence-fullpane-slider' ); ?></h3>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'responsive_size' ) ); ?>"><?php esc_html_e( 'Switch to responsive mode at pixel size: (Leave blank to not use responsive mode)', 'kadence-fullpane-slider' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'responsive_size' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'responsive_size' ) ); ?>" type="text" value="<?php echo esc_attr( $responsive_size ); ?>" />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'scroll_out' ) ); ?>"><?php esc_html_e( 'Allow scrolling out of slider to rest of content', 'kadence-fullpane-slider' ); ?></label>
			<select id="<?php echo $this->get_field_id('scroll_out'); ?>" style="width:100%; max-width:230px;" name="<?php echo $this->get_field_name('scroll_out'); ?>"><?php echo implode('', $scroll_out_array);?></select>
		</p>

		<h3><?php esc_html_e( 'Panes:', 'kadence-fullpane-slider' ); ?></h3>

		<script type="text/template" id="js-kadence-fullpane-<?php echo esc_attr( $this->current_widget_id ); ?>">
			<div class="kadence-fullpane-widget  ui-widget  ui-widget-content  ui-helper-clearfix  ui-corner-all">
				<div class="kadence-fullpane-widget-header  ui-widget-header  ui-corner-all">
					<span class="dashicons  dashicons-sort"></span>
					<span><?php esc_html_e( 'Pane', 'kadence-fullpane-slider' ); ?> - </span>
					<span class="kadence-fullpane-widget-header-title">{{id}}</span>
					<span class="kadence-fullpane-widget-toggle  dashicons  dashicons-minus"></span>
				</div>
				<div class="kadence-fullpane-widget-content">
					<div class="kad_fullpane_pane_section">
					<label><?php echo __( 'Pane content:', 'kadence-fullpane-slider' ); ?></label>
					<div class="siteorigin-page-builder-widget siteorigin-panels-builder siteorigin-panels-builder-kadence-fullpanes" id="siteorigin-page-builder-widget-{{builder_id}}" data-builder-id="{{builder_id}}" data-type="layout_widget">
						<p>
							<a href="#" class="button-secondary siteorigin-panels-display-builder" ><?php _e('Open Builder', 'kadence-fullpane-slider') ?></a>
						</p>

						<input type="hidden" data-panels-filter="json_parse" value="{{panels_data}}" class="panels-data" name="<?php echo esc_attr( $this->get_field_name( 'items' ) ); ?>[{{id}}][panels_data]" />
					</div>
					</div>
					<div class="kad_fullpane_background_section">
					<div class="kad_fullpane_img_upload">
						<p>
							<label for="<?php echo $this->get_field_id('background_image_url'); ?>">
								<?php _e('Background Image', 'kadence-fullpane-slider'); ?>
							</label>
							<img class="kad_fullpane_media_image" src="{{background_image_url}}" style="margin:0;padding:0;max-width:100px;display:block" />
							<input type="text" class="widefat kad_fullpane_media_url" name="<?php echo $this->get_field_name('items'); ?>[{{id}}][background_image_url]" id="<?php echo $this->get_field_id('items'); ?>-{{id}}-background_image_url" value="{{background_image_url}}">
							 <input type="hidden" value="{{background_image_id}}" class="kad_fullpane_media_id" name="<?php echo $this->get_field_name('items'); ?>[{{id}}][background_image_id]" id="<?php echo $this->get_field_id('items'); ?>-{{id}}-background_image_id" />
							 <input type="button" value="<?php _e('Upload', 'kadence-fullpane-slider'); ?>" class="button kad_fullpane_media_upload" />
						</p>
					</div>
					<p>
						<label for="<?php echo $this->get_field_id('background_color'); ?>">
							<?php _e('Background Color (e.g. = #444444)', 'kadence-fullpane-slider'); ?>
						</label>
						<input type="text" class="widefat kad-fullpane-colorpicker" style="width: 70px;"  name="<?php echo $this->get_field_name('items'); ?>[{{id}}][background_color]" id="<?php echo $this->get_field_id('items'); ?>-{{id}}-background_color" value="{{background_color}}">
					</p>
					<p>
						<label for="<?php echo $this->get_field_id('background_position'); ?>">
							<?php _e('Background Position (e.g. = center center)', 'kadence-fullpane-slider'); ?>
						</label>
						<input class="widefat " id="<?php echo esc_attr( $this->get_field_id( 'items' ) ); ?>-{{id}}-background_position" name="<?php echo esc_attr( $this->get_field_name( 'items' ) ); ?>[{{id}}][background_position]" type="text" value="{{background_position}}" />
					</p>
					<p>
						<label for="<?php echo $this->get_field_id('background_size'); ?>">
							<?php _e('Background Size (e.g. = cover)', 'kadence-fullpane-slider'); ?>
						</label>
						<input class="widefat " id="<?php echo esc_attr( $this->get_field_id( 'items' ) ); ?>-{{id}}-background_size" name="<?php echo esc_attr( $this->get_field_name( 'items' ) ); ?>[{{id}}][background_size]" type="text" value="{{background_size}}" />
					</p>
					<p>
						<input name="<?php echo esc_attr( $this->get_field_name( 'items' ) ); ?>[{{id}}][id]" class="js-kadence-fullpane-id" type="hidden" value="{{id}}" />
						<a href="#" class="kadence-remove-fullpane  js-kadence-remove-fullpane"><span class="dashicons dashicons-dismiss"></span> <?php echo __( 'Remove pane', 'kadence-fullpane-slider' ); ?></a>
					</p>
				</div>
				</div>
			</div>
		</script>

		<div class="kadence-widget-fullpane" id="fullpanes-<?php echo esc_attr( $this->current_widget_id ); ?>">
			<div class="fullpanes  js-kadence-sortable-fullpane"></div>
			<p>
				<a href="#" class="button  js-kadence-add-fullpane"><?php echo  __( 'Add new pane', 'kadence-fullpane-slider' ); ?></a>
			</p>
		</div>

		<script type="text/javascript">
			(function( $ ) {
				var tabsJSON = <?php echo wp_json_encode( $items ) ?>;

				// Get the right widget id and remove the added < > characters at the start and at the end.
				var widgetId = '<<?php echo esc_js( $this->current_widget_id ); ?>>'.slice( 1, -1 );

				if ( _.isFunction( KTFullpane.Utils.repopulateTabs ) ) {
					KTFullpane.Utils.repopulateTabs( tabsJSON, widgetId );
				}

				// Make tabs settings sortable.
				$( '.js-kadence-sortable-fullpane' ).sortable({
					items: '.kadence-widget-single-fullpane',
					handle: '.kadence-fullpane-widget-header',
					cancel: '.kadence-fullpane-widget-toggle',
					placeholder: 'kadence-fullpane-widget-placeholder',
					stop: function( event, ui ) {
						$( this ).find( '.js-kadence-fullpane-id' ).each( function( index ) {
							$( this ).val( index );
						});
					}
				});
			})( jQuery );
		</script>

		<?php
		}
}
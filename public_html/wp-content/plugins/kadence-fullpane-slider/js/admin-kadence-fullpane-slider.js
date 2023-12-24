(function($){
    "use strict";

    $.fullpaneimgupload = $.fullpaneimgupload || {};
    
    $( window ).on( "load", function() {
         $.fullpaneimgupload();
    });
$.fullpaneimgupload = function(){
        // When the user clicks on the Add/Edit gallery button, we need to display the gallery editing
        $('body').on({
             click: function(event){
                var current_imgupload = $(this).closest('.kad_fullpane_img_upload');

                // Make sure the media gallery API exists
                if ( typeof wp === 'undefined' || ! wp.media ) {
                    return;
                }
                event.preventDefault();

                var frame;
                // Activate the media editor
                var $$ = $(this);

                // If the media frame already exists, reopen it.
                if ( frame ) {
                        frame.open();
                        return;
                    }

                    // Create the media frame.
                    frame = wp.media({
                        multiple: false,
                        library: {type: 'image'}
                    });

                        // When an image is selected, run a callback.
                frame.on( 'select', function() {

                    // Grab the selected attachment.
                    var attachment = frame.state().get('selection').first();
                    frame.close();

                    current_imgupload.find('.kad_fullpane_media_url').val(attachment.attributes.url);
                    current_imgupload.find('.kad_fullpane_media_id').val(attachment.attributes.id);
                    var thumbSrc = attachment.attributes.url;
                    if (typeof attachment.attributes.sizes !== 'undefined' && typeof attachment.attributes.sizes.thumbnail !== 'undefined') {
                        thumbSrc = attachment.attributes.sizes.thumbnail.url;
                    } else {
                        thumbSrc = attachment.attributes.icon;
                    }
                    current_imgupload.find('.kad_fullpane_media_image').attr('src', thumbSrc);
                });

                // Finally, open the modal.
                frame.open();
            }

        }, '.kad_fullpane_media_upload');
     };
})(jQuery);
(function($){
    "use strict";

    $.fullpanecolorpicker = $.fullpanecolorpicker || {};
    
$.fullpanecolorpicker = function( widget ){
		$(widget).find( '.kad-fullpane-colorpicker' ).wpColorPicker( {
	                change: _.throttle( function() { // For Customizer
	                        $(this).trigger( 'change' );
	                }, 3000 )
	    });
     };
})(jQuery);
(function($){
    "use strict";

    $.fullpaneonform = $.fullpaneonform || {};
    
$.fullpaneonform = function( event, widget ){
		$.fullpanecolorpicker(widget);
     };
})(jQuery);
(function($){
    "use strict";

    $.fullpaneonpanel = $.fullpaneonpanel || {};
    
$.fullpaneonpanel = function(){
		$.fullpanecolorpicker('.fullpanes');
     };
})(jQuery);

/* Tabs and accordion widget. Thanks Proteus themes for plugin example. */

/**
 * Admin dashboard JS code
 */
(function( $ ) {
	$( document ).on( 'widget-added widget-updated', $.fullpaneonform );
	//$( document ).on( 'panelsopen', $.fullpaneimgupload );
	$( document ).on( 'panelsopen', $.fullpaneonpanel );
	// Make tabs settings foldable.
	$(document).on( 'click', '.kadence-fullpane-widget-toggle', function() {
		$( this ).toggleClass( 'dashicons-minus dashicons-plus' );
		$( this ).closest( '.kadence-fullpane-widget' ).find( '.kadence-fullpane-widget-content' ).toggle();
	});
	$(document).on( 'click', '.js-kadence-add-fullpane', function() {
		setTimeout(function(){ $.fullpanecolorpicker('.fullpanes') }, 700);
	});


})( jQuery );

/********************************************************
 			Backbone code for repeating fields in widget
********************************************************/

// Namespace for Backbone elements
window.KTFullpane = {
	Models:    {},
	ListViews: {},
	Views:     {},
	Utils:     {},
};

/**
 ******************** Backbone Models *******************
 */

_.extend( KTFullpane.Models, {
	Tab: Backbone.Model.extend( {
		defaults: {
			'title':       '',
			'builder_id':  '',
			'panels_data': '',
		}
	} ),
} );

/**
 ******************** Backbone Views *******************
 */

// Generic single view that others can extend from
KTFullpane.Views.Abstract = Backbone.View.extend( {
	initialize: function ( params ) {
		this.templateHTML = params.templateHTML;

		return this;
	},

	render: function () {
		this.$el.html( Mustache.render( this.templateHTML, this.model.attributes ) );

		return this;
	},

	destroy: function ( ev ) {
		ev.preventDefault();

		this.remove();
		this.model.trigger( 'destroy' );
	},
} );

_.extend( KTFullpane.Views, {

	// View of a single tab
	Tab: KTFullpane.Views.Abstract.extend( {
		className: 'kadence-widget-single-fullpane',

		events: {
			'click .js-kadence-remove-fullpane': 'destroy',
		},

		render: function () {
			this.model.set( 'panels_data', JSON.stringify( this.model.get('panels_data') ) );
			this.$el.html( Mustache.render( this.templateHTML, this.model.attributes ) );

			return this;
		},
	} ),

} );


/**
 ******************** Backbone ListViews *******************
 *
 * Parent container for multiple view nodes.
 */

KTFullpane.ListViews.Abstract = Backbone.View.extend( {

	initialize: function ( params ) {
		this.widgetId     = params.widgetId;
		this.itemsModel   = params.itemsModel;
		this.itemView     = params.itemView;
		this.itemTemplate = params.itemTemplate;

		// Cached reference to the element in the DOM
		this.$items = this.$( params.itemsClass );

		// Collection of items
		this.items = new Backbone.Collection( [], {
			model: this.itemsModel
		} );

		// Listen to adding of the new items
		this.listenTo( this.items, 'add', this.appendOne );

		return this;
	},

	addNew: function ( ev ) {
		ev.preventDefault();

		var currentMaxId = this.getMaxId();

		this.items.add( new this.itemsModel( {
			id: (currentMaxId + 1)
		} ) );

		return this;
	},

	getMaxId: function () {
		if ( this.items.isEmpty() ) {
			return -1;
		}
		else {
			var itemWithMaxId = this.items.max( function ( item ) {
				return parseInt( item.id, 10 );
			} );

			return parseInt( itemWithMaxId.id, 10 );
		}
	},

	appendOne: function ( item ) {
		var renderedItem = new this.itemView( {
			model:        item,
			templateHTML: jQuery( this.itemTemplate + this.widgetId ).html()
		} ).render();

		var currentWidgetId = this.widgetId;

		// If the widget is in the initialize state (hidden), then do not append a new item
		if ( '__i__' !== currentWidgetId.slice( -5 ) ) {
			this.$items.append( renderedItem.el );
		}

		return this;
	}
} );


_.extend( KTFullpane.ListViews, {

	// Collection of all tabs, but associated with each individual widget
	Tabs: KTFullpane.ListViews.Abstract.extend( {
		events: {
			'click .js-kadence-add-fullpane': 'addNew'
		},

		// Overwrite the appendOne function to setup the layout builder
		appendOne: function ( item ) {
			// Set an unique ID for a new tab (will be used in the div id)
			item.attributes.builder_id = _.uniqueId('layout-builder-');

			var renderedItem = new this.itemView( {
				model:        item,
				templateHTML: jQuery( this.itemTemplate + this.widgetId ).html()
			} ).render();

			var currentWidgetId = this.widgetId;

			// If the widget is in the initialize state (hidden), then do not append a new item
			if ( '__i__' !== currentWidgetId.slice( -5 ) ) {
				this.$items.append( renderedItem.el );
			}

			// Setup the Page Builder layout builder
			if(typeof jQuery.fn.soPanelsSetupBuilderWidget != 'undefined' && !jQuery('body').hasClass('wp-customizer')) {
				jQuery( "#siteorigin-page-builder-widget-" + item.attributes.builder_id ).soPanelsSetupBuilderWidget();
			}

			return this;
		}
	} ),
} );


/**
 ******************** Repopulate Functions *******************
 */

_.extend( KTFullpane.Utils, {
	// Generic repopulation function used in all repopulate functions
	repopulateGeneric: function ( collectionType, parameters, json, widgetId ) {
		var collection = new collectionType( parameters );

		// Convert to array if needed
		if ( _( json ).isObject() ) {
			json = _( json ).values();
		}

		// Add all items to collection of newly created view
		collection.items.add( json, { parse: true } );
	},

	/**
	 * Function which adds the existing tabs to the DOM
	 * @param  {json} tabsJSON
	 * @param  {string} widgetId ID of widget from PHP $this->id
	 * @return {void}
	 */
	repopulateTabs: function ( tabsJSON, widgetId ) {
		var parameters = {
			el:           '#fullpanes-' + widgetId,
			widgetId:     widgetId,
			itemsClass:   '.fullpanes',
			itemTemplate: '#js-kadence-fullpane-',
			itemsModel:   KTFullpane.Models.Tab,
			itemView:     KTFullpane.Views.Tab,
		};

		this.repopulateGeneric( KTFullpane.ListViews.Tabs, parameters, tabsJSON, widgetId );
	},
} );

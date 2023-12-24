if ( typeof wc_checkout_params !== 'undefined' ) {
	jQuery( document.body ).on( 'checkout_error', function(){
		setTimeout(function(){
            if(typeof turnstile != "undefined") {
                jQuery('form').find( '.cf-turnstile' ).each( function() {
                    turnstile.render('.cf-turnstile')
                });
            }
		}, 100);
	});
	jQuery( document.body ).on( 'updated_checkout', function(){
		setTimeout(function(){
            if(typeof turnstile != "undefined") {
                jQuery('form').find( '.cf-turnstile' ).each( function() {
                    turnstile.render('.cf-turnstile')
                });
            }
		}, 100);
	});
}

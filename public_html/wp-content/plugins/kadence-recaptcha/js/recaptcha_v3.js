if ( typeof wc_checkout_params !== 'undefined' ) {
	jQuery( document.body ).on( 'checkout_error', function(){
		setTimeout(function(){
			jQuery('form').find( '.kt-g-recaptcha' ).each( function() {
				var item = jQuery( this );
				grecaptcha.execute( ktrecap.recaptcha_skey, { action: 'checkout' } ).then(function (token) { item.val( token ); });
			});
		}, 100);
	});
	jQuery( document.body ).on( 'updated_checkout', function(){
		setTimeout(function(){
			jQuery('form').find( '.kt-g-recaptcha' ).each( function() {
				var item = jQuery( this );
				grecaptcha.execute( ktrecap.recaptcha_skey, { action: 'checkout' } ).then(function (token) { item.val( token ); });
			});
		}, 100);
	});
}

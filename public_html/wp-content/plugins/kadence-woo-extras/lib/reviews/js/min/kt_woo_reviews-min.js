jQuery(document).ready(function(e){var t;0==("function"==typeof e().modal)&&(e(document).on("click",'.kt-review-vote[data-toggle="modal"]',function(t){t.preventDefault();var o=e(this),a=e(o.attr("data-target"));a.hasClass("kt-modal-open")?a.removeClass("kt-modal-open"):a.addClass("kt-modal-open")}),e(document).on("click",".kt-modal-open .close",function(t){t.preventDefault(),e(this).parents(".kt-modal-open").removeClass("kt-modal-open")})),e(document).on("click",'.kt-review-vote[data-vote="review"]',function(t){if(t.preventDefault(),!e(this).hasClass("kt-vote-review-selected")){var o=e(this).data("comment-id"),a=e(this).hasClass("kt-vote-down")?"negative":"positive",r=e(this).parents(".comment_container");r.find(".kt-review-overlay").fadeIn();var n={action:"kt_review_vote",comment_id:o,user_id:kt_product_reviews.user_id,vote:a,wpnonce:kt_product_reviews.nonce};e(this).siblings(".kt-vote-review-selected").removeClass("kt-vote-review-selected"),e(this).addClass("kt-vote-review-selected"),e.post(woocommerce_params.ajax_url,n,function(e){0==jQuery.trim(e)?r.find(".kt-review-helpful").empty().append(kt_product_reviews.error):r.find(".kt-review-helpful").empty().append(e.value),r.find(".kt-review-overlay").fadeOut()})}}),e(document).on("click",".kt-ajax-load-more-reviews",function(t){t.preventDefault();var o=e(this),a=o.data("review-args"),r=o.data("product-id"),n=o.data("review-count"),i=o.attr("data-offset-count"),d=o.parents("#comments");d.find(".kt-review-load-more-loader").fadeIn();var s={action:"kt_review_readmore",args:a,product_id:r,offset:i,wpnonce:kt_product_reviews.nonce};e.post(woocommerce_params.ajax_url,s,function(e){0==jQuery.trim(e)?d.find(".kt-ajax-load-more-reviews-container").append(kt_product_reviews.error):""==jQuery.trim(e)?(d.find(".kt-ajax-load-more-reviews-container").append(kt_product_reviews.nomoreviews),o.fadeOut(),setTimeout(function(){d.find(".kt-ajax-load-more-reviews-container").fadeOut()},2e3)):(o.attr("data-offset-count",Math.floor(+i+ +a.numberposts)),d.find(".commentlist").append(e.value),Math.floor(+i+ +a.numberposts)>=n&&o.fadeOut()),d.find(".kt-review-load-more-loader").fadeOut()})})});
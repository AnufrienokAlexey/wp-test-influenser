!function(e){"use strict";redux.field_objects=redux.field_objects||{},redux.field_objects.sorter=redux.field_objects.sorter||{};var t="";e(document).ready((function(){})),redux.field_objects.sorter.init=function(i){i||(i=e(document).find(".redux-group-tab:visible").find(".redux-container-sorter:visible")),e(i).each((function(){var i=e(this),r=i;i.hasClass("redux-field-container")||(r=i.parents(".redux-field-container:first")),r.is(":hidden")||r.hasClass("redux-field-init")&&(r.removeClass("redux-field-init"),i.find(".redux-sorter").each((function(){var r=e(this).attr("id");i.find("#"+r).find("ul").sortable({items:"li",placeholder:"placeholder",connectWith:".sortlist_"+r,opacity:.8,scroll:!1,out:function(i,r){r.helper&&(t=r.offset.top>0?"down":"up",redux.field_objects.sorter.scrolling(e(this).parents(".redux-field-container:first")))},over:function(e,i){t=""},deactivate:function(e,i){t=""},stop:function(t,i){var r=redux.sorter[e(this).attr("data-id")],s=e(this).find("h3").text();r.limits&&s&&r.limits[s]&&(e(this).children("li").length>=r.limits[s]?(e(this).addClass("filled"),e(this).children("li").length>r.limits[s]&&e(i.sender).sortable("cancel")):e(this).removeClass("filled"))},update:function(t,i){var r=redux.sorter[e(this).attr("data-id")],s=e(this).find("h3").text();r.limits&&s&&r.limits[s]&&(e(this).children("li").length>=r.limits[s]?(e(this).addClass("filled"),e(this).children("li").length>r.limits[s]&&e(i.sender).sortable("cancel")):e(this).removeClass("filled")),e(this).find(".position").each((function(){var t=e(this).parent().attr("data-id"),i=e(this).parent().parent().attr("data-group-id");redux_change(e(this));var r=e(this).parent().parent().parent().attr("id");e(this).prop("name",redux.args.opt_name+"["+r+"]["+i+"]["+t+"]")}))}}),i.find(".redux-sorter").disableSelection()})))}))},redux.field_objects.sorter.scrolling=function(e){if(void 0!==e){var i=e.find(".redux-sorter");"up"==t?(i.scrollTop(i.scrollTop()-20),setTimeout(redux.field_objects.sorter.scrolling,50)):"down"==t&&(i.scrollTop(i.scrollTop()+20),setTimeout(redux.field_objects.sorter.scrolling,50))}}}(jQuery);
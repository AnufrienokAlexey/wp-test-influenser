!function($){"use strict";$.fullpaneimgupload=$.fullpaneimgupload||{},$(window).on("load",function(){$.fullpaneimgupload()}),$.fullpaneimgupload=function(){$("body").on({click:function(e){var t=$(this).closest(".kad_fullpane_img_upload");if("undefined"!=typeof wp&&wp.media){e.preventDefault();var i,n=$(this);if(i)return void i.open();i=wp.media({multiple:!1,library:{type:"image"}}),i.on("select",function(){var e=i.state().get("selection").first();i.close(),t.find(".kad_fullpane_media_url").val(e.attributes.url),t.find(".kad_fullpane_media_id").val(e.attributes.id);var n=e.attributes.url;n=void 0!==e.attributes.sizes&&void 0!==e.attributes.sizes.thumbnail?e.attributes.sizes.thumbnail.url:e.attributes.icon,t.find(".kad_fullpane_media_image").attr("src",n)}),i.open()}}},".kad_fullpane_media_upload")}}(jQuery),function($){"use strict";$.fullpanecolorpicker=$.fullpanecolorpicker||{},$.fullpanecolorpicker=function(e){console.log(e),$(e).find(".kad-fullpane-colorpicker").wpColorPicker({change:_.throttle(function(){$(this).trigger("change")},3e3)})}}(jQuery),function($){"use strict";$.fullpaneonform=$.fullpaneonform||{},$.fullpaneonform=function(e,t){$.fullpanecolorpicker(t)}}(jQuery),function($){"use strict";$.fullpaneonpanel=$.fullpaneonpanel||{},$.fullpaneonpanel=function(){$.fullpanecolorpicker(".fullpanes")}}(jQuery),function($){$(document).on("widget-added widget-updated",$.fullpaneonform),$(document).on("panelsopen",$.fullpaneonpanel),$(document).on("click",".kadence-fullpane-widget-toggle",function(){$(this).toggleClass("dashicons-minus dashicons-plus"),$(this).closest(".kadence-fullpane-widget").find(".kadence-fullpane-widget-content").toggle()}),$(document).on("click",".js-kadence-add-fullpane",function(){setTimeout(function(){$.fullpanecolorpicker(".fullpanes")},700)})}(jQuery),window.KTFullpane={Models:{},ListViews:{},Views:{},Utils:{}},_.extend(KTFullpane.Models,{Tab:Backbone.Model.extend({defaults:{title:"",builder_id:"",panels_data:""}})}),KTFullpane.Views.Abstract=Backbone.View.extend({initialize:function(e){return this.templateHTML=e.templateHTML,this},render:function(){return this.$el.html(Mustache.render(this.templateHTML,this.model.attributes)),this},destroy:function(e){e.preventDefault(),this.remove(),this.model.trigger("destroy")}}),_.extend(KTFullpane.Views,{Tab:KTFullpane.Views.Abstract.extend({className:"kadence-widget-single-fullpane",events:{"click .js-kadence-remove-fullpane":"destroy"},render:function(){return this.model.set("panels_data",JSON.stringify(this.model.get("panels_data"))),this.$el.html(Mustache.render(this.templateHTML,this.model.attributes)),this}})}),KTFullpane.ListViews.Abstract=Backbone.View.extend({initialize:function(e){return this.widgetId=e.widgetId,this.itemsModel=e.itemsModel,this.itemView=e.itemView,this.itemTemplate=e.itemTemplate,this.$items=this.$(e.itemsClass),this.items=new Backbone.Collection([],{model:this.itemsModel}),this.listenTo(this.items,"add",this.appendOne),this},addNew:function(e){e.preventDefault();var t=this.getMaxId();return this.items.add(new this.itemsModel({id:t+1})),this},getMaxId:function(){if(this.items.isEmpty())return-1;var e=this.items.max(function(e){return parseInt(e.id,10)});return parseInt(e.id,10)},appendOne:function(e){var t=new this.itemView({model:e,templateHTML:jQuery(this.itemTemplate+this.widgetId).html()}).render();return"__i__"!==this.widgetId.slice(-5)&&this.$items.append(t.el),this}}),_.extend(KTFullpane.ListViews,{Tabs:KTFullpane.ListViews.Abstract.extend({events:{"click .js-kadence-add-fullpane":"addNew"},appendOne:function(e){e.attributes.builder_id=_.uniqueId("layout-builder-");var t=new this.itemView({model:e,templateHTML:jQuery(this.itemTemplate+this.widgetId).html()}).render();return"__i__"!==this.widgetId.slice(-5)&&this.$items.append(t.el),void 0===jQuery.fn.soPanelsSetupBuilderWidget||jQuery("body").hasClass("wp-customizer")||jQuery("#siteorigin-page-builder-widget-"+e.attributes.builder_id).soPanelsSetupBuilderWidget(),this}})}),_.extend(KTFullpane.Utils,{repopulateGeneric:function(e,t,i,n){var l=new e(t);_(i).isObject()&&(i=_(i).values()),l.items.add(i,{parse:!0})},repopulateTabs:function(e,t){var i={el:"#fullpanes-"+t,widgetId:t,itemsClass:".fullpanes",itemTemplate:"#js-kadence-fullpane-",itemsModel:KTFullpane.Models.Tab,itemView:KTFullpane.Views.Tab};this.repopulateGeneric(KTFullpane.ListViews.Tabs,i,e,t)}});
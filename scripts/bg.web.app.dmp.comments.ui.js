(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.comments === undefined) $.bg.web.app.dmp.comments = {};
	
	var localConfig = {};
	// main page object
	var section = function (config) {
    	return {
        	control: function () {
            	return config.comments.control;
        	},
        	init: function () {
            	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                	//  handle specific edit/read-only functions
                	if (config.editMode) {
                    	section(config).isValid();
                	}
            	} else {
                	//  hide content so we can refresh it
                	config.comments.containerPanelBody.hide();
                	config.comments.spinner.show();
                	if (config.editMode) {
                    	var $astrisk = config.comments.control.closest(".section-container").find(".astrisk");
                    	if (this.isRequired()) {
                        	$astrisk.show();
                    	} else {
                        	$astrisk.hide();
                    	}
                	};
                	//  bind the section controls
                	this.bind();
                	//  show the section content and hide the spinner to indicate that it's done loading
                	config.comments.containerPanelBody.slideDown();
                	config.comments.spinner.hide();
                	config.page.centerColumn.trigger(config.page.data.eventHandler.SECTION_LOAD_COMPLETE);
            	}

        	},
        	bind: function () {
            	var $comment = config.comments.description;
            	$comment.html($comment.html().replace("{{DESCRIPTION}}", config.comments.data.description[config.page.info.dmpType.replace(" ", "").toLowerCase()]));
            	$.bg.web.control.comment.ui.init({
                	value: this.dbValue() || this.defaultValue() || "",
                	editMode: config.editMode,
                	control: config.comments.control,
                	charNumControl: config.comments.charsLeft,
                	readOnlyControl: config.comments.readOnlyControl,
                	validation: {
                    	errorClass: config.validation.ERROR_CLASS,
                    	maxChars: config.comments.control.attr("maxlength")
                	},
                	events: {
                    	onChangeCallback: function (isValid) {
                        	//  update the isDirty indicator and log the changes
                        	config.references.utility.data.dirtyLogger({
                            	dbValue: function () {
                                	return section(config).dbValue();
                            	},
                            	defaultValue: function () {
                                	return section(config).defaultValue();
                            	},
                            	control: function () {
                                	return section(config).control();
                            	},
                            	val: function () {
                                	return config.references.utility.getString(this.control().val());
                            	}
                        	});
                    	},
                    	onInitCallback: function (control) {
                        	if (config.editMode) {
                            	config.comments.description.show();
                            	config.comments.control.show();
                            	config.comments.charsLeft.show();
                            	config.comments.readOnlyControl.hide();
                        	} else {
                            	config.comments.description.hide();
                            	config.comments.control.hide();
                            	config.comments.charsLeft.hide();
                            	if (config.comments.control.val().length === 0) {
                                	config.comments.readOnlyControl.hide();
                            	} else {
                                	if (config.comments.control.val().length < 500) {
                                    	$(config.comments.readOnlyControl).css({ "height": "", "min-height": "75px" });
                                	} else if (config.comments.control.val().length < 1000) {
                                    	$(config.comments.readOnlyControl).css({ "height": "", "min-height": "100px" });
                                	} else if (config.comments.control.val().length < 1500) {
                                    	$(config.comments.readOnlyControl).css({ "height": "", "min-height": "125px" });
                                	} else if (config.comments.control.val().length < 2000) {
                                    	$(config.comments.readOnlyControl).css({ "height": "", "min-height": "150px" });
                                	} else if (config.comments.control.val().length < 2500) {
                                    	$(config.comments.readOnlyControl).css({ "height": "", "min-height": "175px" });
                                	} else {
                                    	$(config.comments.readOnlyControl).css({ "height": "200px", "min-height": "200px" });
                                	}
                                	config.comments.readOnlyControl.css({ "border": "solid 1px #eee" }).slideDown();
                            	}
                        	}
                    	},
                    	onBlurCallback: function () {
                        	section(config).isValid();
                    	}
                	},
                	utility: $.bg.web.app.common.utility
            	});
        	},
        	dbValue: function () {
            	return config.comments.data.dbValue;
        	},
        	defaultValue: function () {
            	return config.comments.data.defaultValue;
        	},
        	val: function () {
            	return config.references.utility.getString(this.control.val());
        	},
        	isRequired: function () {
            	//  required if only the "action taken - principal" is checked
            	return config.comments.validation.required(config);
        	},
        	isValid: function () {
            	//  remove any previous error message
            	config.comments.sectionContent.find("." + config.validation.ERROR_CLASS).remove();
            	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                	if (config.editMode && this.isRequired()) {
                    	//  no comment
                    	if (config.comments.control.val().length === 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).appendTo(config.comments.charsLeft);
                        	return false;
                    	}
                	}
            	}
            	if (config.comments.control.data("data-toomanychars")) {
                	config.references.utility.html({
                    	klass: config.validation.ERROR_CLASS,
                    	text: config.comments.control.data("data-message")
                	}).appendTo(config.comments.charsLeft.empty());
                	return false;
            	}
            	return true;
        	}
    	}
	};
	//  public API
	$.bg.web.app.dmp.comments.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	var url = localConfig.url;
        	var scripts = [];
        	if (__useMinified) {
            	scripts.push({ path: "Js/bg/Controls/comment.ui.min.js?ver=" + localConfig.jsVersion, referenceCheck: $.bg.web && $.bg.web.control && $.bg.web.control.comment ? true : false, url: url, order: 5 });
        	} else {
            	scripts.push({ path: "Js/bg/Controls/comment.ui.debug.js?ver=" + localConfig.jsVersion, referenceCheck: $.bg.web && $.bg.web.control && $.bg.web.control.comment ? true : false, url: url, order: 5 });
        	}
        	//  get array of references in order for which to load
        	var scriptDependencies = $.bg.web.app.common.utility.loader.references.get(scripts);
        	//  load multiple scripts sequentially, then initialize once additional scripts are done loading
        	$.bg.web.app.common.utility.loader.scripts.load(scriptDependencies).done(function () {
            	//  initialize the comment.ui wrapper control
            	section(localConfig).init();
        	});
    	}
	};
})(jQuery);
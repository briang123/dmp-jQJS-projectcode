(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.disclosure === undefined) $.bg.web.app.dmp.disclosure = {};
	if ($.bg.web.app.dmp.disclosure.basis === undefined) $.bg.web.app.dmp.disclosure.basis = {};

	var localConfig = {
    	disclosure: {
        	data: {
            	questions: null
        	}
    	}
	};
	var section = function (config) {
    	return {
        	init: function () {
            	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                	//  handle specific edit/read-only functions
                	if (config.editMode) {
                    	this.disclosureQuestions.isValid();
                	}
            	} else {
                	//  initialize the disclosure description
                	config.disclosure.description.html(config.disclosure.description.html().replace(/{{DESCRIPTION}}/, config.disclosure.data.description ? config.disclosure.data.description : ""));
                	//  initialize the disclosure questions
                	this.disclosureQuestions.init();
            	}
        	},
        	//  placeholder if we need to validate locally
        	validate: function () { },
        	disclosureQuestions: {
            	messageControl: function () {
                	return config.disclosure.messageControl;
            	},
            	control: function () {
                	return config.disclosure.container.find(":checkbox");
            	},
            	readOnlyControl: function () {
                	return config.disclosure.questions.find("span.readonly-control");
            	},
            	init: function () {
                	var $this = this;
                	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                    	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                    	//  handle specific edit/read-only functions
                    	if (config.editMode) {
                        	$this.isValid();
                    	}
                	} else {
                    	if (config.disclosure.data.questions) {
                        	if (config.editMode) {
                            	$this.reinit();
                        	} else {
                            	$this.initControls(config.disclosure.data.questions);
                        	}
                    	} else {
                        	setTimeout(function () {
                            	$this.getData();
                        	}, config.timeoutDelay);
                    	}
                	}
            	},
            	reinit: function (data) {
                	this.readOnlyControl().hide();
                	this.control().show();
            	},
            	initControls: function (data) {
                	var $this = this;
                	config.references.radioCheckboxUI.init({
                    	editMode: config.editMode,
                    	controlContainer: config.disclosure.questions,
                    	controlType: "checkbox",
                    	orientVertical: true,
                    	data: {
                        	rows: data,
                        	dbValue: config.disclosure.data.dbValue,
                        	defaultValue: config.disclosure.data.defaultValue,
                        	valueColumn: "CODE",
                        	textColumn: "DESCRIPTION",
                        	controlGroupName: "basis_disclosure_question"
                    	},
                    	events: {
                        	onInitCallback: function (controlConfig) { },
                        	onBindCallback: function (controlConfig) { },
                        	onClickCallback: function (e, control, controlConfig) {
                            	if (!config.editMode) {
                                	return false;
                            	} else {
                                	$this.isValid();
                            	}
                        	},
                        	onErrorCallback: function (controlConfig, ex) {
                            	config.references.utility.displayPageMessage(
                                	"An error occurred while attempting to intialize and render basis for disclosure " + controlConfig.controlType + " controls." + ex,
                                	config.references.globals.alerts.DANGER.klass,
                                	config.references.globals.alerts.DANGER.color,
                                	false,
                                	$this.messageControl().empty().selector,
                                	null
                            	);
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	getData: function () {
                	var $messageControl = section(config).disclosureQuestions.messageControl();
                	var $questionData = config.disclosure.data;
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, config.disclosure.data.typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	$questionData.questions = result.result.rows;
                                    	$this.initControls(result.result.rows);
                                    	//TODO: FOR SOME REASON, THE ASTRISK IS NOT SHOWING WHEN IN EDIT MODE
                                    	//  show the astrisk indicator if we're in edit mode
                                    	if (config.editMode) {
                                        	config.disclosure.astrisks.css({ "display": "inline" });
                                    	};
                                    	//  show content now that it's refreshed
                                    	config.disclosure.containerPanelBody.slideDown();
                                    	config.disclosure.spinner.hide();
                                    	config.page.centerColumn.trigger(config.page.data.eventHandler.SECTION_LOAD_COMPLETE);
                                	} else {
                                    	throw "NO DATA";
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw "Invalid result object";
                                	}
                            	}
                        	} else {
                            	throw "An unexpected error occurred while attempting to fetch the data. [BASIS FOR DISCLOSURE]";
                        	}
                    	} catch (ex) {
                        	config.checkPermission(ex);
                        	config.references.utility.displayPageMessage(
                            	ex,
                            	config.references.globals.alerts.DANGER.klass,
                            	config.references.globals.alerts.DANGER.color,
                            	false,
                            	$messageControl.empty().selector,
                            	null
                        	);
                    	}
                	});
            	},
            	isValid: function () {
                	//  remove any previous error message
                	config.disclosure.container.find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode) {
                    	//  no checked values
                    	if ($(config.disclosure.checkedOptonsSelector).length === 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).appendTo(config.disclosure.description);
                        	return false;
                    	}
                	}
                	return true;
            	}
        	}
    	}
	};
	
	//  public API
	$.bg.web.app.dmp.disclosure.basis.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	section(localConfig).init();
    	}
	};
})(jQuery);
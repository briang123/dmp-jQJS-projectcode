(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.employment === undefined) $.bg.web.app.dmp.employment = {};
	
	var localConfig = {
    	//NOTE: GLOBAL PROPERTY VALUES WILL BE MERGED INTO THIS OBJECT AND USED FOR DMP PAGE THIS UI IS FOR
    	
    	//  CURRENT PAGE UI INFORMATION
    	page: {
        	info: {
            	entityType: $.bg.web.app.dmp.ui.globals.page.info.entityTypes.INDIVIDUAL,
            	dmpType: $.bg.web.app.dmp.ui.globals.page.info.dmpTypes.EMPLOYMENT,
            	pageHeading: $.bg.web.app.dmp.ui.globals.page.info.pageHeadingTemplate.replace("{{TYPE}}", "Individual Employment")
        	},
        	data: {
            	employmentSaveObject: function (config) {
                	var $$mapping = config.references.utility.mapping;
                	var $$utility = config.references.utility;
                	var $$empDiscDetails = config.empDiscDetails;
                	var empDiscMappings = $$empDiscDetails.mappings;
                	var empDiscContainer = $$empDiscDetails.containerId;
                	var $$empDiscKeys = $$empDiscDetails.keys;
                	return {
                    	disclosure: {
                        	employerName: $$utility.getString($$mapping.getMappingItem(empDiscMappings, empDiscContainer, "input", $$empDiscKeys.employerName)[0].control.val()),
                        	natureTerm: $$utility.getString($$mapping.getMappingItem(empDiscMappings, empDiscContainer, "list", $$empDiscKeys.natureTerm)[0].control.val()),
                        	termMonth: $$utility.getString($$mapping.getMappingItem(empDiscMappings, empDiscContainer, "list", $$empDiscKeys.termMonth)[0].control.val()),
                        	termYear: $$utility.getString($$mapping.getMappingItem(empDiscMappings, empDiscContainer, "input", $$empDiscKeys.termYear)[0].control.val())
                    	}
                	}
            	}
        	}
    	},
    	//  DISCIPLINARY QUESTIONS
    	questions: {
        	data: {
            	defaultValue: ["L"]
        	},
        	validation: {
            	required: function (config) {
                	//  required to file
                	return ($(config.questions.astrisks).css("display") === "inline") &&
                       	(config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File);
            	}
        	}
    	},
    	//  EMPLOYMENT DISCLOSURE INFORMATION
    	empDiscDetails: {
        	messageControl: $("#center_column [id='employment_disclosure_container'] .panel-body .messages:first"),
        	containerId: "employment_disclosure_container",
        	containerPanelBody: $("#center_column [id='employment_disclosure_container'] .panel-body"),
        	astrisks: $("#center_column [id='employment_disclosure_container'] .astrisk"),
        	spinner: $("#center_column [id='employment_disclosure_container'] .spinner"),
        	editMode: false,
        	data: {
            	employerName: {
                	dbValue: null,
                	defaultValue: null
            	},
            	natureTerm: {
                	dbValue: null,
                	defaultValue: null
            	},
            	termMonth: {
                	dbValue: null,
                	defaultValue: null
            	},
            	termYear: {
                	dbValue: null,
                	defaultValue: null
            	}
        	},
        	//  control configurations
        	mappings: [
            	{ container: "employment_disclosure_container", category: "input", key: "EMPLOYER_NAME", control: $("#center_column [id='employment_disclosure_container'] [id='empdisc_employer_name']") },
            	{ container: "employment_disclosure_container", category: "list", key: "NATURE_TERM", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='employment_disclosure_container'] [id='empdisc_nature_termination']"), typeCode: "DMP_TERMINATION", errorSectionCode: "NATURE OF TERMINATION" },
            	{ container: "employment_disclosure_container", category: "list", key: "TERM_MONTH", value: "VALUE_COLUMN", text: "TEXT_COLUMN", control: $("#center_column [id='employment_disclosure_container'] [id='empdisc_term_month']") },
            	{ container: "employment_disclosure_container", category: "input", key: "TERM_YEAR", control: $("#center_column [id='employment_disclosure_container'] [id='empdisc_term_year']") }
        	],
        	//  lookup keys for the mappings array
        	keys: {
            	employerName: "EMPLOYER_NAME",
            	natureTerm: "NATURE_TERM",
            	termMonth: "TERM_MONTH",
            	termYear: "TERM_YEAR"
        	}
    	},
    	//  COMMENTS SECTION
    	comments: {
        	validation: {
            	required: function (config) {
                	//  required to file the DMP
                	return ($(config.questions.astrisks).css("display") === "inline") &&
                       	(config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File)
            	}
        	}
    	},
    	//  SUPPORTING DOCUMENTATION SECTION
    	supportDocs: {
        	data: {
            	description: "You may provide COMPANY with documentation supporting this disclosure."
        	}
    	}
	};
	// main page object
	var page = function (config) {
    	return {
        	init: function (callback) {
            	if (config.data.initialLoad) {
                	this.bind();
                	this.getData();
            	} else {
                	this.reinit();
            	}
        	},
        	reinit: function (callback) {
            	//  remove any previous validation errapp from the page
            	$(config.page.centerColumn.find("." + config.validation.ERROR_CLASS)).remove();
            	$.bg.web.app.dmp.disciplinary.questions.ui.register(config);
            	$.bg.web.app.dmp.disciplinary.questions.ui.init();
            	$.bg.web.app.dmp.employment.disclosure.ui.register(config);
            	$.bg.web.app.dmp.employment.disclosure.ui.init();
            	$.bg.web.app.dmp.comments.ui.register(config);
            	$.bg.web.app.dmp.comments.ui.init();
            	$.bg.web.app.dmp.support.docs.ui.register(config);
            	$.bg.web.app.dmp.support.docs.ui.init();
            	//  if none of these buttons were clicked, then we want to init the pagebuttons ui
            	if (!config.page.centerColumn.attr("data-button-clicked")) {
                	$.bg.web.app.dmp.pagebuttons.ui.register(config);
                	$.bg.web.app.dmp.pagebuttons.ui.init();
            	} else {
                	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                    	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                    	if (config.references.utility.callbackExists(callback)) {
                        	callback();
                    	}
                	}
            	}

        	},
        	bind: function () {
            	if (!config.page.centerColumn.attr("page-data-bind")) {
                	//  event handler that updates page's dirty data indicator
                	config.page.centerColumn.off(config.page.data.eventHandler.REFRESH_PAGE).on(config.page.data.eventHandler.REFRESH_PAGE, function (e, sourceConfig) {
                    	//  merge configs now that updates were applied from the button ui
                    	$.extend(true, config, sourceConfig);
                    	//  reinit the page to validate before saving and issue callback to button ui save/file handler when done
                    	page(config).reinit(sourceConfig.page.data.eventHandler.onPageRefreshCallback);
                	});
                	//  set databind flag so we don't rebind
                	config.page.centerColumn.attr("page-data-bind", true);
            	}
        	},
        	getData: function () {
            	var $messageControl = config.page.message.pageMessage;
            	var $this = this;
            	this.pageDescription.init();
            	//  adding a DMP     	
            	if (config.addMode) {
                	config.page.message.buttonActionDescription.html(config.page.data.buttonDescription.newDMP);
                	config.data.nameHandler.getFullName(config.token, config.page.info.targetCUSTOMERID, function (response) {
                    	try {
                        	//  validate the response object
                        	if (!response || !response.result || !response.result.result) {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "ENTITY INFO").replace(/{{CODE}}/, 1);
                        	}
                        	config.entity.data.id = config.page.info.targetCUSTOMERID;
                        	config.entity.data.name = response.result.result;
                        	$this.entityInfo.init();
                        	config.data.initialLoad = false;
                        	$this.init();
                    	} catch (ex) {
                        	config.references.utility.displayPageMessage(
                            	ex,
                            	config.references.globals.alerts.DANGER.klass,
                            	config.references.globals.alerts.DANGER.color,
                            	false,
                            	$messageControl.empty().selector,
                            	null
                        	);
                        	$("#center_column [id='main_content']").remove();
                    	}
                	});
            	} else {
                	config.page.message.buttonActionDescription.html(config.page.data.buttonDescription.amendingDMP);
                	//  editing or viewing a DMP
                	config.data.dmpHandler.getDMPInfo(config.token, config.page.info.dmpNumber, config.page.info.dmpNumberVersion, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	var prop = result.result;
                                    	//  initialize the entity information block
                                    	config.entity.data.id = prop.entityID;
                                    	config.entity.data.name = prop.entityName;
                                    	$this.entityInfo.init();
                                    	var $$utility = config.references.utility;
                                    	$.each(prop.rows, function (index, row) {
                                        	//  set matter name
                                        	config.page.data.matterName = $$utility.getString(row.MATTER_NAME);
                                        	var $$empDiscDetailsData = config.empDiscDetails.data;
                                        	$$empDiscDetailsData.employerName.dbValue = $$utility.getString(row.EMPLOYER_NAME);
                                        	$$empDiscDetailsData.natureTerm.dbValue = $$utility.getString(row.TERMINATION_CODE);
                                        	$$empDiscDetailsData.termMonth.dbValue = $$utility.getString(row.TERMINATION_MONTH);
                                        	$$empDiscDetailsData.termYear.dbValue = $$utility.getString(row.TERMINATION_YEAR);
                                        	//  comments section
                                        	config.comments.data.dbValue = $$utility.getString(row.COMMENT_TEXT);
                                        	config.data.initialLoad = false;
                                        	$this.reinit();
                                    	});
                                    	if (config.page.data.showRawData) {
                                        	//TODO: TEMPORARY, SHOW THE RAW DATA
                                        	setTimeout(function () {
                                            	$("#json_dump").empty().append(config.references.utility.data.jsonSyntaxHighlight(result)).slideDown();
                                        	}, config.timeoutDelay);
                                    	}
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CRIMINAL").replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CRIMINAL DMP").replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CRIMINAL DMP").replace(/{{CODE}}/, 3);
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
                        	$("#center_column [id='main_content']").remove();
                    	}
                	});
            	}

        	},
        	entityInfo: {
            	init: function () {
                	//  set the entity name and show it
                	config.entity.control
                    	.html(config.entity.template.replace(/{{ENTITY_ID}}/, config.entity.data.id).replace(/{{ENTITY_NAME}}/, config.entity.data.name))
                    	.slideDown();
            	}
        	},
        	pageDescription: {
            	init: function () {
                	//  set page heading
                	config.page.message.pageHeading.text(config.page.info.pageHeading);
                	//  set page description section
                	config.page.message.pageDescription.html(config.page.data.description[config.page.info.dmpType.toLowerCase()]);
                	config.page.sectionContainer.slideDown();
            	}
        	}
    	}
	};
	
	//  public API for page UI
	$.bg.web.app.dmp.employment.ui = {
    	register: function (context) {
        	//  merge globals into locals
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	//  hide this section as it doesn't apply to employment
        	localConfig.hideSection(localConfig.disclosure);
        	//  intialize the page UI elements
        	page(localConfig).init();
    	}
	};
	
})(jQuery);
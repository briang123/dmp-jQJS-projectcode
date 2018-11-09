(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.financialj === undefined) $.bg.web.app.dmp.financialj = {};
	var localConfig = {
    	//NOTE: GLOBAL PROPERTY VALUES WILL BE MERGED INTO THIS OBJECT AND USED FOR DMP PAGE THIS UI IS FOR
    	//  CURRENT PAGE UI INFORMATION
    	page: {
        	info: {
            	entityType: $.bg.web.app.dmp.ui.globals.page.info.entityTypes.INDIVIDUAL,
            	dmpType: $.bg.web.app.dmp.ui.globals.page.info.dmpTypes.FINANCIALJ,
            	pageHeading: $.bg.web.app.dmp.ui.globals.page.info.pageHeadingTemplate.replace("{{TYPE}}", "Individual Financial J")
        	},
        	data: {
            	financialjSaveObject: function (config) {
                	var $$mapping = config.references.utility.mapping;
                	var $$utility = config.references.utility;
                	var $$caseInfoDetails = config.caseInfoDetails;
                	var caseInfoMappings = $$caseInfoDetails.mappings;
                	var caseInfoContainer = $$caseInfoDetails.containerId;
                	var $$caseInfoKeys = $$caseInfoDetails.keys;
                	var actionTypeMappingObject = $$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.actionType)[0];
                	return {
                    	caseInfo: {
                        	actionType: $$utility.data.getSelectedItems(
                            	$(actionTypeMappingObject.control.selector + "[name='" + actionTypeMappingObject.controlGroupName + "']:checked"),
                            	actionTypeMappingObject.controlType),
                        	actionFiled: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.actionFiled)[0].control.val()),
                        	actionFiledOther: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.actionFiledOther)[0].control.val()),
                        	caseNumber: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.caseNumber)[0].control.val()),
                        	awardMatterMonth: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.awardMatterMonth)[0].control.val()),
                        	awardMatterYear: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.awardMatterYear)[0].control.val())
                    	}
                	}
            	}
        	}
    	},
    	//  DISCIPLINARY QUESTIONS
    	questions: {
        	data: {
            	defaultValue: ["J"]
        	},
        	validation: {
            	required: function (config) {
                	return ($(config.questions.astrisks).css("display") === "inline") &&
                       	(config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File);
            	}
        	}
    	},
    	//  CASE INFORMATION
    	caseInfoDetails: {
        	messageControl: $("#center_column [id='financialj_case_information_container'] .panel-body .messages:first"),
        	containerId: "financialj_case_information_container",
        	containerPanelBody: $("#center_column [id='financialj_case_information_container'] .panel-body"),
        	astrisks: $("#center_column [id='financialj_case_information_container'] .astrisk"),
        	spinner: $("#center_column [id='financialj_case_information_container'] .spinner"),
        	editMode: false,
        	data: {
            	actionType: {
                	dbValue: null,
                	defaultValue: null
            	},
            	actionFiled: {
                	dbValue: null,
                	defaultValue: null
            	},
            	actionFiledOther: {
                	dbValue: null,
                	defaultValue: null
            	},
            	caseNumber: {
                	dbValue: null,
                	defaultValue: null
            	},
            	awardMatterMonth: {
                	dbValue: null,
                	defaultValue: null
            	},
            	awardMatterYear: {
                	dbValue: null,
                	defaultValue: null
            	}
        	},
        	//  control configurations
        	mappings: [
            	{ container: "financialj_case_information_container", category: "list", key: "ACTION_TYPE", controlContainer: $("#center_column [id='financialj_case_information_container'] [id='caseinfo_actiontype_container']"), control: $("#center_column [id='financialj_case_information_container'] [id='caseinfo_actiontype_container'] :radio"), controlType: "radio", controlGroupName: "action_type", "orientation": "vertical", typeCode: "DMP_ACTION", errorSectionCode: "ACTION TYPE" },
            	{ container: "financialj_case_information_container", category: "list", key: "ACTION_FILED_WITH", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='financialj_case_information_container'] [id='caseinfo_action_filed']"), typeCode: "DMP_ACTION_WITH", errorSectionCode: "ACTION FILED" },
            	{ container: "financialj_case_information_container", category: "input", key: "ACTION_FILED_WITH_OTHER", control: $("#center_column [id='financialj_case_information_container'] [id='caseinfo_action_filed_other']") },
            	{ container: "financialj_case_information_container", category: "input", key: "CASE_NUMBER", control: $("#center_column [id='financialj_case_information_container'] [id='caseinfo_case_number']") },
            	{ container: "financialj_case_information_container", category: "list", key: "MONTH", value: "VALUE_COLUMN", text: "TEXT_COLUMN", control: $("#center_column [id='financialj_case_information_container'] [id='caseinfo_award_matter_month']"), errorSectionCode: "MONTH" },
            	{ container: "financialj_case_information_container", category: "input", key: "YEAR", control: $("#center_column [id='financialj_case_information_container'] [id='caseinfo_award_matter_year']") },
        	],
        	//  lookup keys for the mappings array
        	keys: {
            	actionType: "ACTION_TYPE",
            	actionFiled: "ACTION_FILED_WITH",
            	actionFiledOther: "ACTION_FILED_WITH_OTHER",
            	caseNumber: "CASE_NUMBER",
            	awardMatterMonth: "MONTH",
            	awardMatterYear: "YEAR"
        	}
    	},
    	//  COMMENTS SECTION
    	comments: {
        	validation: {
            	required: function (config) {
                	return false;
            	}
        	}
    	},
    	//  SUPPORTING DOCUMENTATION SECTION
    	supportDocs: {
        	data: {
            	description: "For actions taken by agencies other than the CFTC or COMPANY, you must provide COMPANY with supporting documentation if not previously submitted. This includes the final order or judgment."
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
            	$.bg.web.app.dmp.financialj.caseinfo.ui.register(config);
            	$.bg.web.app.dmp.financialj.caseinfo.ui.init();
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
                                        	//  case information section
                                        	var $$caseInfoData = config.caseInfoDetails.data;
                                        	$$caseInfoData.actionType.dbValue = $$utility.getString(row.ACTION_CODE);
                                        	$$caseInfoData.actionFiled.dbValue = $$utility.getString(row.ACTION_FILED_WITH_CODE);
                                        	$$caseInfoData.actionFiledOther.dbValue = $$utility.getString(row.ACTION_FILED_WITH_OTHER);
                                        	$$caseInfoData.caseNumber.dbValue = $$utility.getString(row.CASE_NUMBER);
                                        	$$caseInfoData.awardMatterMonth.dbValue = $$utility.getString(row.AWARD_CFTC_MATTER_MONTH);
                                        	$$caseInfoData.awardMatterYear.dbValue = $$utility.getString(row.AWARD_CFTC_MATTER_YEAR);
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
                	config.page.message.pageDescription.html(config.page.data.description[config.page.info.dmpType.toLowerCase().replace(" ", "")]);
                	config.page.sectionContainer.slideDown();
            	}
        	}
    	}
	};
	//  public API for page UI
	$.bg.web.app.dmp.financialj.ui = {
    	register: function (context) {
        	//  merge globals into locals
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	localConfig.hideSection(localConfig.disclosure);
        	//  intialize the page UI elements
        	page(localConfig).init();
    	}
	};
})(jQuery);
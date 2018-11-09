(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.financialk === undefined) $.bg.web.app.dmp.financialk = {};
	
	var localConfig = {
    	//NOTE: GLOBAL PROPERTY VALUES WILL BE MERGED INTO THIS OBJECT AND USED FOR DMP PAGE THIS UI IS FOR
    	//  CURRENT PAGE UI INFORMATION
    	page: {
        	info: {
            	entityType: $.bg.web.app.dmp.ui.globals.page.info.entityTypes.INDIVIDUAL,
            	dmpType: $.bg.web.app.dmp.ui.globals.page.info.dmpTypes.FINANCIALK,
            	pageHeading: $.bg.web.app.dmp.ui.globals.page.info.pageHeadingTemplate.replace("{{TYPE}}", "Individual Financial K")
        	},
        	data: {
            	financialkSaveObject: function (config) {
                	var $$mapping = config.references.utility.mapping;
                	var $$utility = config.references.utility;
                	var $$caseInfoDetails = config.caseInfoDetails;
                	var caseInfoMappings = $$caseInfoDetails.mappings;
                	var caseInfoContainer = $$caseInfoDetails.containerId;
                	var $$caseInfoKeys = $$caseInfoDetails.keys;
                	return {
                    	caseInfo: {
                        	bankruptcyCourtLocation: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.bankruptcyCourtLocation)[0].control.val()),
                        	bankruptcyCaseNumber: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.bankruptcyCaseNumber)[0].control.val()),
                        	adversaryCourtFiled: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.adversaryCourtFiled)[0].control.val()),
                        	adversaryCourtLocation: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.adversaryCourtLocation)[0].control.val()),
                        	adversaryCaseNumber: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.adversaryCaseNumber)[0].control.val()),
                        	adversaryActionStatus: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.adversaryActionStatus)[0].control.val()),
                        	adversaryActionFinalDisposition: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.adversaryActionFinalDisposition)[0].control.val()),
                        	adversaryActionFinalDispositionOther: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.adversaryActionFinalDispositionOther)[0].control.val()),
                        	adversaryMonth: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.adversaryMonth)[0].control.val()),
                        	adversaryYear: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.adversaryYear)[0].control.val())
                    	}
                	}
            	}
        	}
    	},
    	//  DISCIPLINARY QUESTIONS
    	questions: {
        	data: {
            	defaultValue: ["K"]
        	},
        	validation: {
            	required: function (config) {
                	//  if personally named checked, and question k is checked, then required to file; otherwise, optional
                	return ($(config.questions.astrisks).css("display") === "inline") &&
                       	($(config.disclosure.personallyNamedCheckedSelector).length > 0) &&
                       	(config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File);
            	}
        	}
    	},
    	//  CASE INFORMATION
    	caseInfoDetails: {
        	messageControl: $("#center_column [id='financialk_case_information_container'] .panel-body .messages:first"),
        	bankruptcyMessageControl: $("#center_column [id='caseinfo_bankruptcy_messages']"),
        	adversaryMessageControl: $("#center_column [id='caseinfo_adversary_messages']"),
        	containerId: "financialk_case_information_container",
        	containerPanelBody: $("#center_column [id='financialk_case_information_container'] .panel-body"),
        	astrisks: $("#center_column [id='financialk_case_information_container'] .astrisk"),
        	spinner: $("#center_column [id='financialk_case_information_container'] .spinner"),
        	editMode: false,
        	data: {
            	bankruptcyCourtLocation: {
                	dbValue: null,
                	defaultValue: null
            	},
            	bankruptcyCaseNumber: {
                	dbValue: null,
                	defaultValue: null
            	},
            	adversaryCourtFiled: {
                	dbValue: null,
                	defaultValue: null
            	},
            	adversaryCourtLocation: {
                	dbValue: null,
                	defaultValue: null
            	},
            	adversaryCaseNumber: {
                	dbValue: null,
                	defaultValue: null
            	},
            	adversaryActionStatus: {
                	dbValue: null,
                	defaultValue: null
            	},
            	adversaryActionFinalDisposition: {
                	dbValue: null,
                	defaultValue: null
            	},
            	adversaryActionFinalDispositionOther: {
                	dbValue: null,
                	defaultValue: null
            	},
            	adversaryMonth: {
                	dbValue: null,
                	defaultValue: null
            	},
            	adversaryYear: {
                	dbValue: null,
                	defaultValue: null
            	}
        	},
        	//  control configurations
        	mappings: [
            	{ container: "financialk_case_information_container", category: "input", key: "BANKRUPTCY_COURT_LOCATION", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_bankrupty_court_location']") },
            	{ container: "financialk_case_information_container", category: "input", key: "BANKRUPTCY_CASE_NUMBER", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_bankruptcy_case_number']") },
            	{ container: "financialk_case_information_container", category: "list", key: "ADVERSARY_COURT_FILED", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_adversary_court_filed']"), typeCode: "DMP_ADVERSARY_FILED", errorSectionCode: "ADVERSARY COURT FILED" },
            	{ container: "financialk_case_information_container", category: "input", key: "ADVERSARY_COURT_LOCATION", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_adversary_court_location']") },
            	{ container: "financialk_case_information_container", category: "input", key: "ADVERSARY_CASE_NUMBER", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_adversary_case_number']") },
            	{ container: "financialk_case_information_container", category: "list", key: "ADVERSARY_ACTION_STATUS", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_adversary_action_status']"), typeCode: "DMP_CASE_STATUS", triggerShowOnChangeValue: "ONAPP", errorSectionCode: "ADVERSARY ACTION STATUS" },
            	{ container: "financialk_case_information_container", category: "list", key: "ADVERSARY_ACTION_FIN_DISP", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_adversary_action_final_disposition']"), typeCode: "DMP_ADVERSARY_DISP", errorSectionCode: "ADVERSARY ACTION FINAL DISPOSITION" },
            	{ container: "financialk_case_information_container", category: "input", key: "ADVERSARY_ACTION_FIN_DISP_OTHER", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_adversary_action_final_disposition_other']") },
            	{ container: "financialk_case_information_container", category: "list", key: "ADVERSARY_MONTH", value: "VALUE_COLUMN", text: "TEXT_COLUMN", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_adversary_filing_month']") },
            	{ container: "financialk_case_information_container", category: "input", key: "ADVERSARY_YEAR", control: $("#center_column [id='financialk_case_information_container'] [id='caseinfo_adversary_filing_year']") }
        	],
        	//  lookup keys for the mappings array
        	keys: {
            	bankruptcyCourtLocation: "BANKRUPTCY_COURT_LOCATION",
            	bankruptcyCaseNumber: "BANKRUPTCY_CASE_NUMBER",
            	adversaryCourtFiled: "ADVERSARY_COURT_FILED",
            	adversaryCourtLocation: "ADVERSARY_COURT_LOCATION",
            	adversaryCaseNumber: "ADVERSARY_CASE_NUMBER",
            	adversaryActionStatus: "ADVERSARY_ACTION_STATUS",
            	adversaryActionFinalDisposition: "ADVERSARY_ACTION_FIN_DISP",
            	adversaryActionFinalDispositionOther: "ADVERSARY_ACTION_FIN_DISP_OTHER",
            	adversaryMonth: "ADVERSARY_MONTH",
            	adversaryYear: "ADVERSARY_YEAR"
        	}
    	},
    	//  COMMENTS SECTION
    	comments: {
        	validation: {
            	required: function (config) {
                	//  if action taken checked, then required to file, but not to save
                	return (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) &&
                        	($(config.disclosure.actionTakenPrincipalCheckedSelector).length > 0);
            	}
        	}
    	},
    	//  SUPPORTING DOCUMENTATION SECTION
    	supportDocs: {
        	data: {
            	description: "You must provide COMPANY with supporting documentation if not previously submitted. This includes the initial complaint and the final disposition for each adversary action."
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
            	$.bg.web.app.dmp.disclosure.basis.ui.register(config);
            	$.bg.web.app.dmp.disclosure.basis.ui.init();
            	$.bg.web.app.dmp.financialk.caseinfo.ui.register(config);
            	$.bg.web.app.dmp.financialk.caseinfo.ui.init();
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
                                        	//  basis for disclosure section
                                        	config.disclosure.data.dbValue = row.disclosure || [];
                                        	//  case information section
                                        	var $$caseInfoData = config.caseInfoDetails.data;
                                        	$$caseInfoData.filingMonths.dbValue = $$utility.getString(row.CRIMINAL_CHARGE_FILED_MONTH);
                                        	$$caseInfoData.filingYear.dbValue = $$utility.getString(row.CRIMINAL_CHARGE_FILED_YEAR);
                                        	$$caseInfoData.filingLocation.dbValue = $$utility.getString(row.CHARGE_FILED_IN_CODE);
                                        	$$caseInfoData.filingLocationOther.dbValue = $$utility.getString(row.CHARGED_FILED_IN_OTHER);
                                        	$$caseInfoData.courtName.dbValue = $$utility.getString(row.COURT_NAME);
                                        	$$caseInfoData.cityCounty.dbValue = $$utility.getString(row.COURT_CITY_COUNTY);
                                        	$$caseInfoData.states.dbValue = $$utility.getString(row.COURT_STATE_CODE);
                                        	$$caseInfoData.countries.dbValue = $$utility.getString(row.COURT_COUNTRY_CODE);
                                        	$$caseInfoData.caseNumber.dbValue = $$utility.getString(row.CASE_NUMBER);
                                        	$$caseInfoData.caseStatus.dbValue = $$utility.getString(row.CASE_STATUS_CODE);
											
                                        	//  comments section
                                        	config.comments.data.dbValue = $$utility.getString(row.COMMENT_TEXT);
                                        	config.data.initialLoad = false;
                                        	$this.reinit();

                                        	config.page.info.sectionText = $$utility.getString(row.SECTION_TEXT);
                                        	config.page.info.filedDate = row.FILED_DATE;
                                        	config.page.info.statusCode = $$utility.getString(row.STATUS_CODE);

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
	$.bg.web.app.dmp.financialk.ui = {
    	register: function (context) {
        	//  merge globals into locals
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	//  intialize the page UI elements
        	page(localConfig).init();
    	}
	};
})(jQuery);

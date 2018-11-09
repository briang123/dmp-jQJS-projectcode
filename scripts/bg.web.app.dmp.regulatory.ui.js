(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.regulatory === undefined) $.bg.web.app.dmp.regulatory = {};
	
	var localConfig = {
    	//NOTE: GLOBAL PROPERTY VALUES WILL BE MERGED INTO THIS OBJECT AND USED FOR DMP PAGE THIS UI IS FOR
    	//  CURRENT PAGE UI INFORMATION
    	page: {
        	info: {
            	entityType: $.bg.web.app.dmp.ui.globals.page.info.entityTypes.INDIVIDUAL,
            	dmpType: $.bg.web.app.dmp.ui.globals.page.info.dmpTypes.REGULATORY,
            	pageHeading: $.bg.web.app.dmp.ui.globals.page.info.pageHeadingTemplate.replace("{{TYPE}}", "Individual Regulatory")
        	},
        	data: {
            	regulatorySaveObject: function (config) {
                	var $$mapping = config.references.utility.mapping;
                	var $$utility = config.references.utility;
                	var $$caseInfo = config.caseInfoDetails;
                	var caseInfoMappings = $$caseInfo.mappings;
                	var caseInfoContainer = $$caseInfo.containerId;
                	var $$caseInfoKeys = $$caseInfo.keys;
                	return {
                    	caseinfo: {
                        	regCivilAction: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.regCivilAction)[0].control.val()),
                        	regCivilActionOther: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.regCivilActionOther)[0].control.val()),
                        	caseNumber: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.caseNumber)[0].control.val()),
                        	caseStatus: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.caseStatus)[0].control.val()),
                        	onAppealActionAppeal: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.onAppealActionAppeal)[0].control.val()),
                        	onAppealActionAppealOther: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.onAppealActionAppealOther)[0].control.val()),
                        	onAppealLimitsRestrictions: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.onAppealLimitsRestrictions)[0].control.val()),
                        	onAppealLimitsRestrictionDetails: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.onAppealLimitsRestrictionDetails)[0].control.val()),
                        	filingMonth: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.filingMonth)[0].control.val()),
                        	filingYear: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.filingYear)[0].control.val()),
                        	sanctionsImposed: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.sanctionsImposed)[0].control.val()).split(","),
                        	sanctionsImposedOther: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.sanctionsImposedOther)[0].control.val())
                    	}
                	}
            	}
        	}
    	},
    	//  DISCIPLINARY QUESTIONS SECTION
    	questions: {
        	validation: {
            	required: function (config) {
                	//  if required to file and personally named is checked, then required
                	return ($(config.questions.astrisks).css("display") === "inline") &&
                       	($(config.disclosure.personallyNamedCheckedSelector).length > 0) &&
                       	(config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File);
            	}
        	}
    	},
    	//  CASE INFORMATION
    	caseInfoDetails: {
        	messageControl: $("#center_column [id='regulatory_case_information_container'] .panel-body .messages:first"),
        	regulatoryMessageControl: $("#center_column [id='regulatory_case_information_container'] [id='case_info_regulatory_well_messages']"),
        	caseInfoMessageControl: $("#center_column [id='regulatory_case_information_container'] [id='case_info_well_messages']"),
        	containerId: "regulatory_case_information_container",
        	onAppealDetailsContainer: $("#center_column [id='regulatory_case_information_container'] [id='on_appeal_details_container']"),
        	containerPanelBody: $("#center_column [id='regulatory_case_information_container'] .panel-body"),
        	astrisks: $("#center_column [id='regulatory_case_information_container'] .astrisk"),
        	doubleAstrisks: $("#center_column [id='regulatory_case_information_container'] .double-astrisk"),
        	spinner: $("#center_column [id='regulatory_case_information_container'] .spinner"),
        	editMode: false,
        	data: {
            	regCivilAction: {
                	dbValue: null,
                	defaultValue: null
            	},
            	regCivilActionOther: {
                	dbValue: null,
                	defaultValue: null
            	},
            	caseNumber: {
                	dbValue: null,
                	defaultValue: null
            	},
            	caseStatus: {
                	dbValue: "",
                	defaultValue: null
            	},
            	onAppealActionAppeal: {
                	dbValue: "",
                	defaultValue: null
            	},
            	onAppealActionAppealOther: {
                	dbValue: "",
                	defaultValue: null
            	},
            	onAppealLimitsRestrictions: {
                	dbValue: "",
                	defaultValue: null
            	},
            	onAppealLimitsRestrictionDetails: {
                	dbValue: "",
                	defaultValue: null
            	},
            	filingMonth: {
                	dbValue: null,
                	defaultValue: null
            	},
            	filingYear: {
                	dbValue: null,
                	defaultValue: null
            	},
            	sanctionsImposed: {
                	dbValue: null,
                	defaultValue: null
            	},
            	sanctionsImposedOther: {
                	dbValue: null,
                	defaultValue: null
            	}
        	},
        	//  control configurations
        	mappings: [
            	{ container: "regulatory_case_information_container", category: "list", key: "REG_CIVIL_ACTION", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='regulatory_case_information_container'] [id='caseinfo_regulatory_regcivil_action']"), typeCode: "DMP_ACTION_INIT_BY", triggerHideOnChangeValue: [null, "SEC", "FINRA"], errorSectionCode: "REGULATORY CIVIL ACTION" },
            	{ container: "regulatory_case_information_container", category: "input", key: "REG_CIVIL_ACTION_OTHER", control: $("#center_column [id='regulatory_case_information_container'] [id='caseinfo_regulatory_regcivil_action_other']") },
            	{ container: "regulatory_case_information_container", category: "input", key: "CASE_NUMBER", control: $("#center_column [id='regulatory_case_information_container'] [id='caseinfo_case_number']") },
            	{ container: "regulatory_case_information_container", category: "list", key: "CASE_STATUS", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='regulatory_case_information_container'] [id='caseinfo_case_status']"), typeCode: "DMP_CASE_STATUS", triggerShowOnChange: { value: "ONAPP", container: $("#center_column [id='regulatory_case_information_container'] [id='on_appeal_details_container']") }, triggerDateLabelOnChange: { control: $("#center_column [id='regulatory_case_information_container'] [id='date_container']"), label: $("#center_column [id='regulatory_case_information_container'] [id='date_label']"), data: { "ONAPP": "Date Appeal Filed", "PEND": "Date Initiated", "FINAL": "Date Resolved"} }, errorSectionCode: "CASE STATUS" },
            	{ container: "regulatory_case_information_container", category: "list", key: "ON_APPEAL_ACTION_APPEAL", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='regulatory_case_information_container'] [id='on_appeal_details_container'] [id='caseinfo_action_appealed_to']"), typeCode: "DMP_ACTION_APPEAL_TO", triggerHideOnChangeValue: [null, "SEC", "FINRA"], errorSectionCode: "ACTION APPEALED" },
            	{ container: "regulatory_case_information_container", category: "input", key: "ON_APPEAL_ACTION_APPEAL_OTHER", control: $("#center_column [id='regulatory_case_information_container'] [id='on_appeal_details_container'] [id='caseinfo_action_appealed_to_other']") },
            	{ container: "regulatory_case_information_container", category: "list", key: "ON_APPEAL_LIMITS_REST", value: "VALUE_COLUMN", text: "TEXT_COLUMN", control: $("#center_column [id='regulatory_case_information_container'] [id='on_appeal_details_container'] [id='case_info_on_appeal_limits_restrictions']"), triggerShowOnChange: { value: "Y", container: $("#center_column [id='regulatory_case_information_container'] [id='case_info_on_appeal_limits_restrictions_details_container']") }, errorSectionCode: "APPEAL LIMITS OR RESTRICTIONS" },
            	{ container: "regulatory_case_information_container", category: "input", key: "ON_APPEAL_LIMIT_REST_DETAILS", control: $("#center_column [id='regulatory_case_information_container'] [id='on_appeal_details_container'] [id='case_info_on_appeal_limits_restrictions_details']"), readOnlyControl: $("#center_column [id='regulatory_case_information_container'] [id='on_appeal_details_container'] [id='case_info_on_appeal_limits_restrictions_details_readonly']"), charNum: $("#center_column [id='regulatory_case_information_container'] [id='on_appeal_details_container'] [id='case_info_on_appeal_limits_restrictions_details_charNum']") },
            	{ container: "regulatory_case_information_container", category: "list", key: "FILING_MONTH", value: "VALUE_COLUMN", text: "TEXT_COLUMN", control: $("#center_column [id='regulatory_case_information_container'] [id='caseinfo_filing_month']"), errorSectionCode: "MONTHS" },
            	{ container: "regulatory_case_information_container", category: "input", key: "FILING_YEAR", control: $("#center_column [id='regulatory_case_information_container'] [id='caseinfo_filing_year']") },
            	{ container: "regulatory_case_information_container", category: "list", key: "SANCTIONS_IMPOSED", value: "CODE", text: "DESCRIPTION", control: $("#center_column [id='regulatory_case_information_container'] [id='caseinfo_sanctions_imposed']"), typeCode: "DMP_SANCTION", requiredCaseStatusValue: "FINAL", errorSectionCode: "SANCTIONS IMPOSED" },
            	{ container: "regulatory_case_information_container", category: "input", key: "SANCTIONS_IMPOSED_OTHER", control: $("#center_column [id='regulatory_case_information_container'] [id='caseinfo_sanctions_imposed_other']") }
        	],
        	//  lookup keys for the mappings array
        	keys: {
            	regCivilAction: "REG_CIVIL_ACTION",
            	regCivilActionOther: "REG_CIVIL_ACTION_OTHER",
            	caseNumber: "CASE_NUMBER",
            	caseStatus: "CASE_STATUS",
            	onAppealActionAppeal: "ON_APPEAL_ACTION_APPEAL",
            	onAppealActionAppealOther: "ON_APPEAL_ACTION_APPEAL_OTHER",
            	onAppealLimitsRestrictions: "ON_APPEAL_LIMITS_REST",
            	onAppealLimitsRestrictionDetails: "ON_APPEAL_LIMIT_REST_DETAILS",
            	filingMonth: "FILING_MONTH",
            	filingYear: "FILING_YEAR",
            	sanctionsImposed: "SANCTIONS_IMPOSED",
            	sanctionsImposedOther: "SANCTIONS_IMPOSED_OTHER"
        	}
    	},
    	//  COMMENTS SECTION
    	comments: {
        	validation: {
            	required: function (config) {
                	//  required if only the "action taken - principal" is checked
                	return ($(config.disclosure.actionTakenPrincipalCheckedSelector).length > 0) && ($(config.disclosure.personallyNamedCheckedSelector).length === 0);
            	}
        	}
    	},
    	//  SUPPORTING DOCUMENTATION SECTION
    	supportDocs: {
        	data: {
            	description: "You must provide COMPANY with supporting documentation if not previously submitted. This includes but is not limited to the complaint, settlement offer and final order/judgment."
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
            	$.bg.web.app.dmp.regulatory.caseinfo.ui.register(config);
            	$.bg.web.app.dmp.regulatory.caseinfo.ui.init();
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
                                        	$$caseInfoData.regCivilAction.dbValue = $$utility.getString(row.ACTION_INITIATED_BY_CODE);
                                        	$$caseInfoData.regCivilActionOther.dbValue = $$utility.getString(row.REGULATORY_BODY_NAME);
                                        	$$caseInfoData.caseNumber.dbValue = $$utility.getString(row.CASE_NUMBER);
                                        	$$caseInfoData.caseStatus.dbValue = $$utility.getString(row.CASE_STATUS_CODE);
                                        	$$caseInfoData.onAppealActionAppeal.dbValue = $$utility.getString(row.ACTION_APPEALED_TO_CODE);
                                        	$$caseInfoData.onAppealActionAppealOther.dbValue = $$utility.getString(row.ACTION_APPEALED_TO_NAME);
                                        	$$caseInfoData.onAppealLimitsRestrictions.dbValue = $$utility.getString(row.APPEAL_LIMITATIONS_IND);
                                        	$$caseInfoData.onAppealLimitsRestrictionDetails.dbValue = $$utility.getString(row.APPEAL_LIMITATIONS_DETAIL);
                                        	$$caseInfoData.filingMonth.dbValue = $$utility.getString(row.REGULATORY_STATUS_MONTH);
                                        	$$caseInfoData.filingYear.dbValue = $$utility.getString(row.REGULATORY_STATUS_YEAR);
                                        	$$caseInfoData.sanctionsImposed.dbValue = row.sanctionsImposed || [];
                                        	$$caseInfoData.sanctionsImposedOther.dbValue = $$utility.getString(row.sanctionsImposedOther);
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
	$.bg.web.app.dmp.regulatory.ui = {
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
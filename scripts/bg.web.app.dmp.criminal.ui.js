(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.criminal === undefined) $.bg.web.app.dmp.criminal = {};

	//  SEE BOTTOM OF PAGE FOR CRIMINAL NOTES
	var localConfig = {
    	//NOTE: GLOBAL PROPERTY VALUES WILL BE MERGED INTO THIS OBJECT AND USED FOR DMP PAGE THIS UI IS FOR
    	//  CURRENT PAGE UI INFORMATION
    	page: {
        	info: {
            	entityType: $.bg.web.app.dmp.ui.globals.page.info.entityTypes.INDIVIDUAL,
            	dmpType: $.bg.web.app.dmp.ui.globals.page.info.dmpTypes.CRIMINAL,
            	pageHeading: $.bg.web.app.dmp.ui.globals.page.info.pageHeadingTemplate.replace("{{TYPE}}", "Individual Criminal")
        	},
        	data: {
            	criminalSaveObject: function (config) {
                	var $$mapping = config.references.utility.mapping;
                	var $$utility = config.references.utility;
                	var $$caseInfo = config.caseInfoDetails;
                	var caseInfoMappings = $$caseInfo.mappings;
                	var caseInfoContainer = $$caseInfo.containerId;
                	var $$caseInfoKeys = $$caseInfo.keys;
                	return {
                    	caseinfo: {
                        	location: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.Location)[0].control.val()),
                        	otherLocation: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.OtherLocation)[0].control.val()),
                        	month: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.Months)[0].control.val()),
                        	year: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.Year)[0].control.val()),
                        	courtName: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.CourtName)[0].control.val()),
                        	cityCounty: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.CityCounty)[0].control.val()),
                        	state: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.States)[0].control.val()),
                        	country: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.Countries)[0].control.val()),
                        	caseNumber: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "input", $$caseInfoKeys.CaseNumber)[0].control.val()),
                        	status: $$utility.getString($$mapping.getMappingItem(caseInfoMappings, caseInfoContainer, "list", $$caseInfoKeys.Status)[0].control.val())
                    	},
                    	charges: config.chargeDetails.container.data("chargesData") || []
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
        	containerId: null,
        	messageControl: $("#center_column [id='criminal_case_information_container'] .panel-body .messages:first"),
        	containerId: "criminal_case_information_container",
        	containerPanelBody: $("#center_column [id='criminal_case_information_container'] .panel-body"),
        	astrisks: $("#center_column [id='criminal_case_information_container'] .astrisk"),
        	doubleAstrisks: $("#center_column [id='criminal_case_information_container'] .double-astrisk"),
        	spinner: $("#center_column [id='criminal_case_information_container'] .spinner"),
        	editMode: false,
        	data: {
            	filingMonths: {
                	dbValue: null,
                	defaultValue: null
            	},
            	filingYear: {
                	dbValue: null,
                	defaultValue: null
            	},
            	filingLocation: {
                	dbValue: null,
                	defaultValue: null,
                	typeCode: "DMP_CHARGE_FILED_IN"
            	},
            	filingLocationOther: {
                	dbValue: null,
                	defaultValue: null
            	},
            	courtName: {
                	dbValue: null,
                	defaultValue: null
            	},
            	cityCounty: {
                	dbValue: null,
                	defaultValue: null
            	},
            	states: {
                	dbValue: null,
                	defaultValue: null
            	},
            	countries: {
                	dbValue: null,
                	defaultValue: "US"
            	},
            	caseNumber: {
                	dbValue: null,
                	defaultValue: null
            	},
            	caseStatus: {
                	dbValue: null,
                	defaultValue: null,
                	typeCode: "DMP_CASE_STATUS"
            	}
        	},
        	//  control configurations
        	mappings: [
            	{ container: "criminal_case_information_container", category: "list", key: "FILING_MONTHS", value: "VALUE_COLUMN", text: "TEXT_COLUMN", id: "caseinfo_filing_month", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_filing_month']"), errorSectionCode: "MONTHS" },
            	{ container: "criminal_case_information_container", category: "list", key: "FILING_LOCATION", value: "CODE", text: "DESCRIPTION", id: "caseinfo_filing_location", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_filing_location']"), typeCode: "DMP_CHARGE_FILED_IN", errorSectionCode: "FILING LOCATION" },
            	{ container: "criminal_case_information_container", category: "list", key: "STATES", value: "US_STATE_CODE", text: "US_STATE_DESC", id: "caseinfo_state", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_state']"), errorSectionCode: "STATES" },
            	{ container: "criminal_case_information_container", category: "list", key: "COUNTRIES", value: "COUNTRY_CODE", text: "COUNTRY_DESC", id: "caseinfo_country", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_country']"), errorSectionCode: "COUNTRIES" },
            	{ container: "criminal_case_information_container", category: "list", key: "CASE_STATUS", value: "CODE", text: "DESCRIPTION", id: "caseinfo_case_status", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_case_status']"), typeCode: "DMP_CASE_STATUS", errorSectionCode: "CASE STATUS" },
            	{ container: "criminal_case_information_container", category: "input", key: "FILING_LOCATION_OTHER", id: "caseinfo_other_filing_location", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_other_filing_location']") },
            	{ container: "criminal_case_information_container", category: "input", key: "FILING_YEAR", id: "caseinfo_filing_year", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_filing_year']") },
            	{ container: "criminal_case_information_container", category: "input", key: "COURT_NAME", id: "caseinfo_courtname", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_courtname']") },
            	{ container: "criminal_case_information_container", category: "input", key: "CITY_COUNTY", id: "caseinfo_citycounty", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_citycounty']") },
            	{ container: "criminal_case_information_container", category: "input", key: "CASE_NUMBER", id: "caseinfo_case_number", control: $("#center_column [id='criminal_case_information_container'] [id='caseinfo_case_number']") }
        	],
        	//  lookup keys for the mappings array
        	keys: {
            	Months: "FILING_MONTHS",
            	Year: "FILING_YEAR",
            	Location: "FILING_LOCATION",
            	OtherLocation: "FILING_LOCATION_OTHER",
            	CourtName: "COURT_NAME",
            	CityCounty: "CITY_COUNTY",
            	States: "STATES",
            	Countries: "COUNTRIES",
            	CaseNumber: "CASE_NUMBER",
            	Status: "CASE_STATUS"
        	}
    	},
    	//  CRIMINAL CASE CHARGES
    	chargeDetails: {
        	modalId: "modal_charges",
        	containerId: "chargeDetails_container",         	//  id of container where DMP Summary grid for filed/saved DMPs resides
        	container: $("#center_column [id='chargeDetails_container']"),
        	containerPanelBody: $("#center_column [id='chargeDetails_container'] .panel-body"),
        	description: $("#center_column [id='chargeDetails_container'] [class='section-description']"),
        	astrisks: $("#center_column [id='chargeDetails_container'] .astrisk"),
        	spinner: $("#center_column [id='chargeDetails_container'] .spinner"),
        	editMode: false,                                	//  true/false - (false = add new; true = edit)
        	data: {
            	model: {
                	deletedRows: [],
                	rows: []
            	},
            	modal: {
                	classification: {
                    	rows: null
                	},
                	pleaEntered: {
                    	rows: null
                	},
                	disposition: {
                    	rows: null
                	}
            	}
        	},
        	table: {
            	messageControl: $("#center_column [id='chargeDetails_container'] [id='tblMessages_ChargeDetails']"),
            	id: "tblChargeDetails",                     	//  id of table
            	pageSize: -1,                               	//  default page size
            	initialLoad: true,                          	//  indicator of whether tab has been loaded
            	summaryPanelId: "charge-details-panel",     	//  summary panel id above table
            	link: {
                	href: "#",
                	target: ""
            	}
        	},
        	//  control configurations
        	mappings: {
            	table: [
                	{ container: "chargeDetails_container", category: "table", key: "FORMAL_CHARGE_DESC", ColumnName: "FORMAL_CHARGE_DESC", DisplayName: "Formal Charge Description", Visible: true, Sortable: false, width: "30%" },
                	{ container: "chargeDetails_container", category: "table", key: "CLASSIFICATION", ColumnName: "CLASSIFICATION", DisplayName: "Classification", Visible: true, Sortable: false, width: "20%" },
                	{ container: "chargeDetails_container", category: "table", key: "PLEA", ColumnName: "PLEA_ENTERED", DisplayName: "Plea Entered", Visible: true, Sortable: false, width: "20%" },
                	{ container: "chargeDetails_container", category: "table", key: "DISPOSITION", ColumnName: "DISPOSITION", DisplayName: "Disposition", Visible: true, Sortable: false, width: "20%" },
                	{ container: "chargeDetails_container", category: "table", key: "ACTIONS", ColumnName: "ACTIONS", DisplayName: "Action", Visible: true, ClassName: "dt-head-nowrap dt-body-center", Sortable: false, width: "10%" }
            	],
            	controls: [
                	{ container: "chargeDetails_container", category: "table", key: "TABLE", id: "tblChargeDetails", control: $("#center_column [id='chargeDetails_container'] [id='tblChargeDetails']") },
                	{ container: "chargeDetails_container", category: "button", key: "ADD", id: "btnAddCharge", control: $("#btnAddCharge") }, //control: $("#center_column [id='chargeDetails_container'] [id='btnAddCharge']") },
                	{container: "chargeDetails_container", category: "button", key: "EDIT", css: { "padding-right": "2px;" }, title: "Edit Charge", class: "btn btn-xs btn-primary btn-glyphicon-edit btn-glyphicon-nocaption readonly-setting btn-edit", text: "<span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span>" },
                	{ container: "chargeDetails_container", category: "button", key: "DELETE", css: { "padding-right": "2px;" }, title: "Delete Charge", class: "btn btn-xs btn-danger btn-glyphicon-nocaption readonly-setting btn-delete", text: "<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>" },
                	{ container: "modal_charges", category: "modal", key: "MODAL", id: "modal_charges", control: $("#center_column [id='modal_charges']") },
                	{ container: "modal_charges", category: "input", key: "MODAL_DESCRIPTION", id: "modal_charge_description", control: $("#center_column [id='modal_charges'] [id='modal_charge_description']") },
                	{ container: "modal_charges", category: "list", key: "MODAL_CLASSIFICATION", value: "CODE", text: "DESCRIPTION", id: "cboClassification_ChargesModal", control: $("#center_column [id='modal_charges'] [id='cboClassification_ChargesModal']"), typeCode: "DMP_CLASIFICATION", errorSectionCode: "CLASSIFICATION" },
                	{ container: "modal_charges", category: "list", key: "MODAL_PLEA", value: "CODE", text: "DESCRIPTION", id: "cboPleaEntered_ChargesModal", control: $("#center_column [id='modal_charges'] [id='cboPleaEntered_ChargesModal']"), typeCode: "DMP_PLEA_ENTERED", errorSectionCode: "PLEA ENTERED" },
                	{ container: "modal_charges", category: "list", key: "MODAL_DISPOSITION", value: "CODE", text: "DESCRIPTION", id: "cboDisposition_ChargesModal", control: $("#center_column [id='modal_charges'] [id='cboDisposition_ChargesModal']"), typeCode: "DMP_DISPOSITION", errorSectionCode: "DISPOSITION" },
                	{ container: "modal_charges", category: "input", key: "MODAL_CLASSIFICATION_OTHER", control: $("#center_column [id='modal_charges'] [id='cboClassification_ChargesModal']").closest("div").find(".other-input input:first") },
                	{ container: "modal_charges", category: "input", key: "MODAL_PLEA_OTHER", control: $("#center_column [id='modal_charges'] [id='cboPleaEntered_ChargesModal']").closest("div").find(".other-input input:first") },
                	{ container: "modal_charges", category: "input", key: "MODAL_DISPOSITION_OTHER", control: $("#center_column [id='modal_charges'] [id='cboDisposition_ChargesModal']").closest("div").find(".other-input input:first") },
                	{ container: "modal_charges", category: "button", key: "MODAL_SAVE", id: "btnSave_ChargesModal", control: $("#center_column [id='modal_charges'] [id='btnSave_ChargesModal']") },
                	{ container: "modal_charges", category: "button", key: "MODAL_CANCEL", id: "btnCancel_ChargesModal", control: $("#center_column [id='modal_charges'] [id='btnCancel_ChargesModal']") }
            	]
        	},
        	//  lookup keys for the mappings array
        	keys: {
            	table: {
                	Edit: "EDIT",
                	Delete: "DELETE",
                	FormalChargeDesc: "FORMAL_CHARGE_DESC",
                	Classification: "CLASSIFICATION",
                	Plea: "PLEA",
                	Disposition: "DISPOSITION",
                	Table: "TABLE"
            	},
            	modal: {
                	Modal: "MODAL",
                	AddCharge: "ADD",
                	Description: "MODAL_DESCRIPTION",
                	Classification: "MODAL_CLASSIFICATION",
                	ClassificationOther: "MODAL_CLASSIFICATION_OTHER",
                	PleaEntered: "MODAL_PLEA",
                	PleaEnteredOther: "MODAL_PLEA_OTHER",
                	Disposition: "MODAL_DISPOSITION",
                	DispositionOther: "MODAL_DISPOSITION_OTHER",
                	Save: "MODAL_SAVE",
                	Cancel: "MODAL_CANCEL"
            	}
        	},
        	validation: {
            	messages: {
                	CONFIRM_DELETE: "Are you sure you want to delete the charge '{{DESCRIPTION}}'?",
                	DELETE_SUCCESSFUL: "You successfully removed the charge '{{DESCRIPTION}}'.",
                	INSERT_SUCCESSFUL: "You successfully added charge '{{DESCRIPTION}}'.",
                	UPDATE_SUCCESSFUL: "You successfully updated the charge '{{DESCRIPTION}}'.",
                	INSERT_FAILED: "An error occurred while attempting to add charge '{{DESCRIPTION}}'.",
                	UPDATE_FAILED: "An error occurred while attempting to update the charge '{{DESCRIPTION}}'.",
                	DELETE_FAILED: "An error occurred while attempting to removed the charge '{{DESCRIPTION}}'.",
                	MODAL_FORM_INVALID: "The charges form is invalid. Please complete all fields before attempting to save the charge.",
                	CHARGE_EXISTS: "The charge '{{DESCRIPTION}}' already exists."
            	}
        	}
    	},
    	//  COMMENTS SECTION
    	comments: {
        	validation: {
            	required: function(config) {
                	//  required if only the "action taken - principal" is checked
                	return ($(config.disclosure.actionTakenPrincipalCheckedSelector).length > 0) && ($(config.disclosure.personallyNamedCheckedSelector).length === 0);
            	}
        	}
    	},
    	//  SUPPORTING DOCUMENTATION SECTION
    	supportDocs: {
        	data: {
            	description: "You must provide COMPANY with supporting documentation if not previously submitted. This includes but is not limited to the information/indictment, superseding indictments, plea agreement or findings by jury, judgment, sentencing and/or probation order, proof of satisfaction of sentence, and the final disposition of the court. If court documentation is no longer available, please submit a certified letter from the applicable court providing the reason the documentation is not on file."
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
            	$.bg.web.app.dmp.criminal.caseinfo.ui.register(config);
            	$.bg.web.app.dmp.criminal.caseinfo.ui.init();
            	$.bg.web.app.dmp.criminal.charges.ui.register(config);
            	$.bg.web.app.dmp.criminal.charges.ui.init();
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
	$.bg.web.app.dmp.criminal.ui = {
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
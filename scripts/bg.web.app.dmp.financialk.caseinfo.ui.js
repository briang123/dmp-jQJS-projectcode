(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.financialk === undefined) $.bg.web.app.dmp.financialk = {};
	if ($.bg.web.app.dmp.financialk.caseinfo === undefined) $.bg.web.app.dmp.financialk.caseinfo = {};
	
	var localConfig = {
    	caseInfoDetails: {
        	data: {
            	adversaryCourtFiled: {
                	rows: null
            	},
            	adversaryActionStatus: {
                	rows: null
            	},
            	adversaryActionFinalDisposition: {
                	rows: null
            	},
            	adversaryMonth: {
                	rows: null
            	}
        	}
    	}
	};
	// main page object
	var section = function (config) {
    	return {
        	//  get the message control that we want to display a message in
        	messageControl: function (currentControl) {
            	if (currentControl) {
                	return currentControl.closest(".section-content").find(".messages");
            	} else {
                	return config.caseInfoDetails.messageControl;
            	}
        	},
        	//  initialize the section
        	init: function () {
            	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                	//  handle specific edit/read-only functions
                	if (config.editMode) {
                    	section(config).validate();
                	}
            	} else {
                	var $this = this;
                	//  hide content so we can refresh it
                	config.caseInfoDetails.containerPanelBody.hide();
                	config.caseInfoDetails.spinner.show();
                	//  if editing form, then show the astrisks
                	if (config.editMode) {
                    	config.caseInfoDetails.astrisks.css({ "display": "inline" });
                	};
                	this.bankruptcyCourtLocation.init();
                	this.bankruptcyCaseNumber.init();
                	//  init/reinit the section controls
                	setTimeout(function () {
                    	$this.adversaryCourtFiled.init();
                	}, config.timeoutDelay);
                	this.adversaryCourtLocation.init();
                	this.adversaryCaseNumber.init();
                	setTimeout(function () {
                    	$this.adversaryActionStatus.init();
                	}, config.timeoutDelay);
                	this.adversaryMonth.init();
                	this.adversaryYear.init();
            	}
        	},
        	//  hide the spinner controls as data is loaded
        	hideSpinner: function (control, closestSelector) {
            	config.hideSpinner(control, closestSelector, config.caseInfoDetails.spinner, config.caseInfoDetails.containerPanelBody, config);
        	},
        	//*** BANKRUPTCY SECTION
        	//  BANKRUPTCY COURT LOCATION INPUT
        	bankruptcyCourtLocation: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.bankruptcyCourtLocation,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	var $this = section(config).bankruptcyCourtLocation;
                	config.references.inputTextUI.init({
                    	containerId: config.caseInfoDetails.containerId,
                    	editMode: config.editMode,
                    	control: $this.control(),
                    	dbValue: $this.dbValue(),
                    	defaultValue: $this.defaultValue(),
                    	features: {
                        	showLabelsForReadOnly: config.page.data.showLabelsForReadOnly,
                        	setLabelOnSameLineWhenReadOnly: config.page.data.setLabelOnSameLineWhenReadOnly,
                        	upperCaseEditText: config.page.data.upperCaseEditText,
                        	upperCaseReadOnlyText: config.page.data.upperCaseReadOnlyText,
                        	upperCaseOnBlur: config.page.data.upperCaseOnBlur,
                        	noDataValue: config.page.data.noDataValue
                    	},
                    	events: {
                        	onInitCallback: function () {
                            	section(config).hideSpinner($this.control(), "div");
                        	},
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger($this);
                        	},
                        	onBlurCallback: function () {
                            	if ($this.val().length > 0) {
                                	$this.isValid();
                            	}
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.bankruptcyCourtLocation.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.bankruptcyCourtLocation.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	//  Missing value
                            	if (this.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertBefore(this.control().closest("div").find("br:first"));
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  BANKRUPTCY CASE NUMBER INPUT
        	bankruptcyCaseNumber: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.bankruptcyCaseNumber,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	var $this = section(config).bankruptcyCaseNumber;
                	config.references.inputTextUI.init({
                    	containerId: config.caseInfoDetails.containerId,
                    	editMode: config.editMode,
                    	control: $this.control(),
                    	dbValue: $this.dbValue(),
                    	defaultValue: $this.defaultValue(),
                    	features: {
                        	showLabelsForReadOnly: config.page.data.showLabelsForReadOnly,
                        	setLabelOnSameLineWhenReadOnly: config.page.data.setLabelOnSameLineWhenReadOnly,
                        	upperCaseEditText: config.page.data.upperCaseEditText,
                        	upperCaseReadOnlyText: config.page.data.upperCaseReadOnlyText,
                        	upperCaseOnBlur: config.page.data.upperCaseOnBlur,
                        	noDataValue: config.page.data.noDataValue
                    	},
                    	events: {
                        	onInitCallback: function () {
                            	section(config).hideSpinner($this.control(), "div");
                        	},
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger($this);
                        	},
                        	onBlurCallback: function () {
                            	if ($this.val().length > 0) {
                                	$this.isValid();
                            	}
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.bankruptcyCaseNumber.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.bankruptcyCaseNumber.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	return true;
            	}
        	},
        	//*** ADVERSARY SECTION
        	//  ADVERSARY COURT FILED COMBO
        	adversaryCourtFiled: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.adversaryCourtFiled,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.adversaryCourtFiled.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.adversaryCourtFiled.rows);
                    	}
                	} else {
                    	this.getData();
                	}
            	},
            	reinit: function () {
                	var $label = this.control().closest("div").find(".ms-label");
                	if ($label.length > 0) {
                    	$label.hide().prev().show();
                	}
                	this.control().closest("div").find(".multiselect").show();
                	this.finalize();
            	},
            	finalize: function () {
                	section(config).hideSpinner(this.control(), ".row");
            	},
            	initCombo: function (data) {
                	config.references.multiselectUI.init({
                    	readOnly: !config.editMode,
                    	readOnlyNothingSelectedValue: config.page.data.noDataValue,
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single"
                    	},
                    	css: {
                        	maxHeight: 300
                    	},
                    	data: {
                        	dbValue: this.dbValue(),
                        	dataSource: data,
                        	displayColumn: this.configMap().text,
                        	valueColumn: this.configMap().value,
                        	defaultValue: this.dbValue() || this.defaultValue()
                    	},
                    	events: {
                        	onInitCallback: function (msConfig) {
                            	section(config).adversaryCourtFiled.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	if (checked) {
                                	section(config).adversaryCourtFiled.isValid();
                            	}
                            	config.references.utility.data.dirtyLogger(section(config).adversaryCourtFiled);
                        	}
                    	}
                	});
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	section(config).validate();
            	},
            	getData: function () {
                	var $messageControl = section(config).messageControl(this.control());
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.adversaryCourtFiled.rows = result.result.rows;
                                    	$this.initCombo(result.result.rows);
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 3);
                        	}
                    	} catch (ex) {
                        	config.checkPermission(ex);
                        	config.references.utility.displayPageMessage(
                            	ex,
                            	config.references.globals.alerts.DANGER.klass,
                            	config.references.globals.alerts.DANGER.color,
                            	false,
                            	$messageControl.selector,
                            	null
                        	);
                    	}
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.adversaryCourtFiled.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.adversaryCourtFiled.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function (triggeredByLinkedValidationControl) {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	//  Missing value
                            	if (this.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control().closest("div").find(".btn-group"));
                                	return false;
                            	}
                        	}
                    	} else if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                        	var $adversaryCaseNumber = section(config).adversaryCaseNumber;
                        	var $adversaryCourtLocation = section(config).adversaryCourtLocation;
                        	//  if personally named checked in basis for disclosure then check to see if this field is
                        	//  required by comparing to court location or adversary action case number
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	if (this.val().length === 0 && $adversaryCaseNumber.val().length === 0 && $adversaryCourtLocation.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control().closest("div").find(".btn-group"));
                                	if (!triggeredByLinkedValidationControl) {
                                    	$adversaryCaseNumber.isValid(true);
                                    	$adversaryCourtLocation.isValid(true);
                                	}
                                	return false;
                            	} else if (this.val().length > 0 && $adversaryCaseNumber.val().length === 0 && $adversaryCourtLocation.val().length === 0) {
                                	if (!triggeredByLinkedValidationControl) {
                                    	$adversaryCaseNumber.isValid(true);
                                    	$adversaryCourtLocation.isValid(true);
                                	}
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  ADVERSARY COURT LOCATION INPUT
        	adversaryCourtLocation: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.adversaryCourtLocation,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	var $this = section(config).adversaryCourtLocation;
                	config.references.inputTextUI.init({
                    	containerId: config.caseInfoDetails.containerId,
                    	editMode: config.editMode,
                    	control: $this.control(),
                    	dbValue: $this.dbValue(),
                    	defaultValue: $this.defaultValue(),
                    	features: {
                        	showLabelsForReadOnly: config.page.data.showLabelsForReadOnly,
                        	setLabelOnSameLineWhenReadOnly: config.page.data.setLabelOnSameLineWhenReadOnly,
                        	upperCaseEditText: config.page.data.upperCaseEditText,
                        	upperCaseReadOnlyText: config.page.data.upperCaseReadOnlyText,
                        	upperCaseOnBlur: config.page.data.upperCaseOnBlur,
                        	noDataValue: config.page.data.noDataValue
                    	},
                    	events: {
                        	onInitCallback: function () {
                            	section(config).hideSpinner($this.control(), ".row");
                        	},
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger(section(config).adversaryCourtLocation);
                        	},
                        	onBlurCallback: function () {
                            	if ($this.val().length > 0) {
                                	$this.isValid();
                            	}
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.adversaryCourtLocation.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.adversaryCourtLocation.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function (triggeredByLinkedValidationControl) {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	//  Missing value
                            	if (this.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control());
                                	return false;
                            	}
                        	}
                    	} else if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                        	var $adversaryCourtFiled = section(config).adversaryCourtFiled;
                        	var $adversaryCaseNumber = section(config).adversaryCaseNumber;
                        	//  if personally named checked in basis for disclosure then check to see if this field is
                        	//  required by comparing to court filed or adversary action case number
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	if (this.val().length === 0 && $adversaryCourtFiled.val().length === 0 && $adversaryCaseNumber.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control());
                                	if (!triggeredByLinkedValidationControl) {
                                    	$adversaryCourtFiled.isValid(true);
                                    	$adversaryCaseNumber.isValid(true);
                                	}
                                	return false;
                            	} else if (this.val().length > 0 && $adversaryCourtFiled.val().length === 0 && $adversaryCaseNumber.val().length === 0) {
                                	if (!triggeredByLinkedValidationControl) {
                                    	$adversaryCourtFiled.isValid(true);
                                    	$adversaryCaseNumber.isValid(true);
                                	}
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  ADVERSARY CASE NUMBER INPUT
        	adversaryCaseNumber: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.adversaryCaseNumber,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	var $this = section(config).adversaryCaseNumber;
                	config.references.inputTextUI.init({
                    	containerId: config.caseInfoDetails.containerId,
                    	editMode: config.editMode,
                    	control: $this.control(),
                    	dbValue: $this.dbValue(),
                    	defaultValue: $this.defaultValue(),
                    	features: {
                        	showLabelsForReadOnly: config.page.data.showLabelsForReadOnly,
                        	setLabelOnSameLineWhenReadOnly: config.page.data.setLabelOnSameLineWhenReadOnly,
                        	upperCaseEditText: config.page.data.upperCaseEditText,
                        	upperCaseReadOnlyText: config.page.data.upperCaseReadOnlyText,
                        	upperCaseOnBlur: config.page.data.upperCaseOnBlur,
                        	noDataValue: config.page.data.noDataValue
                    	},
                    	events: {
                        	onInitCallback: function () {
                            	section(config).hideSpinner($this.control(), ".row");
                        	},
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger(section(config).adversaryCaseNumber);
                        	},
                        	onBlurCallback: function () {
                            	if ($this.val().length > 0) {
                                	$this.isValid();
                            	}
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.adversaryCaseNumber.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.adversaryCaseNumber.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function (triggeredByLinkedValidationControl) {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	//  Missing value
                            	if (this.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control());
                                	return false;
                            	}
                        	}
                    	} else if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                        	var $adversaryCourtLocation = section(config).adversaryCourtLocation;
                        	var $adversaryCourtFiled = section(config).adversaryCourtFiled;
                        	//  if personally named checked in basis for disclosure then check to see if this field is
                        	//  required by comparing to court location or adversary action court filed
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	if (this.val().length === 0 && $adversaryCourtFiled.val().length === 0 && $adversaryCourtLocation.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control());
                                	if (!triggeredByLinkedValidationControl) {
                                    	$adversaryCourtFiled.isValid(true);
                                    	$adversaryCourtLocation.isValid(true);
                                	}
                                	return false;
                            	} else if (this.val().length > 0 && $adversaryCourtFiled.val().length === 0 && $adversaryCourtLocation.val().length === 0) {
                                	if (!triggeredByLinkedValidationControl) {
                                    	$adversaryCourtFiled.isValid(true);
                                    	$adversaryCourtLocation.isValid(true);
                                	}
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  ADVERSARY ACTION STATUS COMBO
        	adversaryActionStatus: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.adversaryActionStatus,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.adversaryActionStatus.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.adversaryActionStatus.rows);
                    	}
                	} else {
                    	this.getData();
                	}
            	},
            	reinit: function () {
                	var $label = this.control().closest("div").find(".ms-label");
                	if ($label.length > 0) {
                    	$label.hide().prev().show();
                	}
                	this.control().closest("div").find(".multiselect").show();
                	this.finalize();
            	},
            	finalize: function () {
                	section(config).hideSpinner(this.control(), ".row");
            	},
            	initCombo: function (data) {
                	var $this = this;
                	var $triggeredObject = section(config).adversaryActionFinalDisposition;
                	config.references.multiselectUI.init({
                    	readOnly: !config.editMode,
                    	readOnlyNothingSelectedValue: config.page.data.noDataValue,
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single",
                        	enableCaseInsensitiveFiltering: true,
                        	optionItemsBeforeFiltering: 8,
                        	numberDisplayed: 1
                    	},
                    	css: {
                        	maxHeight: 300
                    	},
                    	data: {
                        	dbValue: this.dbValue(),
                        	dataSource: data,
                        	displayColumn: this.configMap().text,
                        	valueColumn: this.configMap().value,
                        	defaultValue: this.dbValue() || this.defaultValue()
                    	},
                    	events: {
                        	onInitCallback: function (msConfig) {
                            	//  if value is other, then show the "other" container; otherwise, hide it
                            	if ($this.dbValue() === $this.configMap().triggerShowOnChangeValue) {
                                	$this.control().closest(".row").find(".adversary-action-status-appeal-container").show();
                                	if (!config.editMode) {
                                    	$this.control().closest(".row").find(".ms-label").hide();
                                	}
                            	}
                            	$this.finalize();
                        	},
                        	onBindCallback: function (data) {
                            	$triggeredObject.init();
                            	section(config).adversaryActionFinalDispositionOther.init();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	config.references.utility.data.dirtyLogger($this);
                            	if (option && checked) {
                                	if (config.references.utility.getString($(option).val()) === $this.configMap().triggerShowOnChangeValue) {
                                    	$this.control().closest(".row").find(".adversary-action-status-appeal-container").show();
                                    	$triggeredObject.reinit();
                                	} else {
                                    	$.bg.web.app.control.multiselect.ui.setMultiselectVal($triggeredObject.control(), [""]);
                                    	$this.control().closest(".row").find(".adversary-action-status-appeal-container").hide();
                                	}
                                	$this.isValid();
                            	} else {
                                	$.bg.web.app.control.multiselect.ui.setMultiselectVal($triggeredObject.control(), [""]);
                                	$this.control().closest(".row").find(".adversary-action-status-appeal-container").hide();
                            	}
                        	}
                    	}
                	});
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	section(config).validate();
            	},
            	getData: function () {
                	var $messageControl = section(config).messageControl(this.control());
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.adversaryActionStatus.rows = result.result.rows;
                                    	$this.initCombo(result.result.rows);
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 3);
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
            	dbValue: function () {
                	return config.caseInfoDetails.data.adversaryActionStatus.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.adversaryActionStatus.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	//  no value selected
                            	if (this.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control().closest("div").find(".btn-group"));
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  ADVERSARY ACTION FINAL DISPOSITION COMBO (WHEN ACTION STATUS = ON APPEAL)
        	adversaryActionFinalDisposition: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.adversaryActionFinalDisposition,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.adversaryActionFinalDisposition.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.adversaryActionFinalDisposition.rows);
                    	}
                	} else {
                    	this.getData();
                	}
            	},
            	reinit: function () {
                	var $label = this.control().closest("div").find(".ms-label");
                	if ($label.length > 0) {
                    	$label.hide().prev().show();
                	}
                	this.control().closest("div").find(".multiselect").show();
                	this.finalize();
            	},
            	finalize: function () {
                	section(config).hideSpinner(this.control(), ".row");
            	},
            	initCombo: function (data) {
                	var $this = this;
                	var $triggeredObject = section(config).adversaryActionFinalDispositionOther;
                	config.references.multiselectUI.init({
                    	readOnly: !config.editMode,
                    	readOnlyNothingSelectedValue: config.page.data.noDataValue,
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single",
                        	enableCaseInsensitiveFiltering: true,
                        	optionItemsBeforeFiltering: 8,
                        	numberDisplayed: 1
                    	},
                    	css: {
                        	maxHeight: 300
                    	},
                    	data: {
                        	dbValue: this.dbValue(),
                        	dataSource: data,
                        	displayColumn: this.configMap().text,
                        	valueColumn: this.configMap().value,
                        	defaultValue: this.dbValue() || this.defaultValue()
                    	},
                    	events: {
                        	onInitCallback: function (msConfig) {
                            	//  if value is other, then show the "other" container; otherwise, hide it
                            	if ($this.dbValue() === "OTHER") {
                                	$this.control().closest(".row").find(".other-container").show();
                                	if (!config.editMode) {
                                    	$this.control().closest(".row").find(".ms-label").hide();
                                	}
                            	}
                            	$this.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	config.references.utility.data.dirtyLogger($this);
                            	if (option && checked) {
                                	if (config.references.utility.getString($(option).val()) === "OTHER") {
                                    	$this.control().closest(".row").find(".other-container").show();
                                    	$triggeredObject.reinit();
                                	} else {
                                    	$($triggeredObject.control()).val("");
                                    	$triggeredObject.control().change().blur();
                                    	$this.control().closest(".row").find(".other-container").hide();
                                	}
                                	$this.isValid();
                            	} else {
                                	$($triggeredObject.control()).val("");
                                	$triggeredObject.control().change().blur();
                                	$this.control().closest(".row").find(".other-container").hide();
                            	}
                        	}
                    	}
                	});
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	section(config).validate();
            	},
            	getData: function () {
                	var $messageControl = config.caseInfoDetails.containerPanelBody.find("#case_info_formal_charges_messages");
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.adversaryActionFinalDisposition.rows = result.result.rows;
                                    	$this.initCombo(result.result.rows);
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 3);
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
            	dbValue: function () {
                	return config.caseInfoDetails.data.adversaryActionFinalDisposition.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.adversaryActionFinalDisposition.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	//  no value selected
                            	if (this.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control().closest("div").find(".btn-group"));
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  ADVERSARY ACTION FINAL DISPOSITION OTHER INPUT
        	adversaryActionFinalDispositionOther: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.adversaryActionFinalDispositionOther,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	reinit: function () {
                	//restore the original "other" value from the database or default value, since we cleared out when we changed value to something other than "other", geesh!
                	if (this.val().length === 0) {
                    	$(this.control()).val(this.dbValue() || this.defaultValue() || "");
                    	section(config).adversaryActionFinalDispositionOther.control().focus().change().blur();
                	}
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).adversaryActionFinalDispositionOther;
                	config.references.inputTextUI.init({
                    	containerId: config.caseInfoDetails.containerId,
                    	editMode: config.editMode,
                    	control: $this.control(),
                    	dbValue: $this.dbValue(),
                    	defaultValue: $this.defaultValue(),
                    	features: {
                        	showLabelsForReadOnly: config.page.data.showLabelsForReadOnly,
                        	setLabelOnSameLineWhenReadOnly: config.page.data.setLabelOnSameLineWhenReadOnly,
                        	upperCaseEditText: config.page.data.upperCaseEditText,
                        	upperCaseReadOnlyText: config.page.data.upperCaseReadOnlyText,
                        	upperCaseOnBlur: config.page.data.upperCaseOnBlur,
                        	noDataValue: config.page.data.noDataValue
                    	},
                    	events: {
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger($this);
                        	},
                        	onBlurCallback: function () {
                            	$this.isValid();
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.adversaryActionFinalDispositionOther.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.adversaryActionFinalDispositionOther.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest(".other-input").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (section(config).adversaryActionFinalDisposition.val() === "OTHER" && this.val().length === 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                	}
                	return true;
            	}
        	},
        	//  ADVERSARY MONTHS COMBO
        	adversaryMonth: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.adversaryMonth,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	config.references.multiselectUI.init({
                    	readOnly: !config.editMode,
                    	readOnlyNothingSelectedValue: config.page.data.noDataValue,
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single",
                        	enableCaseInsensitiveFiltering: true,
                        	optionItemsBeforeFiltering: 1,
                        	numberDisplayed: 1
                    	},
                    	css: {
                        	maxHeight: 300
                    	},
                    	data: {
                        	dbValue: this.dbValue(),
                        	dataSource: this.getData(),
                        	displayColumn: this.configMap().text,
                        	valueColumn: this.configMap().value,
                        	defaultValue: this.dbValue() || this.defaultValue()
                    	},
                    	events: {
                        	onInitCallback: function (msConfig) {
                            	//  if value is other, then show the "other" container; otherwise, hide it
                            	var monthValue = config.references.utility.getString(config.caseInfoDetails.data.adversaryMonth.dbValue || config.caseInfoDetails.data.adversaryMonth.defaultValue);
                            	if (monthValue.length > 0) {
                                	if (!config.editMode) {
                                    	var yearValue = config.references.utility.getString(config.caseInfoDetails.data.adversaryYear.dbValue || config.caseInfoDetails.data.adversaryYear.defaultValue);
                                    	if (yearValue != "") {
                                        	var $monthLabel = section(config).adversaryMonth.control().closest(".row").find(".ms-label");
                                        	//var $yearLabel = section(config).adversaryYear.control().closest(".row").find(".ms-label").eq(1);
                                        	if ($monthLabel.length > 0) {
                                            	$monthLabel.text($monthLabel.text() + " " + yearValue);
                                            	//$yearLabel.hide();
                                        	}
                                    	}
                                	} else {
                                    	//section(config).adversaryMonth.isValid();
                                	}
                            	} else {
                                	//section(config).adversaryMonth.isValid();
                            	}
                            	section(config).adversaryMonth.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	section(config).adversaryMonth.isValid();
                            	config.references.utility.data.dirtyLogger(section(config).adversaryMonth);
                        	}
                    	}
                	});
            	},
            	reinit: function () {
                	var $label = this.control().closest("div").find(".ms-label");
                	if ($label.length > 0) {
                    	$label.hide().prev().show();
                	}
                	this.control().closest("div").find(".multiselect").show();
                	this.finalize();
            	},
            	finalize: function () {
                	section(config).hideSpinner(this.control(), ".row");
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	this.isValid();
                	//section(config).validate();
            	},
            	getData: function () {
                	if (config.caseInfoDetails.data.adversaryMonth.rows) {
                    	return config.caseInfoDetails.data.adversaryMonth.rows;
                	} else {
                    	var results;
                    	try {
                        	results = config.references.globals.data.months.rows();
                        	config.caseInfoDetails.data.adversaryMonth.rows = results;
                    	} catch (ex) {
                        	throw ex;
                    	}
                    	return results;
                	}
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.adversaryMonth.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.adversaryMonth.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  we validate both the month and year together and the validation is part of the year control.
                	section(config).adversaryYear.control().trigger("blur");
            	}
        	},
        	//  ADVERSARY YEAR INPUT
        	adversaryYear: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.adversaryYear,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).adversaryYear;
                	config.references.inputTextUI.init({
                    	containerId: config.caseInfoDetails.containerId,
                    	editMode: config.editMode,
                    	control: $this.control(),
                    	dbValue: $this.dbValue(),
                    	defaultValue: $this.defaultValue(),
                    	features: {
                        	showLabelsForReadOnly: config.page.data.showLabelsForReadOnly,
                        	setLabelOnSameLineWhenReadOnly: config.page.data.setLabelOnSameLineWhenReadOnly,
                        	upperCaseEditText: config.page.data.upperCaseEditText,
                        	upperCaseReadOnlyText: config.page.data.upperCaseReadOnlyText,
                        	upperCaseOnBlur: config.page.data.upperCaseOnBlur,
                        	noDataValue: config.page.data.noDataValue
                    	},
                    	validation: {
                        	keys: {
                            	numericOnly: true
                        	}
                    	},
                    	events: {
                        	onBindCallback: function () {
                            	var $yearInputLabel = $this.control().closest("div").find(".year-label");
                            	var $yearLabel = $this.control().closest(".row").find(".bg-input-label");
                            	if (config.editMode) {
                                	if ($yearInputLabel.length > 0) {
                                    	$yearInputLabel.show();
                                	}
                            	}
                        	},
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger(section(config).adversaryYear);
                        	},
                        	onBlurCallback: function () {
                            	$this.isValid();
                        	}
                    	},
                    	utility: config.references.utility
                	});

                	if (!config.editMode) {
                    	var $yearInputLabel = $this.control().closest("div").find(".year-label");
                    	var $yearLabel = $this.control().closest(".row").find(".bg-input-label");
                    	//TODO: WHY ARE THERE 2 $yearLabel OBJECTS? NOT A BIG DEAL, AS IT'S RENDERING CORRECTLY, BUT STILL...
                    	if (!config.editMode) {
                        	//hide the 4-digit year label when in read-only mode (Will combine with month value, ie. February, 2010)
                        	if ($yearInputLabel.length > 0) {
                            	if (!config.editMode) {
                                	$yearInputLabel.hide();
                            	}
                        	}
                        	//hide the label with the dbvalue since we're setting this year value in with the months label
                        	if ($yearLabel.length > 0) {
                            	$yearLabel.hide();
                        	}
                    	} else {
                        	if ($yearInputLabel.length > 0) {
                            	$yearInputLabel.show();
                        	}
                    	}
                	}
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.adversaryYear.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.adversaryYear.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	var selectedMonth = section(config).adversaryMonth.val();
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	//  missing month or year is less than 4 digits                        	
                            	if (isNaN(parseInt(selectedMonth)) && this.val().length === 0) {
                                	if (!this.control().data("suppressValidation")) {
                                    	config.references.utility.html({
                                        	klass: config.validation.ERROR_CLASS,
                                        	text: config.validation.messages.REQUIRED
                                    	}).insertAfter(this.control());
                                    	return false;
                                	}
                            	} else {
                                	//  suppress subsequent required field validations if the user corrects it as a result of clicking File button
                                	//  and then clears out the data again, we don't want to revalidate since we don't know if user will click
                                	//  on File or Save buttons.
                                	this.control().data("suppressValidation", true);
                            	}
                        	}
                    	}
                    	//  NOTE: if user entering month/year, then it should at least be valid, but date not required to save DMP
                    	//  validate the month and year if a date exists
                    	if ((isNaN(parseInt(selectedMonth)) && (this.val().length > 0 && this.val().length < 5)) ||
                        	(parseInt(selectedMonth) && this.val().length < 4)) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.INVALID_DATE
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                    	//  compare current month and year with selected month and entered year
                    	var thisYear = new Date().getFullYear();
                    	var thisMonth = new Date().getMonth() + 1;  //  app months are 1-based, so we add 1 to js month object.
                    	if (parseInt(this.val()) > thisYear || (parseInt(this.val()) === thisYear && parseInt(selectedMonth) > thisMonth)) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.NO_FUTURE_DATE
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                    	if (isNaN(parseInt(selectedMonth)) && this.val().length === 0) {
                    	}
                	}
                	return true;
            	}
        	},
        	//  validate the section
        	validate: function () {
            	try {
                	config.caseInfoDetails.astrisks.css({ "display": "inline" });
                	this.bankruptcyCourtLocation.isValid();
                	this.bankruptcyCaseNumber.isValid();
                	this.adversaryCourtFiled.isValid();
                	this.adversaryCourtLocation.isValid();
                	this.adversaryCaseNumber.isValid();
                	this.adversaryActionStatus.isValid();
                	this.adversaryActionFinalDisposition.isValid();
                	this.adversaryActionFinalDispositionOther.isValid();
                	this.adversaryMonth.isValid();
                	this.adversaryYear.isValid();
            	} catch (ex) {
                	throw "An error occurred during validation";
            	}
        	}
    	}
	};
	//  public API
	$.bg.web.app.dmp.financialk.caseinfo.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	section(localConfig).init();
    	}
	};
})(jQuery);
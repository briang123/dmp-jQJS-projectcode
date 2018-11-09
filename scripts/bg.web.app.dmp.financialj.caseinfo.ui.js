(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.financialj === undefined) $.bg.web.app.dmp.financialj = {};
	if ($.bg.web.app.dmp.financialj.caseinfo === undefined) $.bg.web.app.dmp.financialj.caseinfo = {};
	var localConfig = {
    	caseInfoDetails: {
        	data: {
            	actionType: {
                	rows: null
            	},
            	actionFiled: {
                	rows: null
            	},
            	awardMatterMonth: {
                	rows: null
            	}
        	}
    	}
	};
	// main page object
	var section = function (config) {
    	return {
        	messageControl: function (currentControl) {
            	return config.caseInfoDetails.messageControl;
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
                	setTimeout(function () {
                    	$this.actionType.init();
                	}, config.timeoutDelay);
                	setTimeout(function () {
                    	$this.actionFiled.init();
                    	$this.actionFiledOther.init();
                	}, config.timeoutDelay);
                	this.caseNumber.init();
                	this.awardMatterMonth.init();
                	this.awardMatterYear.init();
            	}
        	},
        	//  hide the spinner controls as data is loaded
        	hideSpinner: function (control, closestSelector) {
            	config.hideSpinner(control, closestSelector, config.caseInfoDetails.spinner, config.caseInfoDetails.containerPanelBody, config);
        	},
        	actionType: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.actionType,
            	control: function () {
                	return this.configMap().control;
            	},
            	readOnlyControl: function () {
                	return this.controlContainer().find("span.readonly-control");
            	},
            	controlType: function () {
                	return config.references.utility.getString(this.configMap().controlType).toLowerCase();
            	},
            	orientVertical: function () {
                	return (config.references.utility.getString(this.configMap().orientation).toLowerCase() === "vertical");
            	},
            	controlGroupName: function () {
                	return this.configMap().controlGroupName;
            	},
            	controlContainer: function () {
                	return this.configMap().controlContainer;
            	},
            	init: function () {
                	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                    	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                    	//  handle specific edit/read-only functions
                    	if (config.editMode) {
                        	this.isValid();
                    	}
                	} else {
                    	if (config.caseInfoDetails.data.actionType.rows) {
                        	if (config.editMode) {
                            	this.reinit();
                        	} else {
                            	this.initControls(config.caseInfoDetails.data.actionType.rows);
                        	}
                    	} else {
                        	this.getData();
                    	}
                	}
            	},
            	reinit: function (data) {
                	this.readOnlyControl().hide();
                	this.control().show();
            	},
            	finalize: function () {
                	section(config).hideSpinner(this.controlContainer().find("input:first"), ".row");
            	},
            	initControls: function (data) {
                	var $this = this;
                	config.references.radioCheckboxUI.init({
                    	editMode: config.editMode,
                    	controlContainer: $this.controlContainer(),
                    	controlType: $this.controlType(),
                    	orientVertical: $this.orientVertical(),
                    	data: {
                        	rows: data,
                        	dbValue: $this.dbValue(),
                        	defaultValue: $this.defaultValue(),
                        	valueColumn: "CODE",
                        	textColumn: "DESCRIPTION",
                        	controlGroupName: $this.controlGroupName()
                    	},
                    	events: {
                        	onInitCallback: function (controlConfig) { },
                        	onBindCallback: function (controlConfig) {
                            	$this.finalize();
                        	},
                        	onClickCallback: function (e, control, controlConfig) {
                            	if (!config.editMode) {
                                	return false;
                            	} else {
                                	$this.isValid();
                            	}
                        	},
                        	onErrorCallback: function (controlConfig, ex) {
                            	config.references.utility.displayPageMessage(
                                	ex,
                                	config.references.globals.alerts.DANGER.klass,
                                	config.references.globals.alerts.DANGER.color,
                                	false,
                                	section(config).messageControl.empty().selector,
                                	null
                            	);
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	getData: function () {
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.actionType.rows = result.result.rows;
                                    	$this.initControls(result.result.rows);
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
                            	section(config).messageControl().empty().selector,
                            	null
                        	);
                    	}
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.actionType.dbValue;
            	},
            	val: function () {
                	return config.references.utility.data.getSelectedItems($(this.control().selector + "[name='" + this.controlGroupName() + "']:checked"), this.controlType());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.actionType.defaultValue;
            	},
            	isRequired: function () {
                	return (this.controlContainer().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.controlContainer().find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	//  no checked values
                        	if (this.val().length === 0) {
                            	if (!this.orientVertical()) {
                                	config.references.utility.html({
                                    	css: { "margin-left": "5px" },
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.controlContainer().find("span:last-child"));
                                	return false;
                            	} else {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertBefore(this.controlContainer().find("div:first-child"));
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  ACTION FILED WITH COMBO
        	actionFiled: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.actionFiled,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.actionFiled.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.actionFiled.rows);
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
                	var $other = section(config).actionFiledOther;
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
                            	if (config.caseInfoDetails.data.actionFiled.dbValue === "OTHER") {
                                	$this.control().closest(".row").find(".other-container").show();
                                	if (!config.editMode) {
                                    	$this.control().closest(".row").find(".ms-label").hide();
                                	}
                            	}
                            	$this.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	config.references.utility.data.dirtyLogger($this);
                            	if (checked) {
                                	if (config.references.utility.getString($(option).val()) === "OTHER") {
                                    	$this.control().closest(".row").find(".other-container").show();
                                    	$other.reinit();
                                	} else {
                                    	$($other.control()).val("");
                                    	$other.control().change().blur();
                                    	$this.control().closest(".row").find(".other-container").hide();
                                	}
                                	$this.isValid();
                            	} else {
                                	$($other.control()).val("");
                                	$other.control().change().blur();
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
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.actionFiled.rows = result.result.rows;
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
                            	section(config).messageControl().empty().selector,
                            	null
                        	);
                    	}
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.actionFiled.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.actionFiled.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function (triggeredByLinkedValidationControl) {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	//  no value selected
                        	if (this.val().length === 0) {
                            	config.references.utility.html({
                                	klass: config.validation.ERROR_CLASS,
                                	text: config.validation.messages.REQUIRED
                            	}).insertAfter(this.control().closest("div").find(".btn-group"));
                            	return false;
                        	}
                    	} else if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                        	var $other = section(config).caseNumber;
                        	// this information or case number is required to save dmp
                        	if (this.val().length === 0 && $other.val().length === 0) {
                            	config.references.utility.html({
                                	klass: config.validation.ERROR_CLASS,
                                	text: config.validation.messages.REQUIRED
                            	}).insertAfter(this.control().closest("div").find(".btn-group"));
                            	if (!triggeredByLinkedValidationControl) {
                                	$other.isValid(true);
                            	}
                            	return false;
                        	} else if (this.val().length > 0 && $other.val().length === 0) {
                            	if (!triggeredByLinkedValidationControl) {
                                	$other.isValid(true);
                            	}
                            	return false;
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  ACTION FILED WITH - OTHER INPUT
        	actionFiledOther: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.OtherLocation,
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
                    	section(config).actionFiledOther.control().focus().change().blur();
                	}
            	},
            	bind: function () {
                	var $this = section(config).actionFiledOther;
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
                	return config.caseInfoDetails.data.actionFiledOther.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.actionFiledOther.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest(".other-input").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (section(config).actionFiled.val() === "OTHER" && this.val().length === 0) {
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
        	//  CASE NUMBER INPUT
        	caseNumber: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.caseNumber,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	var $this = section(config).caseNumber;
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
                            	section(config).hideSpinner(section(config).caseNumber.control(), ".row");
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
                	return config.caseInfoDetails.data.caseNumber.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.caseNumber.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function (triggeredByLinkedValidationControl) {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	//  Missing value
                        	if (this.val().length === 0) {
                            	config.references.utility.html({
                                	klass: config.validation.ERROR_CLASS,
                                	text: config.validation.messages.REQUIRED
                            	}).insertAfter(this.control());
                            	return false;
                        	}
                    	} else if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                        	var $other = section(config).actionFiled;
                        	//  this information or action filed is required to save dmp
                        	if (this.val().length === 0 && $other.val().length === 0) {
                            	config.references.utility.html({
                                	klass: config.validation.ERROR_CLASS,
                                	text: config.validation.messages.REQUIRED
                            	}).insertAfter(this.control());
                            	if (!triggeredByLinkedValidationControl) {
                                	$other.isValid(true);
                            	}
                            	return false;
                        	} else if (this.val().length > 0 && $other.val().length === 0) {
                            	if (!triggeredByLinkedValidationControl) {
                                	$other.isValid(true);
                            	}
                            	return false;
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  MONTH COMBO
        	awardMatterMonth: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.awardMatterMonth,
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
                            	var monthValue = config.references.utility.getString(config.caseInfoDetails.data.awardMatterMonth.dbValue || config.caseInfoDetails.data.awardMatterMonth.defaultValue);
                            	if (monthValue.length > 0) {
                                	if (!config.editMode) {
                                    	var yearValue = config.references.utility.getString(config.caseInfoDetails.data.awardMatterYear.dbValue || config.caseInfoDetails.data.awardMatterYear.defaultValue);
                                    	if (yearValue != "") {
                                        	var $monthLabel = section(config).awardMatterMonth.control().closest(".row").find(".ms-label");
                                        	if ($monthLabel.length > 0) {
                                            	$monthLabel.text($monthLabel.text() + " " + yearValue);
                                        	}
                                    	}
                                	}
                            	}
                            	section(config).awardMatterMonth.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	section(config).awardMatterMonth.isValid();
                            	config.references.utility.data.dirtyLogger(section(config).awardMatterMonth);
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
                	section(config).hideSpinner(section(config).awardMatterMonth.control(), ".row");
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	this.isValid();
            	},
            	getData: function () {
                	if (config.caseInfoDetails.data.awardMatterMonth.rows) {
                    	return config.caseInfoDetails.data.awardMatterMonth.rows;
                	} else {
                    	var results;
                    	try {
                        	results = config.references.globals.data.months.rows();
                        	config.caseInfoDetails.data.awardMatterMonth.rows = results;
                    	} catch (ex) {
                        	throw ex;
                    	}
                    	return results;
                	}
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.awardMatterMonth.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.awardMatterMonth.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  we validate both the month and year together and the validation is part of the year control.
                	section(config).awardMatterYear.control().trigger("blur");
            	}
        	},
        	//  YEAR INPUT
        	awardMatterYear: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.awardMatterYear,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).awardMatterYear;
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
                            	config.references.utility.data.dirtyLogger(section(config).awardMatterYear);
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
                	return config.caseInfoDetails.data.awardMatterYear.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.awardMatterYear.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	var selectedMonth = section(config).awardMatterMonth.val();
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
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
                	}
                	return true;
            	}
        	},
        	//  validate the section
        	validate: function () {
            	config.caseInfoDetails.astrisks.css({ "display": "inline" });
            	this.actionType.isValid();
            	this.actionFiled.isValid();
            	this.actionFiledOther.isValid();
            	this.caseNumber.isValid();
            	this.awardMatterMonth.isValid();
            	this.awardMatterYear.isValid();
        	}
    	}
	};
	//  public API
	$.bg.web.app.dmp.financialj.caseinfo.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	section(localConfig).init();
    	}
	};
})(jQuery);
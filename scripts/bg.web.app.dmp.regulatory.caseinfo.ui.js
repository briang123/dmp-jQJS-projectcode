(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.regulatory === undefined) $.bg.web.app.dmp.regulatory = {};
	if ($.bg.web.app.dmp.regulatory.caseinfo === undefined) $.bg.web.app.dmp.regulatory.caseinfo = {};
	var localConfig = {
    	caseInfoDetails: {
        	data: {
            	regCivilAction: {
                	rows: null
            	},
            	caseStatus: {
                	rows: null
            	},
            	onAppealActionAppeal: {
                	rows: null
            	},
            	onAppealLimitsRestrictions: {
                	rows: null
            	},
            	filingMonth: {
                	rows: null
            	},
            	sanctionsImposed: {
                	rows: null
            	}
        	}
    	}
	};
	// main page object
	var section = function (config) {
    	return {
        	//  section's message control
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
                	//  init/reinit the section controls
                	setTimeout(function () {
                    	$this.regCivilAction.init();
                    	$this.regCivilActionOther.init();
                	}, config.timeoutDelay);
                	this.caseNumber.init();
                	setTimeout(function () {
                    	$this.caseStatus.init();
                	}, config.timeoutDelay);
                	setTimeout(function () {
                    	$this.onAppealActionAppeal.init();
                    	$this.onAppealActionAppealOther.init();
                	}, config.timeoutDelay);
                	setTimeout(function () {
                    	$this.onAppealLimitsRestrictions.init();
                    	$this.onAppealLimitsRestrictionDetails.init();
                	}, config.timeoutDelay);
                	this.filingMonth.init();
                	this.filingYear.init();
                	setTimeout(function () {
                    	$this.sanctionsImposed.init();
                    	$this.sanctionsImposedOther.init();
                	}, config.timeoutDelay);
            	}
        	},
        	//  hide the spinner controls as data is loaded
        	hideSpinner: function (control, closestSelector) {
            	config.hideSpinner(control, closestSelector, config.caseInfoDetails.spinner, config.caseInfoDetails.containerPanelBody, config);
        	},
        	//  REGULATORY/CIVIL ACTION INITIATED BY COMBO
        	regCivilAction: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.regCivilAction,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.regCivilAction.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.regCivilAction.rows);
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
                	section(config).hideSpinner(section(config).regCivilAction.control(), ".row");
            	},
            	initCombo: function (data) {
                	var $this = this;
                	var $other = section(config).regCivilActionOther;
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
                            	if ($.inArray($this.dbValue(), $this.configMap().triggerHideOnChangeValue) == -1) {
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
                                	if ($.inArray(config.references.utility.getString($(option).val()).toUpperCase(), $this.configMap().triggerHideOnChangeValue) == -1) {
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
                	var $messageControl = config.caseInfoDetails.containerPanelBody.find("#case_info_formal_charges_messages");
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.regCivilAction.rows = result.result.rows;
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
                	return config.caseInfoDetails.data.regCivilAction.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.regCivilAction.defaultValue;
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
                            	//  no value selected
                            	if (this.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control().closest("div").find(".btn-group"));
                                	return false;
                            	}
                        	}
                    	} else if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                        	//  if personally named checked in basis for disclosure then check to see if this field is required by comparing to case number
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	if (this.val().length === 0 && section(config).caseNumber.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertAfter(this.control().closest("div").find(".btn-group"));
                                	if (!triggeredByLinkedValidationControl) {
                                    	section(config).caseNumber.isValid(true);
                                	}
                                	return false;
                            	} else if (this.val().length > 0 && section(config).caseNumber.val().length === 0) {
                                	if (!triggeredByLinkedValidationControl) {
                                    	section(config).caseNumber.isValid(true);
                                	}
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  REGULATORY/CIVIL ACTION INITIATED BY - OTHER INPUT
        	regCivilActionOther: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.regCivilActionOther,
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
                    	section(config).regCivilActionOther.control().focus().change().blur();
                	}
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).regCivilActionOther;
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
                	return config.caseInfoDetails.data.regCivilActionOther.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.regCivilActionOther.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	var $other = section(config).regCivilAction;
                	//  remove any previous error message
                	this.control().closest(".other-input").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	//  if the current value is not in array of values where we need to hide the "other input" and the current value is empty
                    	if (($.inArray($other.val().toUpperCase(), $other.configMap().triggerHideOnChangeValue) == -1) && this.val().length === 0) {
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
                    	} else if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                        	//  if personally named checked in basis for disclosure then check to see if this field is required by comparing to name of court
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	if (this.val().length === 0 && section(config).regCivilAction.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertBefore(this.control().closest("div").find("br:first"));
                                	if (!triggeredByLinkedValidationControl) {
                                    	section(config).regCivilAction.isValid(true);
                                	}
                                	return false;
                            	} else if (this.val().length > 0 && section(config).regCivilAction.val().length === 0) {
                                	if (!triggeredByLinkedValidationControl) {
                                    	section(config).regCivilAction.isValid(true);
                                	}
                                	return false;
                            	}
                        	}
                    	}
                	}
                	return true;
            	}
        	},
        	//  CASE STATUS COMBO
        	caseStatus: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.caseStatus,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.caseStatus.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.caseStatus.rows);
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
                	section(config).hideSpinner(section(config).caseStatus.control(), "div");
            	},
            	initCombo: function (data) {
                	var $this = this;
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
                            	if ($this.dbValue() === $this.configMap().triggerShowOnChange.value) {
                                	$this.configMap().triggerShowOnChange.container.slideDown();
                                	if (!config.editMode) {
                                    	$this.configMap().triggerShowOnChange.container.find(".ms-label").hide();
                                	}
                            	}
                            	$this.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	config.references.utility.data.dirtyLogger($this);
                            	var $$date = $this.configMap().triggerDateLabelOnChange;
                            	var $onAppealActionAppeal = section(config).onAppealActionAppeal;
                            	var $onAppealLimitsRestrictions = section(config).onAppealLimitsRestrictions;
                            	if (checked) {
                                	if (config.references.utility.getString($(option).val()) === $this.configMap().triggerShowOnChange.value) {
                                    	//section(config).onAppealActionAppeal.reinit();
                                    	//section(config).onAppealLimitsRestrictions.reinit();
                                    	$onAppealActionAppeal.init();
                                    	$onAppealLimitsRestrictions.init();
                                    	$this.configMap().triggerShowOnChange.container.slideDown();
                                	} else {
                                    	$.bg.web.app.control.multiselect.ui.setMultiselectVal($onAppealActionAppeal.control(), [""]);
                                    	//$onAppealActionAppeal.control().change().blur();
                                    	//$onAppealActionAppeal.control().blur();
                                    	$.bg.web.app.control.multiselect.ui.setMultiselectVal($onAppealLimitsRestrictions.control(), [""]);
                                    	//$onAppealLimitsRestrictions.control().change().blur();
                                    	//$onAppealLimitsRestrictions.control().blur();
                                    	$this.configMap().triggerShowOnChange.container.slideUp();
                                	}
                                	$$date.control.not(":visible").slideDown();
                                	$$date.label.text($$date.data[config.references.utility.getString($(option).val())]);
                                	$this.isValid();
                            	} else {

                                	$.bg.web.app.control.multiselect.ui.setMultiselectVal($onAppealActionAppeal.control(), "");
                                	//$onAppealActionAppeal.control().change().blur();
                                	$onAppealActionAppeal.control().blur();
                                	$.bg.web.app.control.multiselect.ui.setMultiselectVal($onAppealLimitsRestrictions.control(), "");
                                	//$onAppealLimitsRestrictions.control().change().blur();
                                	$onAppealLimitsRestrictions.control().blur();
                                	$this.configMap().triggerShowOnChange.container.slideUp();
                                	$$date.control.slideUp();
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
                	var $messageControl = config.caseInfoDetails.containerPanelBody.find("#case_info_messages");
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.caseStatus.rows = result.result.rows;
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
                	return config.caseInfoDetails.data.caseStatus.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.caseStatus.defaultValue;
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
        	//  ACTION APPEALED TO COMBO
        	onAppealActionAppeal: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.onAppealActionAppeal,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.onAppealActionAppeal.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.onAppealActionAppeal.rows);
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
                	section(config).hideSpinner(section(config).onAppealActionAppeal.control(), ".row");
            	},
            	initCombo: function (data) {
                	var $this = this;
                	var $other = section(config).onAppealActionAppealOther;
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
                            	if ($.inArray($this.dbValue(), $this.configMap().triggerHideOnChangeValue) == -1) {
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
                                	if ($.inArray(config.references.utility.getString($(option).val()).toUpperCase(), $this.configMap().triggerHideOnChangeValue) == -1) {
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
                	var $messageControl = config.caseInfoDetails.containerPanelBody.find("#case_info_formal_charges_messages");
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.onAppealActionAppeal.rows = result.result.rows;
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
                	return config.caseInfoDetails.data.onAppealActionAppeal.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.onAppealActionAppeal.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
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
                    	}
                	}
                	return true;
            	}
        	},
        	//  ACTION APPEALED TO - OTHER INPUT
        	onAppealActionAppealOther: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.onAppealActionAppealOther,
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
                    	section(config).onAppealActionAppealOther.control().focus().change().blur();
                	}
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).onAppealActionAppealOther;
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
                	return config.caseInfoDetails.data.onAppealActionAppealOther.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.onAppealActionAppealOther.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	var $other = section(config).onAppealActionAppeal;
                	//  remove any previous error message
                	this.control().closest(".other-input").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	//  if the related combo has value selected, then check if the current value is not in array of values where we need to hide the "other input" and the current value is empty
                    	if (($other.val().length > 0 && ($.inArray($other.val().toUpperCase(), $other.configMap().triggerHideOnChangeValue) == -1)) && this.val().length === 0) {
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
        	//  LIMITATIONS OR RESTRICTIONS CURRENTLY IN EFFECT WHILE ON APPEAL COMBO
        	onAppealLimitsRestrictions: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.onAppealLimitsRestrictions,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.onAppealLimitsRestrictions.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.onAppealLimitsRestrictions.rows);
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
                	section(config).hideSpinner(section(config).onAppealLimitsRestrictions.control(), ".row");
            	},
            	initCombo: function (data) {
                	var $this = this;
                	var $other = section(config).onAppealLimitsRestrictionDetails;
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
                            	if ($this.dbValue() === $this.configMap().triggerShowOnChange.value) {
                                	$this.configMap().triggerShowOnChange.container.slideDown();
                                	if (!config.editMode) {
                                    	$this.control().closest(".row").find(".ms-label").hide();
                                	}
                            	}
                            	$this.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	config.references.utility.data.dirtyLogger($this);
                            	if (option && checked) {
                                	if (config.references.utility.getString($(option).val()) === $this.configMap().triggerShowOnChange.value) {
                                    	$this.configMap().triggerShowOnChange.container.slideDown();
                                    	$other.reinit();
                                	} else {
                                    	$($other.control()).val("");
                                    	$other.control().change().blur();
                                    	$this.configMap().triggerShowOnChange.container.slideUp();
                                	}
                                	$this.isValid();
                            	} else {
                                	$($other.control()).val("");
                                	$other.control().change().blur();
                                	$this.configMap().triggerShowOnChange.container.slideUp();
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
                	var $messageControl = this.control().closest(".well").find(".messages:first");
                	if (config.caseInfoDetails.data.onAppealLimitsRestrictions.rows) {
                    	return config.caseInfoDetails.data.onAppealLimitsRestrictions.rows;
                	} else {
                    	try {
                        	var results = config.references.globals.data.yesNo.rows();
                        	config.caseInfoDetails.data.onAppealLimitsRestrictions.rows = results;
                        	this.initCombo(results);
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
                	}
                	//                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                	//                    	try {
                	//                        	if (response) {
                	//                            	var result = response.result;
                	//                            	if (result && result.success) {
                	//                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                	//                                    	//  set property values
                	//                                    	config.caseInfoDetails.data.onAppealLimitsRestrictions.rows = result.result.rows;
                	//                                    	$this.initCombo(result.result.rows);
                	//                                	} else {
                	//                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 1);
                	//                                	}
                	//                            	} else {
                	//                                	if (result.message) {
                	//                                    	throw result.message;
                	//                                	} else {
                	//                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 2);
                	//                                	}
                	//                            	}
                	//                        	} else {
                	//                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, $this.configMap().errorSectionCode).replace(/{{CODE}}/, 3);
                	//                        	}
                	//                    	} catch (ex) {
                	//                        	config.checkPermission(ex);
                	//                        	config.references.utility.displayPageMessage(
                	//                            	ex,
                	//                            	config.references.globals.alerts.DANGER.klass,
                	//                            	config.references.globals.alerts.DANGER.color,
                	//                            	false,
                	//                            	$messageControl.empty().selector,
                	//                            	null
                	//                        	);
                	//                    	}
                	//                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.onAppealLimitsRestrictions.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.regCivilAction.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
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
                    	}
                	}
                	return true;
            	}
        	},
        	//  LIMITATIONS OR RESTRICTIONS CURRENTLY IN EFFECT WHILE ON APPEAL TEXTAREA
        	onAppealLimitsRestrictionDetails: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.onAppealLimitsRestrictionDetails,
            	control: function () {
                	return this.configMap().control;
            	},
            	readOnlyControl: function () {
                	return this.configMap().readOnlyControl;
            	},
            	charNumControl: function () {
                	return this.configMap().charNum;
            	},
            	init: function () {
                	this.bind();
            	},
            	reinit: function () {
                	//restore the original "other" value from the database or default value, since we cleared out when we changed value to something other than "other", geesh!
                	if (this.val().length === 0) {
                    	$(this.control()).val(this.dbValue() || this.defaultValue() || "");
                    	section(config).onAppealLimitsRestrictionDetails.control().focus().change().blur();
                	}
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).onAppealLimitsRestrictionDetails;
                	var $readOnlyControl = $this.readOnlyControl();
                	var $charNumControl = $this.charNumControl();
                	$.bg.web.control.comment.ui.init({
                    	value: this.dbValue() || this.defaultValue() || "",
                    	editMode: config.editMode,
                    	control: this.control(),
                    	charNumControl: $charNumControl,
                    	readOnlyControl: $readOnlyControl,
                    	validation: {
                        	errorClass: config.validation.ERROR_CLASS,
                        	maxChars: this.control().attr("maxlength")
                    	},
                    	events: {
                        	onChangeCallback: function (isValid) {
                            	//  update the isDirty indicator and log the changes
                            	config.references.utility.data.dirtyLogger({
                                	dbValue: function () {
                                    	return $this.dbValue();
                                	},
                                	defaultValue: function () {
                                    	return $this.defaultValue();
                                	},
                                	control: function () {
                                    	return $this.control();
                                	},
                                	val: function () {
                                    	return config.references.utility.getString($this.control().val());
                                	}
                            	});
                        	},
                        	onInitCallback: function (control) {
                            	if (config.editMode) {
                                	$this.control().slideDown();
                                	$charNumControl.slideDown();
                                	$readOnlyControl.hide();
                            	} else {
                                	$this.control().hide();
                                	$charNumControl.hide();
                                	var len = $this.val().length;
                                	if (len === 0) {
                                    	$readOnlyControl.hide();
                                	} else {
                                    	if (len < 500) {
                                        	$($readOnlyControl).css({ "height": "", "min-height": "75px" });
                                    	} else if (len < 1000) {
                                        	$($readOnlyControl).css({ "height": "", "min-height": "100px" });
                                    	} else if (len < 1500) {
                                        	$($readOnlyControl).css({ "height": "", "min-height": "125px" });
                                    	} else if (len < 2000) {
                                        	$($readOnlyControl).css({ "height": "", "min-height": "150px" });
                                    	} else if (len < 2500) {
                                        	$($readOnlyControl).css({ "height": "", "min-height": "175px" });
                                    	} else {
                                        	$($readOnlyControl).css({ "height": "200px", "min-height": "200px" });
                                    	}
                                    	$readOnlyControl.css({ "border": "solid 1px #eee" }).slideDown();
                                	}
                            	}
                        	},
                        	onBlurCallback: function () {
                            	$this.isValid();
                        	}
                    	},
                    	utility: $.bg.web.app.common.utility
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.onAppealLimitsRestrictionDetails.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.onAppealLimitsRestrictionDetails.defaultValue;
            	},
            	isRequired: function () {
                	//  required if only the "action taken - principal" is checked and this field is showing
                	//                	return ($(config.disclosure.actionTakenPrincipalCheckedSelector).length > 0) &&
                	//                       	($(config.disclosure.personallyNamedCheckedSelector).length === 0) &&
                	//                       	(this.control().closest(".row").find(".astrisk").css("display") === "inline");
                	return section(config).onAppealLimitsRestrictions.val() === "Y";
            	},
            	isValid: function () {
                	//var $other = section(config).onAppealLimitsRestrictions;
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	//if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                	//  The Appeal To is required if user is Filing DMP, but this is required if "YES" is checked
                	if (config.editMode && this.isRequired()) {
                    	//  no comment
                    	if (this.control().val().length === 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).appendTo(this.charNumControl());
                        	return false;
                    	}
                	}
                	//}
                	if (this.control().data("data-toomanychars")) {
                    	config.references.utility.html({
                        	klass: config.validation.ERROR_CLASS,
                        	text: this.control().data("data-message")
                    	}).appendTo(this.charNumControl().empty());
                    	return false;
                	}
                	return true;
            	}
        	},
        	//  MONTH INITIATED/APPEAL FILED/RESOLVED COMBO
        	filingMonth: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.filingMonth,
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
                            	var monthValue = config.references.utility.getString(config.caseInfoDetails.data.filingMonth.dbValue || config.caseInfoDetails.data.filingMonth.defaultValue);
                            	if (monthValue.length > 0) {
                                	if (!config.editMode) {
                                    	var yearValue = config.references.utility.getString(config.caseInfoDetails.data.filingYear.dbValue || config.caseInfoDetails.data.filingYear.defaultValue);
                                    	if (yearValue != "") {
                                        	var $monthLabel = section(config).filingMonth.control().closest(".row").find(".ms-label");
                                        	//var $yearLabel = section(config).filingYear.control().closest(".row").find(".ms-label").eq(1);
                                        	if ($monthLabel.length > 0) {
                                            	$monthLabel.text($monthLabel.text() + " " + yearValue);
                                            	//$yearLabel.hide();
                                        	}
                                    	}
                                	} else {
                                    	//section(config).filingMonth.isValid();
                                	}
                            	} else {
                                	//section(config).filingMonth.isValid();
                            	}
                            	section(config).filingMonth.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	section(config).filingMonth.isValid();
                            	config.references.utility.data.dirtyLogger(section(config).filingMonth);
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
                	section(config).hideSpinner(section(config).filingMonth.control(), ".row");
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	this.isValid();
                	//section(config).validate();
            	},
            	getData: function () {
                	if (config.caseInfoDetails.data.filingMonth.rows) {
                    	return config.caseInfoDetails.data.filingMonth.rows;
                	} else {
                    	var results;
                    	try {
                        	results = config.references.globals.data.months.rows();
                        	config.caseInfoDetails.data.filingMonth.rows = results;
                    	} catch (ex) {
                        	throw ex;
                    	}
                    	return results;
                	}
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.filingMonth.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.filingMonth.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  we validate both the month and year together and the validation is part of the year control.
                	section(config).filingYear.control().trigger("blur");
            	}
        	},
        	//  YEAR INITIATED/APPEAL FILED/RESOLVED INPUT
        	filingYear: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.filingYear,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).filingYear;
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
                            	config.references.utility.data.dirtyLogger(section(config).filingYear);
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
                	return config.caseInfoDetails.data.filingYear.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.filingYear.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	var selectedMonth = section(config).filingMonth.val();
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
        	//  WERE ANY OF THE FOLLOWING SANCTIONS IMPOSED COMBO
        	sanctionsImposed: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.sanctionsImposed,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.sanctionsImposed.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.sanctionsImposed.rows);
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
                	section(config).hideSpinner(section(config).sanctionsImposed.control(), ".row");
            	},
            	initCombo: function (data) {
                	var $this = this;
                	var $other = section(config).sanctionsImposedOther;
                	config.references.multiselectUI.init({
                    	readOnly: !config.editMode,
                    	readOnlyNothingSelectedValue: config.page.data.noDataValue,
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "multiple",
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
                            	//if ($this.dbValue() === "OTHER") {
                            	if ($.inArray("OTHER", config.references.utility.getString($this.dbValue()).split(",")) > -1) {
                                	$this.control().closest(".row").find(".other-container").show();
                                	if (!config.editMode) {
                                    	$this.control().closest(".row").find(".ms-label").hide();
                                	}
                            	}
                            	$this.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	config.references.utility.data.dirtyLogger($this);
                            	if ($.inArray("OTHER", $this.val().split(",")) > -1) {
                                	$this.control().closest(".row").find(".other-container").show();
                                	$other.reinit();
                            	} else {
                                	$($other.control()).val("");
                                	$other.control().change().blur();
                                	$this.control().closest(".row").find(".other-container").hide();
                            	}
                            	if (checked) {
                                	//if (config.references.utility.getString($(option).val()) === "OTHER") {
                                	//	$this.control().closest(".row").find(".other-container").show();
                                	//	$other.reinit();
                                	//} else {
                                	//	$($other.control()).val("");
                                	//	$other.control().change().blur();
                                	//	$this.control().closest(".row").find(".other-container").hide();
                                	//}
                                	$this.isValid();
                            	} //else {
                            	//  $($other.control()).val("");
                            	//  $other.control().change().blur();
                            	//  $this.control().closest(".row").find(".other-container").hide();
                            	//}
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
                                    	config.caseInfoDetails.data.sanctionsImposed.rows = result.result.rows;
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
                	return config.caseInfoDetails.data.sanctionsImposed.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.sanctionsImposed.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	var $caseStatus = section(config).caseStatus;
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	if ($(config.disclosure.personallyNamedCheckedSelector).length > 0) {
                            	//  if case status is final and current value is empty, then required
                            	if ($caseStatus.val() === this.configMap().requiredCaseStatusValue && this.val().length === 0) {
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
        	//  WERE ANY OF THE FOLLOWING SANCTIONS - OTHER INPUT
        	sanctionsImposedOther: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.sanctionsImposedOther,
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
                    	section(config).sanctionsImposedOther.control().focus().change().blur();
                	}
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).sanctionsImposedOther;
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
                            	config.references.utility.data.dirtyLogger(section(config).sanctionsImposedOther);
                        	},
                        	onBlurCallback: function () {
                            	$this.isValid();
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.sanctionsImposedOther.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.sanctionsImposedOther.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	var $other = section(config).sanctionsImposed;
                	//  remove any previous error message
                	this.control().closest(".other-input").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (($.inArray("OTHER", $other.val().split(",")) > -1) && (this.val().length === 0)) {
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
        	//  validate the section
        	validate: function () {
            	config.caseInfoDetails.astrisks.css({ "display": "inline" });
            	this.regCivilAction.isValid();
            	this.regCivilActionOther.isValid();
            	this.caseNumber.isValid();
            	this.caseStatus.isValid();
            	this.onAppealActionAppeal.isValid();
            	this.onAppealActionAppealOther.isValid();
            	this.onAppealLimitsRestrictions.isValid();
            	this.onAppealLimitsRestrictionDetails.isValid();
            	this.filingMonth.isValid();
            	this.filingYear.isValid();
            	this.sanctionsImposed.isValid();
            	this.sanctionsImposedOther.isValid();
        	}
    	}
	};
	//  public API
	$.bg.web.app.dmp.regulatory.caseinfo.ui = {
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
            	section(localConfig).init();
        	});
    	}
	};
})(jQuery);


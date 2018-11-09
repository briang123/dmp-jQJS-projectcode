(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.criminal === undefined) $.bg.web.app.dmp.criminal = {};
	if ($.bg.web.app.dmp.criminal.caseinfo === undefined) $.bg.web.app.dmp.criminal.caseinfo = {};

	var localConfig = {
    	caseInfoDetails: {
        	data: {
            	filingMonths: {
                	rows: null
            	},
            	filingLocation: {
                	rows: null
            	},
            	states: {
                	rows: null
            	},
            	countries: {
                	rows: null
            	},
            	caseStatus: {
                	rows: null
            	}
        	}
    	}
	};
	// main page object
	var section = function (config) {
    	return {
        	messageControl: function (currentControl) {
            	//currentControl.closest(".section-content").find(".messages");
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
                    	$this.filingLocation.init()
                    	$this.filingLocationOther.init();
                	}, config.timeoutDelay);
                	this.filingMonths.init();
                	this.filingYear.init();
                	this.nameOfCourt.init();
                	setTimeout(function () {
                    	$this.cityCounty.init();
                    	$this.countries.init(); //  countries will init the states
                	}, config.timeoutDelay);
                	this.caseNumber.init();
                	setTimeout(function () {
                    	$this.caseStatus.init();
                	}, config.timeoutDelay);
            	}
        	},
        	//  hide the spinner controls as data is loaded
        	hideSpinner: function (control, closestSelector) {
            	config.hideSpinner(control, closestSelector, config.caseInfoDetails.spinner, config.caseInfoDetails.containerPanelBody, config);
        	},
        	//*** FORMAL CHARGES INFO SECTION
        	//  FILING LOCATION COMBO
        	filingLocation: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.Location,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.filingLocation.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.filingLocation.rows);
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
                	section(config).hideSpinner(section(config).filingLocation.control(), ".row");
            	},
            	initCombo: function (data) {
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
                            	if (config.caseInfoDetails.data.filingLocation.dbValue === "OTHER") {
                                	section(config).filingLocation.control().closest(".row").find(".other-container").show();
                                	if (!config.editMode) {
                                    	section(config).filingLocation.control().closest(".row").find(".ms-label").hide();
                                	}
                            	}
                            	section(config).filingLocation.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	config.references.utility.data.dirtyLogger(section(config).filingLocation);
                            	if (checked) {
                                	if (config.references.utility.getString($(option).val()) === "OTHER") {
                                    	section(config).filingLocation.control().closest(".row").find(".other-container").show();
                                    	section(config).filingLocationOther.reinit();
                                	} else {
                                    	$(section(config).filingLocationOther.control()).val("");
                                    	section(config).filingLocationOther.control().change().blur();
                                    	section(config).filingLocation.control().closest(".row").find(".other-container").hide();
                                	}
                                	section(config).filingLocation.isValid();
                            	} else {
                                	$(section(config).filingLocationOther.control()).val("");
                                	section(config).filingLocationOther.control().change().blur();
                                	section(config).filingLocation.control().closest(".row").find(".other-container").hide();
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
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, config.caseInfoDetails.data.filingLocation.typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.filingLocation.rows = result.result.rows;
                                    	$this.initCombo(result.result.rows);
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "FILING LOCATION").replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "FILING LOCATION").replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "FILING LOCATION").replace(/{{CODE}}/, 3);
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
                	return config.caseInfoDetails.data.filingLocation.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.filingLocation.defaultValue;
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
        	//  OTHER FILING LOCATION
        	filingLocationOther: {
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
                    	section(config).filingLocationOther.control().focus().change().blur();
                	}
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).filingLocationOther;
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
                            	config.references.utility.data.dirtyLogger(section(config).filingLocationOther);
                        	},
                        	onBlurCallback: function () {
                            	$this.isValid();
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.filingLocationOther.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.filingLocationOther.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest(".other-input").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (section(config).filingLocation.val() === "OTHER" && this.val().length === 0) {
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
        	//  FILING MONTHS COMBO
        	filingMonths: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.Months,
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
                            	var monthValue = config.references.utility.getString(config.caseInfoDetails.data.filingMonths.dbValue || config.caseInfoDetails.data.filingMonths.defaultValue);
                            	if (monthValue.length > 0) {
                                	if (!config.editMode) {
                                    	var yearValue = config.references.utility.getString(config.caseInfoDetails.data.filingYear.dbValue || config.caseInfoDetails.data.filingYear.defaultValue);
                                    	if (yearValue != "") {
                                        	var $monthLabel = section(config).filingMonths.control().closest(".row").find(".ms-label");
                                        	//var $yearLabel = section(config).filingYear.control().closest(".row").find(".ms-label").eq(1);
                                        	if ($monthLabel.length > 0) {
                                            	$monthLabel.text($monthLabel.text() + " " + yearValue);
                                            	//$yearLabel.hide();
                                        	}
                                    	}
                                	} else {
                                    	//section(config).filingMonths.isValid();
                                	}
                            	} else {
                                	//section(config).filingMonths.isValid();
                            	}
                            	section(config).filingMonths.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	section(config).filingMonths.isValid();
                            	config.references.utility.data.dirtyLogger(section(config).filingMonths);
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
                	section(config).hideSpinner(section(config).filingMonths.control(), ".row");
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	this.isValid();
                	//section(config).validate();
            	},
            	getData: function () {
                	if (config.caseInfoDetails.data.filingMonths.rows) {
                    	return config.caseInfoDetails.data.filingMonths.rows;
                	} else {
                    	var results;
                    	try {
                        	results = config.references.globals.data.months.rows();
                        	config.caseInfoDetails.data.filingMonths.rows = results;
                    	} catch (ex) {
                        	throw ex;
                    	}
                    	return results;
                	}
            	},
            	dbValue: function () {
                	return config.caseInfoDetails.data.filingMonths.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.filingMonths.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  we validate both the month and year together and the validation is part of the year control.
                	section(config).filingYear.control().trigger("blur");
            	}
        	},
        	//  FILING YEAR INPUT
        	filingYear: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.Year,
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
                    	var selectedMonth = section(config).filingMonths.val();
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
        	//*** COURT INFO SECTION
        	//  NAME OF COURTY INPUT
        	nameOfCourt: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.CourtName,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).nameOfCourt;
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
                            	section(config).hideSpinner(section(config).nameOfCourt.control(), ".row");
                        	},
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger(section(config).nameOfCourt);
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
                	return config.caseInfoDetails.data.courtName.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.courtName.defaultValue;
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
                            	if (this.val().length == 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertBefore(this.control().closest("div").find("br:first"));
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
                                	}).insertBefore(this.control().closest("div").find("br:first"));
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
        	//  CITY OR COUNTY INPUT
        	cityCounty: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.CityCounty,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).cityCounty;
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
                            	section(config).hideSpinner(section(config).cityCounty.control(), "div");
                        	},
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger(section(config).cityCounty);
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
                	return config.caseInfoDetails.data.cityCounty.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.cityCounty.defaultValue;
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
                            	if (this.val().length === 0 && section(config).countries.val() === "US") {
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
        	//  STATES COMBO
        	states: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.States,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.states.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.states.rows);
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
                	section(config).hideSpinner(section(config).states.control(), "div");
            	},
            	initCombo: function (data) {
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
                        	dataSource: data,
                        	displayColumn: this.configMap().text,
                        	valueColumn: this.configMap().value,
                        	defaultValue: this.dbValue() || this.defaultValue()
                    	},
                    	events: {
                        	onInitCallback: function (msConfig) {
                            	section(config).states.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	if (checked) {
                                	section(config).states.isValid();
                            	}
                            	config.references.utility.data.dirtyLogger(section(config).states);
                        	}
                    	}
                	});
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	this.isValid(); // section(config).validate();
            	},
            	getData: function () {
                	var $messageControl = config.caseInfoDetails.containerPanelBody.find("#case_info_court_info_messages");
                	var $this = this;
                	config.data.dmpHandler.getStates(config.token, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.states.rows = result.result.rows;
                                    	$this.initCombo(result.result.rows);
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "US STATES").replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "US STATES").replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "US STATES").replace(/{{CODE}}/, 3);
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
                	return config.caseInfoDetails.data.states.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.states.defaultValue;
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
                            	if (this.val().length === 0 && section(config).countries.val() === "US") {
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
        	//  COUNTRIES COMBO
        	countries: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "list", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.Countries,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.caseInfoDetails.data.countries.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                        	section(config).states.reinit();
                    	} else {
                        	this.initCombo(config.caseInfoDetails.data.countries.rows);
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
                	section(config).hideSpinner(section(config).countries.control(), "div");
            	},
            	initCombo: function (data) {
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
                        	dataSource: data,
                        	displayColumn: this.configMap().text,
                        	valueColumn: this.configMap().value,
                        	defaultValue: this.dbValue() || this.defaultValue()
                    	},
                    	events: {
                        	onInitCallback: function (msConfig) {
                            	section(config).countries.finalize();
                        	},
                        	onBindCallback: function (data) {
                            	section(config).states.init();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	config.references.utility.data.dirtyLogger(section(config).countries);
                            	if (checked) {
                                	if (config.references.utility.getString($(option).val()) === section(config).countries.defaultValue()) {
                                    	//  if city or county field is empty, then it's required, b/c the US is selected.
                                    	if (section(config).cityCounty.val().length === 0) {
                                        	config.caseInfoDetails.doubleAstrisks.css({ "display": "inline" });
                                    	}
                                    	config.references.multiselectUI.disableMultiselect(section(config).states.control(), false);
                                    	section(config).states.reinit();
                                	} else {
                                    	if (!section(config).states.control().prop("disabled")) {
                                        	config.references.multiselectUI.disableMultiselect(section(config).states.control(), true);
                                        	section(config).states.clearSelection();
                                        	section(config).states.control().multiselect("deselect", "", true);
                                    	}
                                	}
                                	section(config).countries.isValid();
                            	} else {
                                	if (!section(config).states.control().prop("disabled")) {
                                    	config.references.multiselectUI.disableMultiselect(section(config).states.control(), true);
                                    	section(config).states.clearSelection();
                                    	section(config).states.control().multiselect("deselect", "", true);
                                	}
                            	}
                        	}
                    	}
                	});
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	this.isValid();
            	},
            	getData: function () {
                	var $messageControl = config.caseInfoDetails.containerPanelBody.find("#case_info_court_info_messages");
                	var $this = this;
                	config.data.dmpHandler.getCountries(config.token, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.countries.rows = result.result.rows;
                                    	$this.initCombo(result.result.rows);
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "COUNTRIES").replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "COUNTRIES").replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "COUNTRIES").replace(/{{CODE}}/, 3);
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
                	return config.caseInfoDetails.data.countries.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.caseInfoDetails.data.countries.defaultValue;
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
        	//*** CASE INFO SECTION
        	//  CASE NUMBER INPUT
        	caseNumber: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.caseInfoDetails.mappings, config.caseInfoDetails.containerId, "input", this.key)[0];
            	},
            	key: config.caseInfoDetails.keys.CaseNumber,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	//config.renderInput(config, section(config).caseNumber);
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
                            	section(config).hideSpinner(section(config).caseNumber.control(), "div");
                        	},
                        	onChangeCallback: function () {
                            	config.references.utility.data.dirtyLogger(section(config).caseNumber);
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
                            	if (this.val().length === 0 && section(config).nameOfCourt.val().length === 0) {
                                	config.references.utility.html({
                                    	klass: config.validation.ERROR_CLASS,
                                    	text: config.validation.messages.REQUIRED
                                	}).insertBefore(this.control().closest("div").find("br:first"));
                                	if (!triggeredByLinkedValidationControl) {
                                    	section(config).nameOfCourt.isValid(true);
                                	}
                                	return false;
                            	} else if (this.val().length > 0 && section(config).nameOfCourt.val().length === 0) {
                                	if (!triggeredByLinkedValidationControl) {
                                    	section(config).nameOfCourt.isValid(true);
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
            	key: config.caseInfoDetails.keys.Status,
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
                            	section(config).caseStatus.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	if (checked) {
                                	section(config).caseStatus.isValid();
                            	}
                            	config.references.utility.data.dirtyLogger(section(config).caseStatus);
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
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, config.caseInfoDetails.data.caseStatus.typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.caseInfoDetails.data.caseStatus.rows = result.result.rows;
                                    	$this.initCombo(result.result.rows);
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CASE STATUS").replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CASE STATUS").replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CASE STATUS").replace(/{{CODE}}/, 3);
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
        	//  validate the section
        	validate: function () {
            	config.caseInfoDetails.astrisks.css({ "display": "inline" });
            	this.filingLocation.isValid();
            	this.filingLocationOther.isValid();
            	this.filingMonths.isValid();
            	this.filingYear.isValid();
            	this.nameOfCourt.isValid();
            	this.cityCounty.isValid();
            	this.states.isValid();
            	this.countries.isValid();
            	this.caseNumber.isValid();
            	this.caseStatus.isValid();
            	//  if city or county field is empty, then it's required, b/c the US is selected.
            	if (this.countries.val() == "US") {
                	config.caseInfoDetails.doubleAstrisks.show();
            	} else {
                	config.caseInfoDetails.doubleAstrisks.hide();
            	}
        	}
    	}
	};
	//  public API
	$.bg.web.app.dmp.criminal.caseinfo.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	section(localConfig).init();
    	}
	};
})(jQuery);
(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.employment === undefined) $.bg.web.app.dmp.employment = {};
	if ($.bg.web.app.dmp.employment.disclosure === undefined) $.bg.web.app.dmp.employment.disclosure = {};
	
	var localConfig = {
    	empDiscDetails: {
        	data: {
            	termMonth: {
                	rows: null
            	},
            	natureTerm: {
                	rows: null
            	}
        	}
    	}
	};
	
	// main page object
	var section = function (config) {
    	return {
        	messageControl: function (currentControl) {
            	return config.empDiscDetails.messageControl;
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
                	config.empDiscDetails.containerPanelBody.hide();
                	config.empDiscDetails.spinner.show();
                	//  if editing form, then show the astrisks
                	if (config.editMode) {
                    	config.empDiscDetails.astrisks.css({ "display": "inline" });
                	};
                	this.employerName.init();
                	setTimeout(function () {
                    	$this.natureTerm.init();
                	}, config.timeoutDelay);
                	this.termMonth.init();
                	this.termYear.init();
            	}
        	},
        	//  hide the spinner controls as data is loaded
        	hideSpinner: function (control, closestSelector) {
            	config.hideSpinner(control, closestSelector, config.empDiscDetails.spinner, config.empDiscDetails.containerPanelBody, config);
        	},
        	//  EMPLOYER NAME INPUT
        	employerName: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.empDiscDetails.mappings, config.empDiscDetails.containerId, "input", this.key)[0];
            	},
            	key: config.empDiscDetails.keys.employerName,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).employerName;
                	config.references.inputTextUI.init({
                    	containerId: config.empDiscDetails.containerId,
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
                	return config.empDiscDetails.data.employerName.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.empDiscDetails.data.employerName.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	//  Missing value
                    	if (this.val().length == 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).insertBefore(this.control().closest("div").find("br:first"));
                        	return false;
                    	}

                	}
                	return true;
            	}
        	},
        	//  NATURE OF TERMINATION COMBO
        	natureTerm: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.empDiscDetails.mappings, config.empDiscDetails.containerId, "list", this.key)[0];
            	},
            	key: config.empDiscDetails.keys.natureTerm,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (config.empDiscDetails.data.natureTerm.rows) {
                    	if (config.editMode) {
                        	this.reinit();
                    	} else {
                        	this.initCombo(config.empDiscDetails.data.natureTerm.rows);
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
                            	$this.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	if (checked) {
                                	$this.isValid();
                            	}
                            	config.references.utility.data.dirtyLogger($this);
                        	}
                    	}
                	});
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	section(config).validate();
            	},
            	getData: function () {
                	var $messageControl = this.control().closest(".well").find(".messages");
                	var $this = this;
                	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, this.configMap().typeCode, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	config.empDiscDetails.data.natureTerm.rows = result.result.rows;
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
                	return config.empDiscDetails.data.natureTerm.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.empDiscDetails.data.natureTerm.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                        	//  Missing value
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
        	//  TERMINATION MONTH COMBO
        	termMonth: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.empDiscDetails.mappings, config.empDiscDetails.containerId, "list", this.key)[0];
            	},
            	key: config.empDiscDetails.keys.termMonth,
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
                            	var monthValue = config.references.utility.getString(config.empDiscDetails.data.termMonth.dbValue || config.empDiscDetails.data.termMonth.defaultValue);
                            	if (monthValue.length > 0) {
                                	if (!config.editMode) {
                                    	var yearValue = config.references.utility.getString(config.empDiscDetails.data.termYear.dbValue || config.empDiscDetails.data.termYear.defaultValue);
                                    	if (yearValue != "") {
                                        	var $monthLabel = section(config).termMonth.control().closest(".row").find(".ms-label");
                                        	if ($monthLabel.length > 0) {
                                            	$monthLabel.text($monthLabel.text() + " " + yearValue);
                                        	}
                                    	}
                                	}
                            	}
                            	section(config).termMonth.finalize();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	section(config).termMonth.isValid();
                            	config.references.utility.data.dirtyLogger(section(config).termMonth);
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
                	section(config).hideSpinner(section(config).termMonth.control(), ".row");
            	},
            	clearSelection: function () {
                	this.control().multiselect("deselectAll", false).multiselect("updateButtonText");
                	this.isValid();
            	},
            	getData: function () {
                	if (config.empDiscDetails.data.termMonth.rows) {
                    	return config.empDiscDetails.data.termMonth.rows;
                	} else {
                    	var results;
                    	try {
                        	results = config.references.globals.data.months.rows();
                        	config.empDiscDetails.data.termMonth.rows = results;
                    	} catch (ex) {
                        	throw ex;
                    	}
                    	return results;
                	}
            	},
            	dbValue: function () {
                	return config.empDiscDetails.data.termMonth.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.empDiscDetails.data.termMonth.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  we validate both the month and year together and the validation is part of the year control.
                	section(config).termYear.control().trigger("blur");
            	}
        	},
        	//  TERMINATION YEAR INPUT
        	termYear: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.empDiscDetails.mappings, config.empDiscDetails.containerId, "input", this.key)[0];
            	},
            	key: config.empDiscDetails.keys.termYear,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	this.bind();
            	},
            	bind: function () {
                	//  handle rendering of input or label based on editMode setting
                	var $this = section(config).termYear;
                	config.references.inputTextUI.init({
                    	containerId: config.empDiscDetails.containerId,
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
                            	config.references.utility.data.dirtyLogger(section(config).termYear);
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
                	return config.empDiscDetails.data.termYear.dbValue;
            	},
            	val: function () {
                	return config.references.utility.getString(this.control().val());
            	},
            	defaultValue: function () {
                	return config.empDiscDetails.data.termYear.defaultValue;
            	},
            	isRequired: function () {
                	return (this.control().closest(".row").find(".astrisk").css("display") === "inline");
            	},
            	isValid: function () {
                	//  remove any previous error message
                	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	var selectedMonth = section(config).termMonth.val();
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
            	config.empDiscDetails.astrisks.css({ "display": "inline" });
            	this.termMonth.isValid();
            	this.termYear.isValid();
            	this.employerName.isValid();
            	this.natureTerm.isValid();
        	}
    	}
	};
	//  public API
	$.bg.web.app.dmp.employment.disclosure.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	section(localConfig).init();
    	}
	};
})(jQuery);
(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.criminal === undefined) $.bg.web.app.dmp.criminal = {};
	if ($.bg.web.app.dmp.criminal.charges === undefined) $.bg.web.app.dmp.criminal.charges = {};
	
	var localConfig = {
    	chargeDetails: {
        	editMode: false,
        	data: {
            	validation: {
                	messages: {
                    	FILE_INVALID: "* The section is invalid because there is missing data! CLASSIFICATION, PLEA ENTERED, and DISPOSITION must contain values in the table below."
                	}
            	},
            	model: {
                	trueIndicator: "Y",
                	falseIndicator: "N",
                	tempSortAsc: false,
                	tempSortCol: "DATETIME_SORT",
                	record: {
                    	"DMP_NUMBER": null,             	//  will always be null when adding temp records (new and existing dmp amendments)
                    	"DMP_NUMBER_VERSION": null,     	//  will always be null when adding temp records (new and existing dmp amendments)
                    	"DMP_CHARGE_SEQ_NUM": null,     	//  will be <timestamp>_tmp format for charges created from client
                    	"FORMAL_CHARGE_DESC": null,
                    	"CLASSIFICATION_CODE": null,
                    	"CLASSIFICATION": null,
                    	"CLASSIFICATION_OTHER": null,
                    	"PLEA_ENTERED_CODE": null,
                    	"PLEA_ENTERED": null,
                    	"PLEA_ENTERED_OTHER": null,
                    	"DISPOSITION_CODE": null,
                    	"DISPOSITION": null,
                    	"DISPOSITION_OTHER": null,
                    	"ACTIONS": null,                	//  button html
                    	"CREATE_DATE": null,            	//  create date is updated anytime an insert/update/deletion is made to the record on the client
                    	"DATETIME_SORT": null,          	//  value used for sorting the table
                    	"ACTION_IND": null,             	//  UPDATE (db record updated), INSERT (add/edit temp record), DELETE (db record deleted)
                    	"EDIT_CHARGE": "Y",             	//  temp records can be updated
                    	"DELETE_CHARGE": "Y",           	//  temp records can be deleted
                    	"SAVE_IS_VALID": null,          	//  indicator that current record is valid for saving the dmp
                    	"FILE_IS_VALID": null           	//  indicator that current record is valid for filing the dmp
                	}
            	},
            	modal: {
                	sequence: null,
                	headerText: "",
                	description: {
                    	dbValue: null
                	},
                	classification: {
                    	typeCode: "DMP_CLASIFICATION",
                    	dbValue: null
                	},
                	classificationOther: {
                    	dbValue: null
                	},
                	pleaEntered: {
                    	typeCode: "DMP_PLEA_ENTERED",
                    	dbValue: null
                	},
                	pleaEnteredOther: {
                    	dbValue: null
                	},
                	disposition: {
                    	typeCode: "DMP_DISPOSITION",
                    	dbValue: null
                	},
                	dispositionOther: {
                    	dbValue: null
                	}
            	}
        	}
    	}
	};
	var section = function (config) {
    	return {
        	table: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.containerId, "table", this.key)[0];
            	},
            	key: config.chargeDetails.keys.table.Table,
            	control: function () {
                	return this.configMap().control;
            	},
            	messageControl: function () {
                	return config.chargeDetails.table.messageControl;
            	},
            	init: function () {
                	config.chargeDetails.description.show();
                	if (config.editMode) {
                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                        	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                        	//  validate the charges section
                        	section(config).table.validate();
                    	} else {
                        	var $$modal = section(config).modal;
                        	//  initialize the add charge button if available and edit mode
                        	if ($$modal.opener.addButton.control().length > 0) {
                            	$$modal.opener.addButton.init();
                        	}
                        	// intialize the modal combos
                        	$$modal.chargesClassification.init();
                        	$$modal.chargesPleaEntered.init();
                        	$$modal.chargesDisposition.init();
                    	}
                	}
                	if (config.page.centerColumn.attr("data-button-clicked") !== config.page.keys.File &&
                    	config.page.centerColumn.attr("data-button-clicked") !== config.page.keys.Save) {
                    	//  hide content so we can refresh it
                    	config.chargeDetails.spinner.show();
                    	//  bind the section controls
                    	if (config.chargeDetails.table.initialLoad) {
                        	this.bind();
                    	} else {
                        	this.reinit();
                    	}
                	}
            	},
            	reinit: function () {
                	this.loadDataToGrid();
                	//  update the isDirty indicator and log the changes
                	config.references.utility.data.dirtyLogger({
                    	dbValue: function () {
                        	return null;
                    	},
                    	defaultValue: function () {
                        	return null;
                    	},
                    	control: function () {
                        	return section(config).table.control();
                    	},
                    	val: function () {
                        	var charges = [];
                        	$.each(config.chargeDetails.data.model.rows, function (i, rowData) {
                            	charges.push(rowData.FORMAL_CHARGE_DESC + " (" + rowData.ACTION_IND + ")");
                        	});
                        	$.each(config.chargeDetails.data.model.deletedRows, function (i, rowData) {
                            	charges.push(rowData.FORMAL_CHARGE_DESC + " (" + rowData.ACTION_IND + ")");
                        	});
                        	return charges.join(", ");
                    	}
                	});
            	},
            	bind: function () {
                	this.loadDataToGrid();
            	},
            	descriptionLink: {
                	getHtml: function (args) {
                    	//  create the HTML element and return an object reference to it
                    	var link = $("<a/>", {
                        	href: config.chargeDetails.table.link.href,
                        	text: args.description,
                        	title: args.description,
                        	target: config.chargeDetails.table.link.target
                    	});
                    	return link[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                	}
            	},
            	editButton: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.containerId, "button", this.key)[0];
                	},
                	key: config.chargeDetails.keys.table.Edit,
                	getHtml: function (args) {
                    	//  create the HTML element and return an object reference to it
                    	var button = $("<button/>", {
                        	class: this.configMap().class || "",
                        	title: this.configMap().title || "",
                        	text: this.configMap().text || "",
                        	id: "edit_charge_" + args.sequence,
                        	"data-sequence": args.sequence,
                        	"data-description": args.description,
                        	"data-classification": args.classification,
                        	"data-classification-other": args.classificationOther,
                        	"data-plea-entered": args.pleaEntered,
                        	"data-plea-entered-other": args.pleaEnteredOther,
                        	"data-disposition": args.disposition,
                        	"data-disposition-other": args.dispositionOther
                    	});
                    	//  enable/disable based on security or matter capabilities
                    	button.prop("disabled", !args.enable);
                    	//  return the button html
                    	return button[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                	},
                	bindAll: function () {
                    	//  bind edit button click event for specific row item
                    	$("#" + config.chargeDetails.containerId + " .btn-edit").off("click").on("click", function (e) {
                        	var $this = $(this);
                        	//  prevent page from kicking to top
                        	e.preventDefault();
                        	e.stopPropagation();
                        	//  hide any messages above table
                        	section(config).table.messageControl().empty();
                        	//  set to edit mode
                        	config.chargeDetails.editMode = true;
                        	//  update key edit info
                        	var $$modal = config.chargeDetails.data.modal;
                        	$$modal.sequence = $this.attr("data-sequence");
                        	$$modal.headerText = "Update Charge";
                        	$$modal.description.dbValue = $this.attr("data-description");
                        	$$modal.classification.dbValue = $this.attr("data-classification");
                        	$$modal.classificationOther.dbValue = $this.attr("data-classification-other");
                        	$$modal.pleaEntered.dbValue = $this.attr("data-plea-entered");
                        	$$modal.pleaEnteredOther.dbValue = $this.attr("data-plea-entered-other");
                        	$$modal.disposition.dbValue = $this.attr("data-disposition");
                        	$$modal.dispositionOther.dbValue = $this.attr("data-disposition-other");
                        	//  get reference to modal object
                        	var $modal = section(config).modal;
                        	//  initialize and show the modal window
                        	$modal.init();
                        	$modal.show();
                    	});
                	}
            	},
            	deleteButton: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.containerId, "button", this.key)[0];
                	},
                	key: config.chargeDetails.keys.table.Delete,
                	getHtml: function (args) {
                    	//  create the HTML element and return an object reference to it
                    	var button = $("<button/>", {
                        	class: this.configMap().class || "",
                        	title: this.configMap().title || "",
                        	css: this.configMap().css || "",
                        	text: this.configMap().text || "",
                        	id: "delete_charge_" + args.sequence,
                        	"data-sequence": args.sequence,
                        	"data-description": args.description
                    	});
                    	button.prop("disabled", !args.enable);
                    	return button[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                	},
                	bindAll: function () {
                    	//  bind all delete buttons
                    	$("#" + config.chargeDetails.containerId + " .btn-delete").off("click").on("click", function (e) {
                        	e.preventDefault();
                        	e.stopPropagation();
                        	//  clear out any previous messages
                        	config.chargeDetails.table.messageControl.empty();
                        	var $this = $(this);
                        	var seq = config.references.utility.getString($this.attr("data-sequence"));
                        	var desc = $this.attr("data-description");
                        	//  prompt user for confirmation before deleting
                        	var confirmed = confirm(config.chargeDetails.validation.messages.CONFIRM_DELETE.replace(/{{DESCRIPTION}}/g, desc));
                        	//  if user clicked okay button
                        	if (confirmed == true) {
                            	//  handle the logic delete on the client
                            	var logicalDeleteFromTempRecords = function () {
                                	var $$utility = config.references.utility;
                                	var $$model = config.chargeDetails.data.model;
                                	var success = false;
                                	//  loop data and move deleted row to new array (will concat the array when we're ready to save)
                                	for (var i = $$model.rows.length - 1; i >= 0; i--) {
                                    	//  if we find the right sequenced json record
                                    	if ($$utility.getString($$model.rows[i].DMP_CHARGE_SEQ_NUM) === seq) {
                                        	//  check if the sequence of the record is the database or client (only db records should be moved over to the deletedRows array)
                                        	if ($$utility.getString($$model.rows[i].DMP_CHARGE_SEQ_NUM).indexOf("tmp") == -1) {
                                            	//  update the action indicator notifying server that we need to delete
                                            	$$model.rows[i].ACTION_IND = "DELETE";
                                            	//  update when the record was updated
                                            	var now = new Date();
                                            	$$model.rows[i].CREATE_DATE = $$utility.validation.dates.getFormattedDateTime(now),
                                            	$$model.rows[i].DATETIME_SORT = $$utility.validation.dates.getDateTimeSort(now)
                                            	//  add deleted record to a deleted rows array that we'll later bring back when saving
                                            	$$model.deletedRows.push($$model.rows[i])
                                            	//  remove the deleted row from the main rows object
                                            	$$model.rows.splice(i, 1);
                                        	} else {	//  came from db
                                            	//  just remove the deleted row from the main rows object
                                            	$$model.rows.splice(i, 1);
                                        	}
                                        	//  update data attribute so that it's obtainable when we save/file the dmp
                                        	section(config).table.applyChargesData();
                                        	success = true;
                                        	break;
                                    	}
                                	}
                                	return success;
                            	};
                            	if (logicalDeleteFromTempRecords()) {
                                	config.references.utility.displayPageMessage(
                                    	config.chargeDetails.validation.messages.DELETE_SUCCESSFUL.replace(/{{DESCRIPTION}}/g, desc),
                                    	config.references.globals.alerts.SUCCESS.klass,
                                    	config.references.globals.alerts.SUCCESS.color,
                                    	true,
                                    	config.chargeDetails.table.messageControl.empty().selector,
                                    	null);
                                	//  refresh table
                                	section(config).table.reinit();
                                	return true;
                            	} else {
                                	config.references.utility.displayPageMessage(
                                    	config.chargeDetails.validation.messages.DELETE_FAILED.replace(/{{DESCRIPTION}}/g, desc),
                                    	config.references.globals.alerts.DANGER.klass,
                                    	config.references.globals.alerts.DANGER.color,
                                    	true,
                                    	config.chargeDetails.table.messageControl.empty().selector,
                                    	null);
                                	//  refresh table
                                	section(config).table.reinit();
                                	return false;
                            	}
                        	}
                    	});
                	}
            	},
            	buildTable: function () {
                	var $$model = config.chargeDetails.data.model;
                	var $$table = section(config).table;
                	var $$utility = config.references.utility;
                	//  check if cell is empty
                	var fieldIsEmpty = function (prop) {
                    	var val = $$utility.getString(prop);
                    	return (val === "") || (val.indexOf(config.validation.messages.REQUIRED) > -1);
                	};
                	try {
                    	if ($$model.rows) {
                        	if ($$model.rows.length > 0) {
                            	//  if amending the page
                            	if (config.editMode) {
                                	$.each($$model.rows, function (i, rowData) {
                                    	//  create a place holder html for buttons
                                    	rowData.ACTIONS = "";
                                    	//  build arguments
                                    	var args = {
                                        	sequence: $$utility.getString(rowData.DMP_CHARGE_SEQ_NUM),
                                        	description: $$utility.getString(rowData.FORMAL_CHARGE_DESC),
                                        	classification: $$utility.getString(rowData.CLASSIFICATION_CODE),
                                        	classificationOther: $$utility.getString(rowData.CLASSIFICATION_OTHER),
                                        	pleaEntered: $$utility.getString(rowData.PLEA_ENTERED_CODE),
                                        	pleaEnteredOther: $$utility.getString(rowData.PLEA_ENTERED_OTHER),
                                        	disposition: $$utility.getString(rowData.DISPOSITION_CODE),
                                        	dispositionOther: $$utility.getString(rowData.DISPOSITION_OTHER),
                                        	enable: true
                                    	};
                                    	//  configure edit button
                                    	if (rowData.EDIT_CHARGE === $$model.trueIndicator) {
                                        	rowData.ACTIONS += $$table.editButton.getHtml(args);
                                    	}
                                    	//  configure delete button
                                    	if (rowData.DELETE_CHARGE === $$model.trueIndicator) {
                                        	rowData.ACTIONS += $$table.deleteButton.getHtml(args);
                                    	}
                                    	//  if filing, then cells must not be empty, so give user feedback as to which columns require values
                                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                                        	//  set the invalid text in the cell
                                        	if (fieldIsEmpty(rowData.CLASSIFICATION)) rowData.CLASSIFICATION = config.validation.messages.REQUIRED;
                                        	if (fieldIsEmpty(rowData.PLEA_ENTERED)) rowData.PLEA_ENTERED = config.validation.messages.REQUIRED;
                                        	if (fieldIsEmpty(rowData.DISPOSITION)) rowData.DISPOSITION = config.validation.messages.REQUIRED;
                                    	};
                                    	//  update validation flags for file/save buttons
                                    	rowData.SAVE_IS_VALID = "Y";
                                    	rowData.FILE_IS_VALID = (!fieldIsEmpty(rowData.CLASSIFICATION) && !fieldIsEmpty(rowData.PLEA_ENTERED) && !fieldIsEmpty(rowData.DISPOSITION)) ? "Y" : "N";
                                    	//rowData.FORMAL_CHARGE_DESC = $$table.descriptionLink.getHtml(rowData.DMP_CHARGE_SEQ_NUM, rowData.FORMAL_CHARGE_DESC, "Charge Details");
                                	});
                            	}
                        	}
                        	//  sort and cache the data
                        	$$model.rows = $$utility.loader.json.sort($$model.rows, $$model.tempSortCol, $$model.tempSortAsc);
                        	//  update actions column visibility based on amending or not
                        	var tableMapping = $$utility.mapping.getMappingItem(config.chargeDetails.mappings.table, config.chargeDetails.containerId, "table", "ACTIONS");
                        	tableMapping[0].Visible = config.editMode;
                        	//  bind the plugin with the data
                        	config.references.datatablesUI.init({
                            	containerId: config.chargeDetails.containerId,
                            	tableId: config.chargeDetails.table.id,
                            	mappings: $$utility.mapping.getMappingItem(config.chargeDetails.mappings.table, config.chargeDetails.containerId, "table"),
                            	data: $$model.rows,
                            	export: null,
                            	pageSize: config.chargeDetails.table.pageSize,
                            	events: {
                                	onInitCallback: function (dtConfig) {
                                    	//  bind button events
                                    	if (config.editMode) {
                                        	$$table.deleteButton.bindAll();
                                        	$$table.editButton.bindAll();
                                        	//  initialize the add charge button if available and edit mode
                                        	if (section(config).modal.opener.addButton.control().length > 0) {
                                            	section(config).modal.opener.addButton.init();
                                        	}
                                    	}
                                    	//  hide the grid and related controls if no data; otherwise, show them.
                                    	var $tableContainer = $$table.control().closest(".row");
                                    	var $paginator = $("#" + config.chargeDetails.table.id + "_length");
                                    	var $filter = $("#" + config.chargeDetails.table.id + "_filter");
                                    	if ($$model.rows.length > 0) {
                                        	$tableContainer.slideDown();
                                        	$paginator.slideDown();
                                        	$filter.slideDown();
                                    	} else {
                                        	$tableContainer.slideUp();
                                        	$paginator.find("label").slideUp();
                                        	$filter.slideUp();
                                    	}
                                	},
                                	onRowCallback: function (row, data, index, dtConfig) {
                                    	//  if filing, then cells must not be empty, so give user feedback as to which columns require values
                                    	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File) {
                                        	//  stylize the  cells which have invalid data
                                        	if (fieldIsEmpty(data.CLASSIFICATION)) $("td:eq(1)", row).addClass(config.validation.ERROR_CLASS);
                                        	if (fieldIsEmpty(data.PLEA_ENTERED)) $("td:eq(2)", row).addClass(config.validation.ERROR_CLASS);
                                        	if (fieldIsEmpty(data.DISPOSITION)) $("td:eq(3)", row).addClass(config.validation.ERROR_CLASS);
                                    	};
                                	}
                            	}
                        	});
                        	//  show the section content
                        	config.chargeDetails.containerPanelBody.slideDown();
                    	} else {
                        	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGE DETAILS").replace(/{{CODE}}/, 1);
                    	}
                	} catch (ex) {
                    	$$utility.displayPageMessage(
                        	ex,
                        	config.references.globals.alerts.DANGER.klass,
                        	config.references.globals.alerts.DANGER.color,
                        	false,
                        	$$table.messageControl().empty().selector,
                        	null
                    	);
                	} finally {
                    	config.chargeDetails.spinner.hide();
                    	config.page.centerColumn.trigger(config.page.data.eventHandler.SECTION_LOAD_COMPLETE);
                	}
            	},
            	loadDataToGrid: function () {
                	var $$model = config.chargeDetails.data.model;
                	var $$modal = section(config).modal;
                	var $$table = section(config).table;
                	var $$utility = config.references.utility;
                	try {
                    	//  only call from database during the initial load; otherwise, pull from caches
                    	//  if rows and deletedRows is empty along with the check of the initialLoad flag (if rows is empty, we may have deleted the charges, which gets moved over to deletedRows)
                    	if ($$model.rows.length === 0 && $$model.deletedRows.length === 0) {
                        	//  check to see if we should perform the lookup
                        	if (config.page.info.dmpNumber && config.page.info.dmpNumberVersion) {
                            	//  first time, we get the data from database
                            	config.data.dmpHandler.getChargeDetails(config.token, config.page.info.dmpNumber, config.page.info.dmpNumberVersion, function (response) {
                                	//  validate the response object
                                	if (!response || !response.result || !response.result.result || !response.result.result.rows) {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGE DETAILS").replace(/{{CODE}}/, "LOAD.1");
                                	}
                                	//  set the rows cache with the db data
                                	$$model.rows = response.result.result.rows;
                                	//  construct the table data and related controls
                                	$$table.buildTable();
                                	//  instruct object that data has been loaded initially
                                	config.chargeDetails.table.initialLoad = false;
                            	});
                        	} else {
                            	//  adding DMP
                            	$$table.buildTable();
                        	}
                    	} else {
                        	//  editing DMP
                        	$$table.buildTable();
                    	}
                    	if (config.page.data.showRawData) {
                        	//TODO: TEMPORARY, SHOW THE RAW DATA
                        	setTimeout(function () {
                            	$$table.messageControl().empty().append(config.references.utility.data.jsonSyntaxHighlight($$model)).slideDown();
                        	}, config.timeoutDelay);
                    	}
                	} catch (ex) {
                    	$$utility.displayPageMessage(
                        	ex,
                        	config.references.globals.alerts.DANGER.klass,
                        	config.references.globals.alerts.DANGER.color,
                        	false,
                        	$$table.messageControl().empty().selector,
                        	null
                    	);
                	}
            	},
            	isRequired: function () {
                	return ($(config.disclosure.personallyNamedCheckedSelector).length > 0) &&
                       	(config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File);
            	},
            	validate: function () {
                	//  remove any previous error message
                	config.chargeDetails.description.find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	if (config.chargeDetails.data.model.rows.length == 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).appendTo(config.chargeDetails.description);
                    	}
                    	//  check to see if there are any invalid charges in the table
                    	var hasInvalidCharges = function () {
                        	return $.grep(config.chargeDetails.data.model.rows, function (item, i) {
                            	return (item.FILE_IS_VALID || "Y").toUpperCase() === config.chargeDetails.data.model.falseIndicator;
                        	}).length > 0;
                    	};
                    	//  if invalid charges exist, then reload the table with feedback
                    	if (hasInvalidCharges()) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.chargeDetails.data.validation.messages.FILE_INVALID
                        	}).appendTo(config.chargeDetails.description);
                        	section(config).table.reinit();
                    	}
                	}
            	},
            	applyChargesData: function () {
                	var $$utility = config.references.utility;
                	var $$model = config.chargeDetails.data.model;  // MODAL DATA MODEL
                	//  only return the records which have been modified (if modified the ACTION_IND will not be NULL, but instead will have INSERT, UPDATE, DELETE as the value)
                	var getUpdatedCharges = function () {
                    	return $.grep($$model.rows, function (item, i) {
                        	return item.ACTION_IND || "" !== "";
                    	});
                	};
                	//  update the data attribute so that we can access it when saving/filing dmp
                	//  sort the data in the order updates occurred so they can be processed that way)
                	//  	ie. if we delete record, then change or add record with the same description as
                	//      	deleted record (that's okay), we need to delete the record first, to then
                	//      	allow the update/add to happen
                	config.chargeDetails.container.data("chargesData", $$utility.loader.json.sort(getUpdatedCharges().concat($$model.deletedRows) || [], $$model.tempSortCol, true));
            	}
        	},
        	modal: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "modal", this.key)[0];
            	},
            	key: config.chargeDetails.keys.modal.Modal,
            	control: function () {
                	return this.configMap().control;
            	},
            	messagesControl: function () {
                	return $("#" + config.centerColumnContainerId + " [id='" + config.chargeDetails.modalId + "'] [id='txtValidationSummary_ChargesModal']");
            	},
            	opener: {
                	addButton: {
                    	configMap: function () {
                        	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.containerId, "button", this.key)[0];
                    	},
                    	key: config.chargeDetails.keys.modal.AddCharge,
                    	control: function () {
                        	return this.configMap().control;
                    	},
                    	init: function () {
                        	section(config).modal.opener.addButton.control().show();
                        	this.bind();
                    	},
                    	bind: function () {
                        	//  reconfigure the summary panel above table so that new button is aligned with datatable controls
                        	var $tableSummaryArea = $('#' + config.chargeDetails.containerId + ' [id$=' + config.chargeDetails.table.id + '_length]');
                        	if ($tableSummaryArea.length > 0) {
                            	//  get summary panel reference
                            	var $summaryPanel = $('#' + config.chargeDetails.containerId + ' [id$=' + config.chargeDetails.table.summaryPanelId + ']');
                            	//  move the buttons group inside the table
                            	//  cache the content of the button group into a string variable. Need to rewire the events after detaching.
                            	var btnGroupHtml = config.chargeDetails.table.btnGroupHtml;
                            	//  since we hide the paginator and filter when no data exists in grid, we need to check for summary panel existence first
                            	if ($summaryPanel.length > 0) {
                                	if (!btnGroupHtml) btnGroupHtml = $summaryPanel.html().trim();
                                	$summaryPanel.detach();
                            	}
                            	//  if the button is not yet combined with the paging combo
                            	if ($tableSummaryArea.find(this.control().selector).length === 0) {
                                	$(btnGroupHtml).prependTo($tableSummaryArea.selector);
                                	config.chargeDetails.table.btnGroupHtml = btnGroupHtml;
                            	}
                        	}
                        	$(config.chargeDetails.container.selector + " [id='" + this.configMap().id + "']").off("click").on("click", function (e) {
                            	var $this = $(this);
                            	//  prevent page from kicking to top
                            	e.preventDefault();
                            	e.stopPropagation();
                            	//  update config settings
                            	var $$modal = config.chargeDetails.data.modal;
                            	$$modal.headerText = "Add Charge";
                            	$$modal.sequence = null;
                            	$$modal.description.dbValue = null;
                            	$$modal.classification.dbValue = null;
                            	$$modal.classificationOther.dbValue = null;
                            	$$modal.pleaEntered.dbValue = null;
                            	$$modal.pleaEnteredOther.dbValue = null;
                            	$$modal.disposition.dbValue = null;
                            	$$modal.dispositionOther.dbValue = null;
                            	//  initialize and show modal
                            	var $modal = section(config).modal;
                            	$modal.init();
                            	$modal.show();
                        	});

                    	}
                	}
            	},
            	cancelButton: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "button", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.Cancel,
                	control: function () {
                    	return this.configMap().control;
                	}
            	},
            	saveButton: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "button", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.Save,
                	control: function () {
                    	return this.configMap().control;
                	},
                	enable: function (value) {
                    	section(config).modal.saveButton.control().prop("disabled", !value);
                	}
            	},
            	init: function () {
                	var $modal = section(config).modal;
                	$.bg.web.app.control.modal.ui.init({
                    	modal: $modal.control(),
                    	headerText: config.chargeDetails.data.modal.headerText,
                    	messagesContainer: $modal.messagesControl(),
                    	saveButton: section(config).modal.saveButton.control(),
                    	cancelButton: section(config).modal.cancelButton.control(),
                    	events: {
                        	onShowCallback: function (e, data) {
                            	$modal.bind();
                        	},
                        	onHideCallback: function (e, data) {
                            	$modal.control().find("." + config.validation.ERROR_CLASS).remove();
                            	section(config).table.validate();
                            	$modal.messagesControl().empty();
                        	},
                        	onSaveButtonClickCallback: function (e, modalConfig) {
                            	//REQUIREMENT:
                            	//  FORMAL CHARGE DESCRIPTION IS REQUIRED WHEN FILING OR SAVING DMP
                            	//  OTHER VALUE IS REQUIRED WHEN OTHER SELECTED IN COMBO
                            	//  CLASSIFICATION, PLEA ENTERED, DISPOSITION ARE OPTIONAL FOR SAVE, BUT REQUIRED FOR FILE
                            	//NOTE: WE DO NOT KNOW AT THIS POINT WHETHER THE USER IS GOING TO FILE OR SAVE.
                            	//  THIS SAVE METHOD IS CODED TO MAKE EACH FIELD REQUIRED TO CREATE A CHARGE. IF USER KNOWS HE
                            	//  IS GOING TO SAVE THE DMP, THEN THEY SHOULD NOT CREATE THE CHARGE WITHOUT CREATING A CHARGE
                            	//  TO FILE B/C THEY'RE GOING TO NEED TO COME BACK AND EDIT THE CHARGE BEFORE FILING. IF WE
                            	//  WERE TO ALLOW CLASSIFICATION, PLEA ENTERED, DISPOSITION AS OPTIONAL FIELDS, THEN VALIDATION
                            	//  WOULD NEED TO OCCUR BY LOOPING THROUGH ALL TABLE ROWS AND CHECKING TO SEE IF THESE FIELDS HAD
                            	//  VALUES IN THEM. THIS IS EXTRA WORK (IMO, UNECESSARY) AND WE SHOULD JUST VALIDATE ALL FIELDS AS
                            	//  REQUIRED IN THE MODAL, WHICH IS HOW THIS SAVE BUTTON IS CODED.
                            	e.preventDefault();
                            	e.stopPropagation();
                            	var $$utility = config.references.utility;
                            	var $$modal = config.chargeDetails.data.modal;  // MODAL DATA OBJECTS
                            	var $$model = config.chargeDetails.data.model;  // MODAL DATA MODEL
                            	//  handle the saving of charges on the client
                            	var saveTempRecord = function () {
                                	var result = { success: true, message: "", ex: null, data: null };
                                	var data;
                                	try {
                                    	var now = new Date();
                                    	var data = {
                                        	"DMP_NUMBER": config.page.info.dmpNumber,
                                        	"DMP_NUMBER_VERSION": config.page.info.dmpNumberVersion,
                                        	"DMP_CHARGE_SEQ_NUM": $$modal.sequence ? $$modal.sequence : new Date().getTime() + "_tmp",
                                        	"FORMAL_CHARGE_DESC": $modal.chargesDescription.val(),
                                        	"CLASSIFICATION_CODE": $modal.chargesClassification.val(),
                                        	"CLASSIFICATION": $modal.chargesClassification.val() === "OTHER" ? $modal.chargesClassificationOther.val() : $modal.chargesClassification.text(),
                                        	"CLASSIFICATION_OTHER": $modal.chargesClassificationOther.val(),
                                        	"PLEA_ENTERED_CODE": $modal.chargesPleaEntered.val(),
                                        	"PLEA_ENTERED": $modal.chargesPleaEntered.val() === "OTHER" ? $modal.chargesPleaEnteredOther.val() : $modal.chargesPleaEntered.text(),
                                        	"PLEA_ENTERED_OTHER": $modal.chargesPleaEnteredOther.val(),
                                        	"DISPOSITION_CODE": $modal.chargesDisposition.val(),
                                        	"DISPOSITION": $modal.chargesDisposition.val() === "OTHER" ? $modal.chargesDispositionOther.val() : $modal.chargesDisposition.text(),
                                        	"DISPOSITION_OTHER": $modal.chargesDispositionOther.val(),
                                        	"ACTION_IND": $$modal.sequence ? (($$modal.sequence.indexOf("_tmp") > -1) ? "INSERT" : "UPDATE") : "INSERT",
                                        	"CREATE_DATE": $$utility.validation.dates.getFormattedDateTime(now),
                                        	"DATETIME_SORT": $$utility.validation.dates.getDateTimeSort(now),
                                        	"SAVE_IS_VALID": "Y",
                                        	"FILE_IS_VALID": (($$utility.getString(this.CLASSIFICATION) !== "") && ($$utility.getString(this.PLEA_ENTERED) !== "") || ($$utility.getString(this.DISPOSITION) !== "")) ? "Y" : "N"
                                    	};
                                    	if (!$$modal.sequence) { // adding new record
                                        	var newData = $$utility.mergeOptions($$model.record, data);
                                        	$$model.rows.push(newData);
                                    	} else {	//  editing existing record
                                        	if ($$model.rows.length > 0) {
                                            	for (var i = 0; i < $$model.rows.length; i++) {
                                                	if ($$utility.getString($$model.rows[i]["DMP_CHARGE_SEQ_NUM"]) === $$utility.getString($$modal.sequence)) {
                                                    	$.extend(true, $$model.rows[i], data);
                                                    	break;
                                                	}
                                            	}
                                        	}
                                    	}
                                    	//config.page.centerColumn.removeAttr("data-button-clicked");
                                    	var message = $$modal.sequence ? config.chargeDetails.validation.messages.UPDATE_SUCCESSFUL : config.chargeDetails.validation.messages.INSERT_SUCCESSFUL;
                                    	result = {
                                        	success: true,
                                        	message: message.replace(/{{DESCRIPTION}}/g, data.FORMAL_CHARGE_DESC),
                                        	ex: null,
                                        	data: data
                                    	};
                                	} catch (ex) {
                                    	var message = $$modal.sequence ? config.chargeDetails.validation.messages.UPDATE_FAILED : config.chargeDetails.validation.messages.INSERT_FAILED;
                                    	result = {
                                        	success: false,
                                        	message: message.replace(/{{DESCRIPTION}}/g, data ? $$utility.getString(data.FORMAL_CHARGE_DESC) : ""),
                                        	ex: ex,
                                        	data: data
                                    	};
                                	} finally {
                                    	return result;
                                	}
                            	};
                            	//  check validity of form
                            	if ($modal.control().find("." + config.validation.ERROR_CLASS).length > 0) {
                                	//  invalid
                                	$$utility.displayPageMessage(
                                        	config.chargeDetails.validation.messages.MODAL_FORM_INVALID,
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	false,
                                        	modalConfig.messagesContainer.empty().selector,
                                        	null
                                    	);
                            	} else {	//  valid form
                                	//  check if the charge exists already by checking the formal charge description from the table rows
                                	var chargesThatExists = function (description) {
                                    	return $.grep($$model.rows, function (item, i) {
                                        	return item.FORMAL_CHARGE_DESC.toUpperCase() === description.toUpperCase();
                                    	}).length;
                                	};
                                	//  get the number of charges with the current description name
                                	var charges = chargesThatExists($modal.chargesDescription.val());
                                	//  if we are adding a charge, then if
                                	var doSave = false;
                                	if ($$modal.sequence) { //  editing a charge
                                    	//  if original charges description has been changed, then make sure that the description is not found on another charge
                                    	if (($modal.chargesDescription.dbValue() !== $modal.chargesDescription.val()) && (charges == 0)) {  //  description changed and doesn't match other descriptions
                                        	doSave = true;
                                    	} else if (($modal.chargesDescription.dbValue() === $modal.chargesDescription.val()) && (charges == 1)) {   //  description did not change and we only have one (this one)
                                        	doSave = true;
                                    	}
                                	} else {	//  adding new charge
                                    	doSave = (charges == 0);
                                	};
                                	//  if the charge doesn't already exist, then we save it.
                                	if (doSave) {
                                    	//  save the record
                                    	var results = saveTempRecord();
                                    	//  check the results of the save
                                    	if (results.success) {
                                        	//  update user with success message above table
                                        	$$utility.displayPageMessage(
                                            	results.message,
                                            	config.references.globals.alerts.SUCCESS.klass,
                                            	config.references.globals.alerts.SUCCESS.color,
                                            	true,
                                            	config.chargeDetails.table.messageControl.empty().selector,
                                            	null
                                        	);
                                        	//  update data attribute so that it's obtainable when we save/file the dmp
                                        	section(config).table.applyChargesData();
                                        	//  refresh table
                                        	section(config).table.reinit();
                                        	//  close the modal window
                                        	setTimeout(function () {
                                            	$modal.hide();
                                        	}, 200);
                                    	} else {
                                        	//  an error occurred, so we display message in modal
                                        	$$utility.displayPageMessage(
                                            	results.message,
                                            	config.references.globals.alerts.DANGER.klass,
                                            	config.references.globals.alerts.DANGER.color,
                                            	false,
                                            	modalConfig.messagesContainer.empty().selector,
                                            	null
                                        	);
                                    	}
                                	} else {
                                    	//  the charge already exists, so we display message in modal
                                    	$$utility.displayPageMessage(
                                        	config.chargeDetails.validation.messages.CHARGE_EXISTS.replace(/{{DESCRIPTION}}/g, $modal.chargesDescription.val()),
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	false,
                                        	modalConfig.messagesContainer.empty().selector,
                                        	null
                                    	);
                                	}
                            	}
                        	},
                        	onCancelButtonClickCallback: function (e, modalConfig) { }
                    	}
                	});
            	},
            	show: function () {
                	$.bg.web.app.control.modal.ui.show(this.control());
            	},
            	hide: function () {
                	$.bg.web.app.control.modal.ui.hide(this.control());
            	},
            	hideSpinner: function (control, closestSelector) {
                	control.closest(closestSelector).find(".spinner").hide();
            	},
            	bind: function () {
                	this.chargesDescription.init();
                	this.chargesClassification.init();
                	this.chargesPleaEntered.init();
                	this.chargesDisposition.init();
            	},
            	//  MODAL CHARGES DESCRIPTION INPUT
            	chargesDescription: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "input", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.Description,
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
                        	section(config).modal.chargesDescription.control().keyup();
                    	}
                	},
                	bind: function () {
                    	var $this = section(config).modal.chargesDescription;
                    	config.references.inputTextUI.init({
                        	containerId: config.chargeDetails.modalId,
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
                            	onInitCallback: function (e) {
                                	section(config).modal.saveButton.enable($this.isValid());
                                	$this.control().focus();
                            	},
                            	onChangeCallback: function (e) { },
                            	onBlurCallback: function (e) {
                                	section(config).modal.saveButton.enable($this.isValid());
                            	}
                        	},
                        	utility: config.references.utility
                    	});
                	},
                	dbValue: function () {
                    	return config.chargeDetails.data.modal.description.dbValue;
                	},
                	val: function () {
                    	return config.references.utility.getString(this.control().val());
                	},
                	defaultValue: function () {
                    	return "";
                	},
                	isRequired: function () {
                    	return true;
                	},
                	isValid: function () {
                    	//  remove any previous error message
                    	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                    	if (this.isRequired() && this.val().length === 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                    	return true;
                	}
            	},
            	//  MODAL CHARGES CLASSIFICATION COMBO
            	chargesClassification: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "list", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.Classification,
                	control: function () {
                    	return this.configMap().control;
                	},
                	init: function () {
                    	if (config.chargeDetails.data.modal.classification.rows) {
                        	this.initCombo(config.chargeDetails.data.modal.classification.rows);
                    	} else {
                        	this.getData();
                    	}
                	},
                	finalize: function () {
                    	section(config).modal.hideSpinner(section(config).modal.chargesClassification.control(), ".row");
                	},
                	initCombo: function (data) {
                    	config.references.multiselectUI.init({
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
                                	var $$utility = config.references.utility;
                                	var $$modal = section(config).modal;
                                	section(config).modal.chargesClassification.control().data("data-bind", true);
                                	section(config).modal.chargesClassificationOther.init();
                                	var $otherContainer = $$modal.chargesClassification.control().closest(".row").find(".other-container");
                                	var $otherInput = section(config).modal.chargesClassificationOther.control();
                                	if ($$utility.getString($$modal.chargesClassification.val()) === "OTHER") {
                                    	$otherContainer.show();
                                    	section(config).modal.chargesClassificationOther.reinit();
                                	} else {
                                    	$otherContainer.hide();
                                    	$otherInput.val("");
                                    	$$modal.chargesClassification.isValid();
                                	}
                            	},
                            	onChangeCallback: function (option, checked) {
                                	var $$utility = config.references.utility;
                                	var $$modal = section(config).modal;
                                	var $otherContainer = $$modal.chargesClassification.control().closest(".row").find(".other-container");
                                	var $otherInput = section(config).modal.chargesClassificationOther.control();
                                	if (checked) {
                                    	if ($$utility.getString($$modal.chargesClassification.val()) === "OTHER") {
                                        	$otherContainer.show();
                                        	section(config).modal.chargesClassificationOther.reinit();
                                        	$otherInput.focus();
                                    	} else {
                                        	$otherContainer.hide();
                                        	$otherInput.val("");
                                        	section(config).modal.saveButton.enable($$modal.chargesClassification.isValid());
                                    	}
                                	} else {
                                    	$otherContainer.hide();
                                    	$otherInput.val("");
                                    	section(config).modal.saveButton.enable($$modal.chargesClassification.isValid());
                                	}
                                	$$modal.chargesClassification.isValid();
                            	}
                        	}
                    	});
                	},
                	getData: function () {
                    	var $this = this;
                    	if (!config.chargeDetails.data.modal.classification.rows) {
                        	var $messageControl = section(config).modal.messagesControl();
                        	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, config.chargeDetails.data.modal.classification.typeCode, function (response) {
                            	try {
                                	if (response) {
                                    	var result = response.result;
                                    	if (result && result.success) {
                                        	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                            	//  set property values
                                            	config.chargeDetails.data.modal.classification.rows = result.result.rows;
                                            	$this.initCombo(result.result.rows);
                                            	$this.finalize();
                                        	} else {
                                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES CLASSIFICATION").replace(/{{CODE}}/, 1);
                                        	}
                                    	} else {
                                        	if (result.message) {
                                            	throw result.message;
                                        	} else {
                                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES CLASSIFICATION").replace(/{{CODE}}/, 2);
                                        	}
                                    	}
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES CLASSIFICATION").replace(/{{CODE}}/, 3);
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
                                	section(config).modal.chargesClassification.finalize();
                            	}
                        	});
                    	} else {
                        	$this.initCombo(config.chargeDetails.data.modal.classification.rows);
                        	$this.finalize();
                    	}
                	},
                	dbValue: function () {
                    	return config.chargeDetails.data.modal.classification.dbValue;
                	},
                	val: function () {
                    	return config.references.utility.getString(this.control().val());
                	},
                	text: function () {
                    	return config.references.utility.getString(this.control().find("option:selected").text());
                	},
                	defaultValue: function () {
                    	return "";
                	},
                	isValid: function () {
                    	//  remove any previous error message
                    	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                    	return true;
                	}
            	},
            	//  MODAL CHARGES CLASSIFICATION OTHER INPUT
            	chargesClassificationOther: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "input", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.ClassificationOther,
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
                        	section(config).modal.chargesClassificationOther.control().change().blur();
                    	}
                	},
                	bind: function () {
                    	var $this = section(config).modal.chargesClassificationOther;
                    	config.references.inputTextUI.init({
                        	containerId: config.chargeDetails.modalId,
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
                            	onChangeCallback: function () { },
                            	onBlurCallback: function () {
                                	section(config).modal.saveButton.enable($this.isValid());
                            	}
                        	},
                        	utility: config.references.utility
                    	});
                	},
                	dbValue: function () {
                    	return config.chargeDetails.data.modal.classificationOther.dbValue;
                	},
                	val: function () {
                    	return config.references.utility.getString(this.control().val());
                	},
                	defaultValue: function () {
                    	return "";
                	},
                	isRequired: function () {
                    	return section(config).modal.chargesClassification.val() === "OTHER";
                	},
                	isValid: function () {
                    	//  remove any previous error message
                    	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                    	if (this.isRequired() && this.val().length === 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                    	return true;
                	}
            	},
            	//  MODAL PLEA ENTERED COMBO
            	chargesPleaEntered: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "list", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.PleaEntered,
                	control: function () {
                    	return this.configMap().control;
                	},
                	init: function () {
                    	if (config.chargeDetails.data.modal.pleaEntered.rows) {
                        	this.initCombo(config.chargeDetails.data.modal.pleaEntered.rows);
                    	} else {
                        	this.getData();
                    	}
                	},
                	finalize: function () {
                    	section(config).modal.hideSpinner(section(config).modal.chargesPleaEntered.control(), ".row");
                	},
                	initCombo: function (data) {
                    	config.references.multiselectUI.init({
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
                                	var $$utility = config.references.utility;
                                	var $$modal = section(config).modal;
                                	section(config).modal.chargesPleaEnteredOther.init();
                                	var $otherContainer = $$modal.chargesPleaEntered.control().closest(".row").find(".other-container");
                                	var $otherInput = section(config).modal.chargesPleaEnteredOther.control();
                                	if ($$utility.getString($$modal.chargesPleaEntered.val()) === "OTHER") {
                                    	$otherContainer.show();
                                    	section(config).modal.chargesPleaEnteredOther.reinit();
                                	} else {
                                    	$otherContainer.hide();
                                    	$otherInput.val("");
                                    	$$modal.chargesPleaEntered.isValid();
                                	}
                            	},
                            	onChangeCallback: function (option, checked) {
                                	var $$utility = config.references.utility;
                                	var $$modal = section(config).modal;
                                	var $otherContainer = $$modal.chargesPleaEntered.control().closest(".row").find(".other-container");
                                	var $otherInput = section(config).modal.chargesPleaEnteredOther.control();
                                	if (checked) {
                                    	if ($$utility.getString($$modal.chargesPleaEntered.val()) === "OTHER") {
                                        	$otherContainer.show();
                                        	section(config).modal.chargesPleaEnteredOther.reinit();
                                        	$otherInput.focus();
                                    	} else {
                                        	$otherContainer.hide();
                                        	$otherInput.val("");
                                        	section(config).modal.saveButton.enable($$modal.chargesPleaEntered.isValid());
                                    	}
                                	} else {
                                    	$otherContainer.hide();
                                    	$otherInput.val("");
                                    	section(config).modal.saveButton.enable($$modal.chargesPleaEntered.isValid());
                                	}
                                	$$modal.chargesPleaEntered.isValid();
                            	}
                        	}
                    	});
                	},
                	getData: function () {
                    	var $this = this;
                    	if (!config.chargeDetails.data.modal.pleaEntered.rows) {
                        	var $messageControl = section(config).modal.messagesControl();
                        	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, config.chargeDetails.data.modal.pleaEntered.typeCode, function (response) {
                            	try {
                                	if (response) {
                                    	var result = response.result;
                                    	if (result && result.success) {
                                        	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                            	//  set property values
                                            	config.chargeDetails.data.modal.pleaEntered.rows = result.result.rows;
                                            	$this.initCombo(result.result.rows);
                                            	$this.finalize();
                                        	} else {
                                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES PLEA ENTERED").replace(/{{CODE}}/, 1);
                                        	}
                                    	} else {
                                        	if (result.message) {
                                            	throw result.message;
                                        	} else {
                                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES PLEA ENTERED").replace(/{{CODE}}/, 2);
                                        	}
                                    	}
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES PLEA ENTERED").replace(/{{CODE}}/, 3);
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
                                	section(config).modal.chargesPleaEntered.finalize();
                            	}
                        	});
                    	} else {
                        	$this.initCombo(config.chargeDetails.data.modal.pleaEntered.rows);
                        	$this.finalize();
                    	}
                	},
                	dbValue: function () {
                    	return config.chargeDetails.data.modal.pleaEntered.dbValue;
                	},
                	val: function () {
                    	return config.references.utility.getString(this.control().val());
                	},
                	text: function () {
                    	return config.references.utility.getString(this.control().find("option:selected").text());
                	},
                	defaultValue: function () {
                    	return "";
                	},
                	isValid: function () {
                    	//  remove any previous error message
                    	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                    	return true;
                	}
            	},
            	//  MODAL CHARGES PLEA ENTERED OTHER INPUT
            	chargesPleaEnteredOther: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "input", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.PleaEnteredOther,
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
                        	section(config).modal.chargesPleaEnteredOther.control().change().blur();
                    	}
                	},
                	bind: function () {
                    	var $this = section(config).modal.chargesPleaEnteredOther;
                    	config.references.inputTextUI.init({
                        	containerId: config.chargeDetails.modalId,
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
                            	onChangeCallback: function () { },
                            	onBlurCallback: function () {
                                	section(config).modal.saveButton.enable($this.isValid());
                            	}
                        	},
                        	utility: config.references.utility
                    	});
                	},
                	dbValue: function () {
                    	return config.chargeDetails.data.modal.pleaEnteredOther.dbValue;
                	},
                	val: function () {
                    	return config.references.utility.getString(this.control().val());
                	},
                	defaultValue: function () {
                    	return "";
                	},
                	isRequired: function () {
                    	return section(config).modal.chargesPleaEntered.val() === "OTHER";
                	},
                	isValid: function () {
                    	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                    	if (this.isRequired() && this.val().length === 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                    	return true;
                	}
            	},
            	//  MODAL DISPOSITION COMBO
            	chargesDisposition: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "list", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.Disposition,
                	control: function () {
                    	return this.configMap().control;
                	},
                	init: function () {
                    	if (config.chargeDetails.data.modal.disposition.rows) {
                        	this.initCombo(config.chargeDetails.data.modal.disposition.rows);
                    	} else {
                        	this.getData();
                    	}
                	},
                	finalize: function () {
                    	section(config).modal.hideSpinner(section(config).modal.chargesDisposition.control(), ".row");
                	},
                	initCombo: function (data) {
                    	config.references.multiselectUI.init({
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
                                	var $$utility = config.references.utility;
                                	var $$modal = section(config).modal;
                                	section(config).modal.chargesDispositionOther.init();
                                	var $otherContainer = $$modal.chargesDisposition.control().closest(".row").find(".other-container");
                                	var $otherInput = section(config).modal.chargesDispositionOther.control();
                                	if ($$utility.getString($$modal.chargesDisposition.val()) === "OTHER") {
                                    	$otherContainer.show();
                                    	section(config).modal.chargesDispositionOther.reinit();
                                	} else {
                                    	$otherContainer.hide();
                                    	$otherInput.val("");
                                    	$$modal.chargesDisposition.isValid();
                                	}
                            	},
                            	onChangeCallback: function (option, checked) {
                                	var $$utility = config.references.utility;
                                	var $$modal = section(config).modal;
                                	var $otherContainer = $$modal.chargesDisposition.control().closest(".row").find(".other-container");
                                	var $otherInput = section(config).modal.chargesDispositionOther.control();
                                	if (checked) {
                                    	if ($$utility.getString($$modal.chargesDisposition.val()) === "OTHER") {
                                        	$otherContainer.show();
                                        	section(config).modal.chargesDispositionOther.reinit();
                                        	$otherInput.focus();
                                    	} else {
                                        	$otherContainer.hide();
                                        	$otherInput.val("");
                                        	section(config).modal.saveButton.enable($$modal.chargesDisposition.isValid());
                                    	}
                                	} else {
                                    	$otherContainer.hide();
                                    	$otherInput.val("");
                                    	section(config).modal.saveButton.enable($$modal.chargesDisposition.isValid());
                                	}
                                	$$modal.chargesDisposition.isValid();
                            	}
                        	}
                    	});
                	},
                	getData: function () {
                    	var $this = this;
                    	if (!config.chargeDetails.data.modal.disposition.rows) {
                        	var $messageControl = section(config).modal.messagesControl();
                        	config.data.dmpHandler.getRegLookupTypeDTLRecs(config.token, config.chargeDetails.data.modal.disposition.typeCode, function (response) {
                            	try {
                                	if (response) {
                                    	var result = response.result;
                                    	if (result && result.success) {
                                        	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                            	//  set property values
                                            	config.chargeDetails.data.modal.disposition.rows = result.result.rows;
                                            	$this.initCombo(result.result.rows);
                                            	$this.finalize();
                                        	} else {
                                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES DISPOSITION").replace(/{{CODE}}/, 1);
                                        	}
                                    	} else {
                                        	if (result.message) {
                                            	throw result.message;
                                        	} else {
                                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES DISPOSITION").replace(/{{CODE}}/, 2);
                                        	}
                                    	}
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "CHARGES DISPOSITION").replace(/{{CODE}}/, 3);
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
                                	section(config).modal.chargesDisposition.finalize();
                            	}
                        	});
                    	} else {
                        	$this.initCombo(config.chargeDetails.data.modal.disposition.rows);
                        	$this.finalize();
                    	}
                	},
                	dbValue: function () {
                    	return config.chargeDetails.data.modal.disposition.dbValue;
                	},
                	val: function () {
                    	return config.references.utility.getString(this.control().val());
                	},
                	text: function () {
                    	return config.references.utility.getString(this.control().find("option:selected").text());
                	},
                	defaultValue: function () {
                    	return "";
                	},
                	isValid: function () {
                    	//  remove any previous error message
                    	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                    	return true;
                	}
            	},
            	//  MODAL CHARGES CLASSIFICATION OTHER INPUT
            	chargesDispositionOther: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.chargeDetails.mappings.controls, config.chargeDetails.modalId, "input", this.key)[0];
                	},
                	key: config.chargeDetails.keys.modal.DispositionOther,
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
                        	section(config).modal.chargesDispositionOther.control().change().blur();
                    	}
                	},
                	bind: function () {
                    	var $this = section(config).modal.chargesDispositionOther;
                    	config.references.inputTextUI.init({
                        	containerId: config.chargeDetails.modalId,
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
                            	onChangeCallback: function () { },
                            	onBlurCallback: function () {
                                	section(config).modal.saveButton.enable($this.isValid());
                            	}
                        	},
                        	utility: config.references.utility
                    	});
                	},
                	dbValue: function () {
                    	return config.chargeDetails.data.modal.dispositionOther.dbValue;
                	},
                	val: function () {
                    	return config.references.utility.getString(this.control().val());
                	},
                	defaultValue: function () {
                    	return "";
                	},
                	isRequired: function () {
                    	return section(config).modal.chargesDisposition.val() === "OTHER";
                	},
                	isValid: function () {
                    	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                    	if (this.isRequired() && this.val().length === 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                    	return true;
                	}
            	}
        	}
    	}
	};
	//  public api
	$.bg.web.app.dmp.criminal.charges.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	section(localConfig).table.init();
    	}
	};
})(jQuery);
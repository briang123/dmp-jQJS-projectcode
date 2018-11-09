(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.support === undefined) $.bg.web.app.dmp.support = {};
	if ($.bg.web.app.dmp.support.docs === undefined) $.bg.web.app.dmp.support.docs = {};
	
	var localConfig = {
    	supportDocs: {
        	editMode: false,
        	permission: {
            	canDelete: true,
            	canAdd: true,
            	canUpdate: true
        	},
        	data: {
            	model: {
                	deletedRows: [],
                	rows: [],
                	trueIndicator: "Y",
                	falseIndicator: "N",
                	record: {
                    	"DMP_SUPPORTING_DOC_SEQ_NUM": "",
                    	"DMP_NUMBER": null,
                    	"DOC_DESC": null,
                    	"DOC_FILE_NAME": null
                	}
            	},
            	modal: {
                	sequence: null,
                	headerText: "",
                	description: {
                    	dbValue: null
                	},
                	filename: {
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
                	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.containerId, "table", this.key)[0];
            	},
            	key: config.supportDocs.keys.table.Table,
            	control: function () {
                	return this.configMap().control;
            	},
            	messageControl: function () {
                	return config.supportDocs.table.messageControl;
            	},
            	init: function () {
                	var $description = config.supportDocs.description;
                	$description.html($description.html().replace("{{DESCRIPTION}}", config.supportDocs.data.description)).slideDown();
                	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                    	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                    	//  validate the support docs section
                    	if (config.editMode) {
                        	//section(config).table.validate();
                    	}
                	} else {
                    	//  hide content so we can refresh it
                    	config.supportDocs.containerPanelBody.hide();
                    	config.supportDocs.spinner.show();
                    	if (config.supportDocs.table.initialLoad) {
                        	this.bind();
                    	} else {
                        	this.reinit();
                    	}
                    	//  show the section content and hide the spinner to indicate that it's done loading
                    	config.supportDocs.containerPanelBody.slideDown();
                    	config.supportDocs.spinner.hide();
                    	config.page.centerColumn.trigger(config.page.data.eventHandler.SECTION_LOAD_COMPLETE);
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
                        	var docs = [];
                        	$.each(config.supportDocs.data.model.rows, function (i, rowData) {
                            	//  log it if we made an update
                            	if (config.references.utility.getString(rowData.UPDATED) === config.supportDocs.data.model.trueIndicator) {
                                	docs.push("UPDATE: " + rowData.DOC_DESC);
                            	}
                        	});
                        	//  log all deletions
                        	$.each(config.supportDocs.data.model.deletedRows, function (i, rowData) {
                            	docs.push("DELETE: " + rowData.DOC_DESC);
                        	});
                        	return docs.join(", ");
                    	}
                	});
            	},
            	bind: function () {
                	this.loadDataToGrid();
            	},
            	documentLink: {
                	getHtml: function (args) {
                    	//  create the HTML element and return an object reference to it
                    	var link = $("<a/>", {
                        	class: "btn-view",
                        	href: config.supportDocs.table.link.href,
                        	text: args.filename,
                        	title: args.filename,
                        	target: config.supportDocs.table.link.target,
                        	id: "a_view_doc_" + args.sequence,
                        	"data-sequence": args.sequence,
                        	"data-description": args.description,
                        	"data-filename": args.filename
                    	});
                    	return link[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                	},
                	bindAll: function () {
                    	//  bind edit button click event for specific row item
                    	$("#" + config.supportDocs.containerId + " a.btn-view").off("click").on("click", function (e) {
                        	var downloadFile = function (args) {
                            	try {
                                	//TODO: (JOSE) NEED TO KNOW WHAT PARMS TO PASS (METHOD DOESN'T EXIST YET)
                                	//  obtain the id of the downloadable file
                                	var blob = config.data.dmpHandler.getBlob(args.token, args.sequence).result;
                                	//  if a file exists
                                	if (blob) {
                                    	//TODO: (JOSE) NEED TO MAKE SURE THAT WE HAVE ALL SUPPORTED FILE EXT WORKING WITH THIS.
                                    	//  download the file
                                    	config.references.utility.getFileDownload(blob, args.token);
                                	} else {
                                    	//  handle error when attempting to download
                                    	config.references.utility.displayPageMessage(
                                        	config.supportDocs.validation.messages.FILE_VIEW_FAILED,
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	true,
                                        	section(config).table.messageControl().empty().selector,
                                        	null
                                    	);
                                	}
                            	} catch (ex) {
                                	config.checkPermission(ex);
                                	//  handle exception
                                	config.references.utility.displayPageMessage(
                                    	ex,
                                    	config.references.globals.alerts.DANGER.klass,
                                    	config.references.globals.alerts.DANGER.color,
                                    	true,
                                    	section(config).table.messageControl().empty().selector,
                                    	null
                                	);
                            	}
                        	};
                        	//  prevent the page from kicking back to the top
                        	e.preventDefault();
                        	//  set up arguments
                        	var args = {
                            	token: config.token,
                            	sequence: config.references.utility.getString($(this).attr("data-sequence"))
                        	};
                        	//  download the file
                        	downloadFile(args);
                    	});
                	}
            	},
            	viewButton: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.containerId, "button", this.key)[0];
                	},
                	key: config.supportDocs.keys.table.View,
                	getHtml: function (args) {
                    	//  create the HTML element and return an object reference to it
                    	var button = $("<button/>", {
                        	class: this.configMap().class || "",
                        	title: this.configMap().title || "",
                        	text: this.configMap().text || "",
                        	id: "view_doc_" + args.sequence,
                        	"data-sequence": args.sequence,
                        	"data-description": args.description,
                        	"data-filename": args.filename
                    	});
                    	//  enable/disable based on security or matter capabilities
                    	button.prop("disabled", !args.enable);
                    	//  return the button html
                    	return button[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                	},
                	bindAll: function () {
                    	//  bind edit button click event for specific row item
                    	$("#" + config.supportDocs.containerId + " .btn-view").off("click").on("click", function (e) {
                        	var downloadFile = function (args) {
                            	//  obtain the id of the downloadable file
                            	var blob = config.data.dmpHandler.getBlob(args.token, args.sequence).result;
                            	//  if a file exists
                            	if (blob) {
                                	//  download the file
                                	config.references.utility.getFileDownload(blob, args.token);
                            	} else {
                                	alert("No file found.");
                            	}
                        	};
                        	//  prevent the page from kicking back to the top
                        	e.preventDefault();
                        	var args = {
                            	token: config.token,
                            	sequence: config.references.utility.getString($(this).attr("data-sequence"))
                        	};
                        	downloadFile(args);
                    	});
                	}
            	},
            	editButton: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.containerId, "button", this.key)[0];
                	},
                	key: config.supportDocs.keys.table.Edit,
                	getHtml: function (args) {
                    	//  create the HTML element and return an object reference to it
                    	var button = $("<button/>", {
                        	class: this.configMap().class || "",
                        	title: this.configMap().title || "",
                        	text: this.configMap().text || "",
                        	id: "edit_doc_" + args.sequence,
                        	"data-sequence": args.sequence,
                        	"data-description": args.description,
                        	"data-filename": $(args.filename).length > 0 ? $(args.filename).text() : args.filename
                    	});
                    	//  enable/disable based on security or matter capabilities
                    	button.prop("disabled", !args.enable);
                    	//  return the button html
                    	return button[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                	},
                	bindAll: function () {
                    	//  bind edit button click event for specific row item
                    	$("#" + config.supportDocs.containerId + " .btn-edit").off("click").on("click", function (e) {
                        	var $this = $(this);
                        	//  prevent page from kicking to top
                        	e.preventDefault();
                        	e.stopPropagation();
                        	//  hide any messages above table
                        	section(config).table.messageControl().empty();
                        	//  set to edit mode
                        	config.supportDocs.editMode = true;
                        	//  update key edit info
                        	var $$modal = config.supportDocs.data.modal;
                        	$$modal.sequence = $this.attr("data-sequence");
                        	$$modal.headerText = "Update Document Description";
                        	$$modal.description.dbValue = $this.attr("data-description");
                        	$$modal.filename.dbValue = $this.attr("data-filename");
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
                    	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.containerId, "button", this.key)[0];
                	},
                	key: config.supportDocs.keys.table.Delete,
                	getHtml: function (args) {
                    	//  create the HTML element and return an object reference to it
                    	var button = $("<button/>", {
                        	class: this.configMap().class || "",
                        	title: this.configMap().title || "",
                        	css: this.configMap().css || "",
                        	text: this.configMap().text || "",
                        	id: "delete_doc_" + args.sequence,
                        	"data-sequence": args.sequence,
                        	"data-description": args.description,
                        	"data-filename": $(args.filename).length > 0 ? $(args.filename).text() : args.filename
                    	});
                    	button.prop("disabled", !args.enable);
                    	return button[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                	},
                	bindAll: function () {
                    	//  bind all delete buttons
                    	$("#" + config.supportDocs.containerId + " .btn-delete").off("click").on("click", function (e) {
                        	e.preventDefault();
                        	e.stopPropagation();
                        	//  clear out any previous messages
                        	config.supportDocs.table.messageControl.empty();
                        	var $this = $(this);
                        	var seq = config.references.utility.getString($this.attr("data-sequence"));
                        	var desc = $this.attr("data-description");
                        	var filename = $this.attr("data-filename");
                        	//  prompt user for confirmation before deleting
                        	var confirmed = confirm(config.supportDocs.validation.messages.CONFIRM_DELETE.replace(/{{DESCRIPTION}}/g, desc));
                        	//  if user clicked okay button
                        	if (confirmed == true) {
                            	//  handle the logic delete on the client
                            	var logicalDeleteFromTempRecords = function () {
                                	var $$utility = config.references.utility;
                                	var $$model = config.supportDocs.data.model;
                                	var success = false;
                                	//  loop data and move deleted row to new array (will concat the array when we're ready to save)
                                	for (var i = $$model.rows.length - 1; i >= 0; i--) {
                                    	//  if we find the right sequenced json record
                                    	if ($$utility.getString($$model.rows[i].DMP_SUPPORTING_DOC_SEQ_NUM) === seq) {
                                        	//  check if the sequence of the record is the database or client (only db records should be moved over to the deletedRows array)
                                        	if ($$utility.getString($$model.rows[i].DMP_SUPPORTING_DOC_SEQ_NUM).indexOf("tmp") == -1) {
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
                                        	section(config).table.applySupportDocsData();
                                        	success = true;
                                        	break;
                                    	}
                                	}
                                	return success;
                            	};
                            	//TODO: (TEMPORARY) UPDATE LOGICAL DELETE WITH DB DELETE TO THEN REFRESH THE DATA FROM DB
                            	if (logicalDeleteFromTempRecords()) {
                                	config.references.utility.displayPageMessage(
                                    	config.supportDocs.validation.messages.DELETE_SUCCESSFUL.replace(/{{DESCRIPTION}}/g, desc),
                                    	config.references.globals.alerts.SUCCESS.klass,
                                    	config.references.globals.alerts.SUCCESS.color,
                                    	true,
                                    	config.supportDocs.table.messageControl.empty().selector,
                                    	null
                                	);
                                	//  refresh table
                                	section(config).table.reinit();
                                	return true;
                            	} else {
                                	config.references.utility.displayPageMessage(
                                    	config.supportDocs.validation.messages.DELETE_FAILED.replace(/{{DESCRIPTION}}/g, desc),
                                    	config.references.globals.alerts.DANGER.klass,
                                    	config.references.globals.alerts.DANGER.color,
                                    	true,
                                    	config.supportDocs.table.messageControl.empty().selector,
                                    	null
                                	);
                                	//  refresh table
                                	section(config).table.reinit();
                                	return false;
                            	}
                            	//TODO: (TEMP) DO NOT RUN THIS CODE UNTIL THE BACK END IS DONE
                            	if (true === false) {
                                	//TODO: (JOSE) NEED MORE ARGUMENTS FOR BOTH METHOD CALLS SO THE BACKEND KNOWS WHICH FILE WE'RE DELETING
                                	if (config.supportDocs.permission.canDelete == config.supportDocs.data.model.trueIndicator) { //COMPANY user with Delete capability 408?
                                    	//  try a logical delete for a REG_DMP record by a COMPANY user with Delete capability 408
                                    	config.data.dmpHandler.deleteDmpByCOMPANYUser(config.token, config.page.info.dmpNumber, config.userId, function (response) {
                                        	if (response) {
                                            	var result = response.result;
                                            	if (result.success) {
                                                	config.references.utility.displayPageMessage(
                                                    	config.supportDocs.validation.messages.DELETE_SUCCESSFUL.replace(/{{DESCRIPTION}}/g, desc),
                                                    	config.references.globals.alerts.SUCCESS.klass,
                                                    	config.references.globals.alerts.SUCCESS.color,
                                                    	true,
                                                    	config.supportDocs.table.messageControl.empty().selector,
                                                    	null
                                                	);
                                                	//  refresh table
                                                	section(config).table.reinit();
                                                	return true;
                                            	} else {
                                                	config.references.utility.displayPageMessage(
                                                    	config.supportDocs.validation.messages.DELETE_FAILED.replace(/{{DESCRIPTION}}/g, desc),
                                                    	config.references.globals.alerts.DANGER.klass,
                                                    	config.references.globals.alerts.DANGER.color,
                                                    	true,
                                                    	config.supportDocs.table.messageControl.empty().selector,
                                                    	null
                                                	);
                                                	//  refresh table
                                                	section(config).table.reinit();
                                                	return false;
                                            	}
                                        	}
                                    	});

                                	} else {
                                    	//  try deleting a REG_DMP record by a Firm or FB/FT
                                    	config.data.dmpHandler.deleteDmpByFirmFBFT(config.token, config.page.info.dmpNumber, config.page.info.dmpNumberVersion, config.userId, function (response) {
                                        	if (response) {
                                            	var result = response.result;
                                            	if (result.success) {
                                                	config.references.utility.displayPageMessage(
                                                    	config.supportDocs.validation.messages.DELETE_SUCCESSFUL.replace(/{{DESCRIPTION}}/g, desc),
                                                    	config.references.globals.alerts.SUCCESS.klass,
                                                    	config.references.globals.alerts.SUCCESS.color,
                                                    	true,
                                                    	config.supportDocs.table.messageControl.empty().selector,
                                                    	null
                                                	);
                                                	//  refresh the datatables plugin
                                                	section(config).table.reinit();
                                                	return true;
                                            	} else {
                                                	config.references.utility.displayPageMessage(
                                                    	config.supportDocs.validation.messages.DELETE_FAILED.replace(/{{DESCRIPTION}}/g, desc),
                                                    	config.references.globals.alerts.DANGER.klass,
                                                    	config.references.globals.alerts.DANGER.color,
                                                    	true,
                                                    	config.supportDocs.table.messageControl.empty().selector,
                                                    	null
                                                	);
                                                	//  refresh table
                                                	section(config).table.reinit();
                                                	return false;
                                            	}
                                        	}
                                    	});
                                	}
                            	}
                        	}
                    	});
                	}
            	},
            	buildTable: function () {
                	var $$model = config.supportDocs.data.model;
                	var $$table = section(config).table;
                	var $$utility = config.references.utility;
                	try {
                    	if ($$model.rows) {
                        	if ($$model.rows.length > 0) {
                            	$.each($$model.rows, function (i, rowData) {
                                	//  check if the properties exist
                                	if (rowData.DMP_NUMBER && rowData.DMP_NUMBER_VERSION) {
                                    	//  check if original dmp number is different than temp dmp number (if so, then set both temp dmp number/version to this value)
                                    	if ($$utility.getString(rowData.DMP_NUMBER) !== $$utility.getString(config.page.info.dmpNumber)) {
                                        	//  set tempDMPNumber and tempDMPNumberVersion with the DMP number that does not match the original DMP number
                                        	if (!config.supportDocs.data.model.tempDMPNumber) config.supportDocs.data.model.tempDMPNumber = $$utility.getString(rowData.DMP_NUMBER);
                                        	if (!config.supportDocs.data.model.tempDMPNumberVersion) config.supportDocs.data.model.tempDMPNumberVersion = $$utility.getString(rowData.DMP_NUMBER_VERSION);
                                    	}
                                	}
                                	//  create a place holder html for buttons
                                	rowData.ACTIONS = "";
                                	//  build arguments
                                	var args = {
                                    	sequence: $$utility.getString(rowData.DMP_SUPPORTING_DOC_SEQ_NUM),
                                    	description: $$utility.getString(rowData.DOC_DESC),
                                    	//  get linktext if hyperlink or if not, then get the field text value
                                    	filename: $(rowData.DOC_FILE_NAME).length > 0 ? $(rowData.DOC_FILE_NAME).text() : $$utility.getString(rowData.DOC_FILE_NAME),
                                    	enable: true
                                	};
                                	//  if amending the page
                                	if (config.editMode) {
                                    	//TODO: IF WE MUST HAVE A VIEW BUTTON, THEN HERE WE GO...
                                    	//if (rowData.VIEW_SUPPORTING_DOC === $$model.trueIndicator) {
                                    	//rowData.ACTIONS += $$table.viewButton.getHtml(args);
                                    	//}
                                    	if (rowData.EDIT_SUPPORTING_DOC === $$model.trueIndicator) {
                                        	rowData.ACTIONS += $$table.editButton.getHtml(args);
                                    	}
                                    	if (rowData.DELETE_SUPPORTING_DOC === $$model.trueIndicator) {
                                        	rowData.ACTIONS += $$table.deleteButton.getHtml(args);
                                    	}
                                	}
                                	if (rowData.VIEW_SUPPORTING_DOC === $$model.trueIndicator) {
                                    	rowData.DOC_FILE_NAME = $$table.documentLink.getHtml(args);
                                	}
                            	});
                        	}
                        	//  sort and cache the data
                        	$$model.rows = $$utility.loader.json.sort($$model.rows, "DOC_DESC", true);
                        	//  update actions column visibility based on amending or not
                        	var tableMapping = $$utility.mapping.getMappingItem(config.supportDocs.mappings.table, config.supportDocs.containerId, "table", "ACTIONS");
                        	tableMapping[0].Visible = config.editMode;
                        	//  bind the plugin with the data
                        	config.references.datatablesUI.init({
                            	containerId: config.supportDocs.containerId,
                            	tableId: config.supportDocs.table.id,
                            	mappings: $$utility.mapping.getMappingItem(config.supportDocs.mappings.table, config.supportDocs.containerId, "table"),
                            	data: $$model.rows,
                            	export: null,
                            	pageSize: config.supportDocs.table.pageSize,
                            	events: {
                                	onInitCallback: function (dtConfig) {
                                    	$$table.documentLink.bindAll();
                                    	//  bind button events
                                    	if (config.editMode) {
                                        	$$table.deleteButton.bindAll();
                                        	$$table.editButton.bindAll();
                                        	//  initialize the add charge button if available and edit mode
                                        	if (section(config).modal.opener.addButton.control().length > 0) {
                                            	section(config).modal.opener.addButton.init();
                                        	}
                                    	}
                                    	//  hide the grid and related controls if not data; otherwise, show them.
                                    	var $tableContainer = $$table.control().closest(".row");
                                    	var $paginator = $("#" + config.supportDocs.table.id + "_length");
                                    	var $filter = $("#" + config.supportDocs.table.id + "_filter");
                                    	if ($$model.rows.length > 0) {
                                        	$tableContainer.slideDown();
                                        	$paginator.slideDown();
                                        	$filter.slideDown();
                                    	} else {
                                        	$tableContainer.slideUp();
                                        	$paginator.find("label").slideUp();
                                        	$filter.slideUp();
                                    	}
                                    	config.supportDocs.spinner.hide();
                                	}
                            	}
                        	});
                    	}
                	} catch (ex) {
                    	config.checkPermission(ex);
                    	$$utility.displayPageMessage(
                        	"An error occurred while attempting to build the table data. " + ex,
                        	config.references.globals.alerts.DANGER.klass,
                        	config.references.globals.alerts.DANGER.color,
                        	false,
                        	$$table.messageControl().empty().selector,
                        	null
                    	);
                	}
            	},
            	loadDataToGrid: function () {
                	var $$model = config.supportDocs.data.model;
                	var $$modal = section(config).modal;
                	var $$table = section(config).table;
                	var $$utility = config.references.utility;
                	try {
                    	//  only call from database during the initial load; otherwise, pull from caches
                    	//  NOTE: WE MAY WANT TO PULL FROM DB EVERYTIME IF THERE IS CONCERN ABOUT OTHERS ALSO ENTERING DATA AT SAME TIME (IF SO, REMOVE THIS IF..THEN LOGIC)
                    	if ($$model.rows.length == 0 && config.supportDocs.table.initialLoad === true) {
                        	//  check to see if we should perform the lookup
                        	if (config.page.info.dmpNumber && config.page.info.dmpNumberVersion) {
                            	//  first time, we get the data from database
                            	//$$model.rows = config.data.dmpHandler.getSupportingDocs(config.token, config.page.info.dmpNumber, config.page.info.dmpNumberVersion).result.rows;
                            	config.data.dmpHandler.getSupportingDocs(config.token, config.page.info.dmpNumber, config.page.info.dmpNumberVersion, function (response) {
                                	try {
                                    	//  validate the response object
                                    	if (!response) throw "Invalid supporting documents response.";
                                    	if (!response.result) throw "Invalid supporting documents response.result object.";
                                    	if (!response.result.result) throw "Invalid supporting documents response.result.result object.";
                                    	if (!response.result.result.rows) throw "Invalid supporting documents response.result.result.rows object.";
                                    	//  set the rows cache with the db data
                                    	$$model.rows = response.result.result.rows;
                                    	//  construct the table data and related controls
                                    	$$table.buildTable();
                                    	//  instruct object that data has been loaded initially
                                    	config.supportDocs.table.initialLoad = false;
                                	} catch (ex) {
                                    	config.checkPermission(ex);
                                    	config.references.utility.displayPageMessage(
                                        	ex,
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	false,
                                        	section(config).table.messageControl().empty().selector,
                                        	null
                                    	);
                                	}
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
            	validation: {
                	//  check to see if description is already supplied in table
                	fileDescriptionExists: function (description) {
                    	return $.grep(config.supportDocs.data.model.rows, function (item, i) {
                        	return item.DOC_DESC.toUpperCase() === description.toUpperCase()
                    	}).length > 0;
                	}
            	},
            	applySupportDocsData: function () {
                	var $$utility = config.references.utility;
                	var $$model = config.supportDocs.data.model;  // MODAL DATA MODEL
                	//  update the data attribute so that we can access it when saving/filing dmp
                	//  sort the data in the order updates occurred so they can be processed that way)
                	//  	ie. if we delete record, then change or add record with the same description as
                	//      	deleted record (that's okay), we need to delete the record first, to then
                	//      	allow the update/add to happen
                	config.supportDocs.container.data("supportDocs", $$utility.loader.json.sort($$model.rows.concat($$model.deletedRows), "DOC_DESC", true));
            	}
        	},
        	modal: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.modalId, "modal", this.key)[0];
            	},
            	key: config.supportDocs.keys.modal.Modal,
            	control: function () {
                	return this.configMap().control;
            	},
            	messageControl: function () {
                	return $("#" + config.centerColumnContainerId + " [id='" + config.supportDocs.modalId + "'] [id='txtValidationSummary_DocsModal']");
            	},
            	opener: {
                	addButton: {
                    	configMap: function () {
                        	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.containerId, "button", this.key)[0];
                    	},
                    	key: config.supportDocs.keys.modal.Add,
                    	control: function () {
                        	return this.configMap().control;
                    	},
                    	init: function () {
                        	section(config).modal.opener.addButton.control().show();
                        	this.bind();
                    	},
                    	bind: function () {
                        	//  reconfigure the summary panel above table so that new button is aligned with datatable controls
                        	var $tableSummaryArea = $('#' + config.supportDocs.containerId + ' [id$=' + config.supportDocs.table.id + '_length]');
                        	if ($tableSummaryArea.length > 0) {
                            	//  get summary panel reference
                            	var $summaryPanel = $('#' + config.supportDocs.containerId + ' [id$=' + config.supportDocs.table.summaryPanelId + ']');
                            	//  move the buttons group inside the table
                            	//  cache the content of the button group into a string variable. Need to rewire the events after detaching.
                            	var btnGroupHtml = config.supportDocs.table.btnGroupHtml;
                            	//  since we hide the paginator and filter when no data exists in grid, we need to check for summary panel existence first
                            	if ($summaryPanel.length > 0) {
                                	if (!btnGroupHtml) btnGroupHtml = $summaryPanel.html().trim();
                                	$summaryPanel.detach();
                            	}
                            	$(btnGroupHtml).prependTo($tableSummaryArea.selector);
                            	config.supportDocs.table.btnGroupHtml = btnGroupHtml;
                        	}
                        	$(config.supportDocs.container.selector + " [id='" + this.configMap().id + "']").off("click").on("click", function (e) {
                            	var $this = $(this);
                            	//  prevent page from kicking to top
                            	e.preventDefault();
                            	e.stopPropagation();
                            	//  we are adding, not editing
                            	config.supportDocs.editMode = false;
                            	//  update config settings
                            	var $$modal = config.supportDocs.data.modal;
                            	$$modal.headerText = "Add Supporting Documentation";
                            	$$modal.sequence = null;
                            	$$modal.description.dbValue = null;
                            	$$modal.filename.dbValue = null;
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
                    	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.modalId, "button", this.key)[0];
                	},
                	key: config.supportDocs.keys.modal.Cancel,
                	control: function () {
                    	return this.configMap().control;
                	}
            	},
            	saveButton: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.modalId, "button", this.key)[0];
                	},
                	key: config.supportDocs.keys.modal.Save,
                	control: function () {
                    	return this.configMap().control;
                	},
                	save: function (data) {
                    	try {
                        	//  show the spinner while the file is uploaded
                        	this.control().find(".spinner").show();
                        	var $$utility = config.references.utility;
                        	var $modal = section(config).modal;
                        	var $$modal = config.supportDocs.data.modal;  // MODAL DATA OBJECTS
                        	var $$model = config.supportDocs.data.model;  // MODAL DATA MODEL
                        	//  handle the saving of document info on the client
                        	var saveTempRecord = function () {
                            	var result = { success: true, message: "", ex: null, data: null };
                            	var data;
                            	try {
                                	var data = {
                                    	"DMP_SUPPORTING_DOC_SEQ_NUM": $$modal.sequence ? $$modal.sequence : new Date().getTime() + "_tmp",
                                    	"DMP_NUMBER": null,
                                    	"DOC_DESC": $modal.docDescription.val(),
                                    	"DOC_FILE_NAME": $modal.docFileName.val(),
                                    	"UPDATED": config.supportDocs.data.model.trueIndicator
                                	};
                                	if (!$$modal.sequence) { // adding new record
                                    	var newData = $$utility.mergeOptions($$model.record, data);
                                    	$$model.rows.push(newData);
                                	} else {	//  editing existing record
                                    	if ($$model.rows.length > 0) {
                                        	for (var i = 0; i < $$model.rows.length; i++) {
                                            	if ($$utility.getString($$model.rows[i]["DMP_SUPPORTING_DOC_SEQ_NUM"]) === $$utility.getString($$modal.sequence)) {
                                                	$.extend(true, $$model.rows[i], data);
                                                	break;
                                            	}
                                        	}
                                    	}
                                	}
                                	var message = $$modal.sequence ? config.supportDocs.validation.messages.UPDATE_SUCCESSFUL : config.supportDocs.validation.messages.INSERT_SUCCESSFUL;
                                	result = {
                                    	success: true,
                                    	message: message.replace(/{{DESCRIPTION}}/g, data.DOC_DESC),
                                    	ex: null,
                                    	data: data
                                	};
                            	} catch (ex) {
                                	var message = $$modal.sequence ? config.supportDocs.validation.messages.UPDATE_FAILED : config.supportDocs.validation.messages.INSERT_FAILED;
                                	result = {
                                    	success: false,
                                    	message: message.replace(/{{DESCRIPTION}}/g, data ? $$utility.getString(data.DOC_DESC) : ""),
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
                                	config.supportDocs.validation.messages.MODAL_FORM_INVALID,
                                	config.references.globals.alerts.DANGER.klass,
                                	config.references.globals.alerts.DANGER.color,
                                	false,
                                	section(config).modal.messageControl().empty().selector,
                                	null
                            	);
                        	} else {	//  valid form
                            	//  check to see if description is already supplied in table
                            	var fileDescriptionExists = function (description) {
                                	return $.grep($$model.rows, function (item, i) {
                                    	return item.DOC_DESC.toUpperCase() === description.toUpperCase()
                                	}).length;
                            	}
                            	//  check to see if description is already supplied in table
                            	var fileNameExists = function (filename) {
                                	return $.grep($$model.rows, function (item, i) {
                                    	var docFileName = $(item.DOC_FILE_NAME).length > 0 ? $(item.DOC_FILE_NAME).text() : item.DOC_FILE_NAME;
                                    	return docFileName.toUpperCase() === filename.toUpperCase()
                                	}).length;
                            	}
                            	//  get the number of charges with the current description name
                            	var descriptions = fileDescriptionExists($modal.docDescription.val());
                            	var filenames = fileNameExists($modal.docFileName.val());
                            	//  checking to see if description changed and worth editing
                            	var doSave = false;
                            	if ($$modal.sequence) { //  editing a document
                                	//  if original description has been changed, then make sure that the description is not found on another document
                                	if (($modal.docDescription.dbValue() !== $modal.docDescription.val()) && (descriptions == 0)) {  //  description changed and doesn't match other descriptions
                                    	doSave = true;
                                	} else if (($modal.docDescription.dbValue() === $modal.docDescription.val()) && (descriptions == 1)) {   //  description did not change and we only have one (this one)
                                    	doSave = true;
                                	}
                            	} else {	//  adding new document
                                	doSave = (descriptions == 0 && filenames == 0);
                            	};
                            	//  if the description doesn't already exist, then we save it.
                            	if (doSave) {
                                	//  only upload files when we are adding new documents (edits cannot update file)
                                	//if (!config.supportDocs.editMode) {
                                	if (data) {
                                    	//  save the file and description to database
                                    	setTimeout(function () {
                                        	$.each(data.files, function (index, file) {
                                            	data.submit();
                                        	});
                                    	}, config.timeoutDelay);
                                	}
                                	//TODO: MAY WANT TO REMOVE SAVING THE TEMP RECORD WHEN WE ARE SUCCESSFULLY SAVING TO THE DB
                                	//  USED TO TRACK OUR CHANGES
                                	//  save the temp record
                                	var results = saveTempRecord();
                                	//  check the results of the save
                                	if (results.success) {
                                    	//  update user with success message above table
                                    	$$utility.displayPageMessage(
                                        	results.message,
                                        	config.references.globals.alerts.SUCCESS.klass,
                                        	config.references.globals.alerts.SUCCESS.color,
                                        	true,
                                        	section(config).table.messageControl().empty().selector,
                                        	null
                                    	);
                                    	//  update data attribute so that it's obtainable when we save/file the dmp
                                    	section(config).table.applySupportDocsData();
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
                                        	section(config).modal.messageControl().empty().selector,
                                        	null
                                    	);
                                	}
                            	} else {
                                	if (descriptions > 0 && filenames == 0) {
                                    	//  the description already exists, so we display message in modal
                                    	$$utility.displayPageMessage(
                                        	config.supportDocs.validation.messages.DOC_DESCRIPTION_EXISTS.replace(/{{DESCRIPTION}}/g, $modal.docDescription.val()),
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	false,
                                        	section(config).modal.messageControl().empty().selector,
                                        	null
                                    	);
                                	} else if (filenames > 0 && descriptions == 0) {
                                    	//  the filename already exists, so we display message in modal
                                    	$$utility.displayPageMessage(
                                        	config.supportDocs.validation.messages.DOC_FILENAME_EXISTS,
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	false,
                                        	section(config).modal.messageControl().empty().selector,
                                        	null
                                    	);
                                	} else if (filenames > 0 && descriptions > 0) {
                                    	//  the filename and description already exist, so we display message in modal
                                    	$$utility.displayPageMessage(
                                        	config.supportDocs.validation.messages.DOC_DESC_AND_FILENAME_EXISTS.replace(/{{DESCRIPTION}}/g, $modal.docDescription.val()),
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	false,
                                        	section(config).modal.messageControl().empty().selector,
                                        	null
                                    	);
                                	}
                            	}
                        	}
                    	} catch (ex) {
                        	//  display the exception message
                        	$$utility.displayPageMessage(
                            	ex,
                            	config.references.globals.alerts.DANGER.klass,
                            	config.references.globals.alerts.DANGER.color,
                            	false,
                            	section(config).modal.messageControl().empty().selector,
                            	null
                        	);
                    	} finally {
                        	//  hide the spinner on the button
                        	this.control().find(".spinner").hide();
                    	}
                	}
            	},
            	init: function () {
                	var $modalDocs = section(config).modal;
                	$.bg.web.app.control.modal.ui.init({
                    	modal: $modalDocs.control(),
                    	headerText: config.supportDocs.data.modal.headerText,
                    	messagesContainer: $modalDocs.messageControl(),
                    	saveButton: $modalDocs.saveButton.control(),
                    	cancelButton: $modalDocs.cancelButton.control(),
                    	events: {
                        	onShowCallback: function (e, data) {
                            	$modalDocs.bind();
                        	},
                        	onHideCallback: function (e, data) {
                            	$modalDocs.control().find("." + config.validation.ERROR_CLASS).remove();
                            	$modalDocs.messageControl().empty();
                        	},
                        	onSaveButtonClickCallback: function (e, modalConfig) {
                            	//  if we're adding, then we are using the save button click event handler initialized when a file is attached to the modal
                            	//  if we're editing, then we will call the save button's save method directly from here.
                            	if (config.supportDocs.editMode === true) {
                                	$modalDocs.saveButton.save();
                            	}
                        	},
                        	onCancelButtonClickCallback: function (e, modalConfig) {
                            	//  if false, then we're adding; if true, then we're updating existing support doc
                            	var message = (config.supportDocs.editMode === false) ? config.supportDocs.validation.messages.CONFIRM_CANCEL_ADD : config.supportDocs.validation.messages.CONFIRM_CANCEL_UPDATE;
                            	//  prompt user for confirmation before cancelling
                            	var confirmed = confirm(message);
                            	//  if user clicked okay button
                            	if (confirmed == true) {
                                	$modalDocs.hide();
                            	}
                        	}
                    	}
                	});
            	},
            	show: function () {
                	$.bg.web.app.control.modal.ui.show(this.control());
            	},
            	hide: function () {
                	$.bg.web.app.control.modal.ui.hide(this.control());
            	},
            	bind: function () {
                	this.docDescription.init();
                	this.docFileName.init();
                	//  don't init the plugin when editing the support description (we don't re-upload files in this case)
                	if (config.supportDocs.editMode == false) {
                    	this.fileUpload.init();
                	} else {
                    	//  hide the upload and remove buttons when in edit mode
                    	config.supportDocs.fileUpload.removeFileButton.prop("disabled", true).attr("style", "display:none;");
                    	config.supportDocs.fileUpload.fileUploadButtonContainer.prop("disabled", true).attr("style", "display:none;");
                	}
                	this.validate();
            	},
            	//  FILE UPLOAD PLUGIN
            	fileUpload: {
                	init: function () {
                    	var fileHandlerUrl = config.supportDocs.fileUpload.settings.getFileHandlerUrl();
                    	var errorDiv = config.supportDocs.fileUpload.errorMessageContainer;
                    	config.supportDocs.fileUpload.removeFileButton.prop("disabled", true).attr("style", "display:none;");
                    	config.supportDocs.fileUpload.fileUploadButtonContainer.prop("disabled", false).attr("style", "display:block;");
                    	//Init UploadFile plugin
                    	config.supportDocs.fileUpload.fileUploadButton.fileupload({
                        	url: fileHandlerUrl,
                        	maxFileSize: config.supportDocs.fileUpload.settings.maxFileSize,
                        	//dataType: config.supportDocs.fileUpload.settings.dataType,
                        	acceptFileTypes: config.supportDocs.fileUpload.settings.acceptFileTypes,
                        	autoUpload: config.supportDocs.fileUpload.settings.autoUpload,
                        	done: function (e, data) {
                            	//  hide the remove file button
                            	config.supportDocs.fileUpload.removeFileButton.prop("disabled", true).attr("style", "display:none;");
                            	//  hide the file upload button
                            	config.supportDocs.fileUpload.fileUploadButtonContainer.prop("disabled", true).attr("style", "display:none;");
                            	//  reinit the table data
                            	section(config).table.reinit();
                            	//  hide the modal window
                            	section(config).modal.hide();
                        	},
                        	add: function (e, data) {
                            	var isValid = function () {
                                	var valid = true;
                                	$.each(data.files, function (index, file) {
                                    	//  remove any previous error message
                                    	section(config).modal.docFileName.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                                    	if ($.inArray(file.name.split(".")[1].toUpperCase(), ["PDF", "DOC", "DOCX", "TXT", "TIF"]) == -1) {
                                        	config.references.utility.html({
                                            	klass: config.validation.ERROR_CLASS,
                                            	text: "* The file '" + file.name + "' is invalid. " + config.supportDocs.fileUpload.messages.NOT_SUPPORTED
                                        	}).insertAfter(section(config).modal.docFileName.control());
                                        	valid = false;
                                        	return valid;
                                    	}
                                    	if (file.name.length > config.supportDocs.fileUpload.settings.maxFileNameLength) {
                                        	config.references.utility.html({
                                            	klass: config.validation.ERROR_CLASS,
                                            	text: "* The file name cannot exceed " + config.supportDocs.fileUpload.settings.maxFileNameLength.toString() + " characters."
                                        	}).insertAfter(section(config).modal.docFileName.control());
                                        	valid = false;
                                        	return valid;
                                    	}
                                	});
                                	return valid;
                            	}
                            	if (isValid()) {
                                	//  update the filename now that we've uploaded a file
                                	$.each(data.files, function (index, file) {
                                    	config.supportDocs.fileUpload.fileNameContainer.html(file.name);
                                	});
                                	//  validate the modal window form fields
                                	section(config).modal.validate();
                                	//  set focus to the input so that button clicks operate appropriately
                                	section(config).modal.docDescription.control().focus();
                                	//  show the remove button since we added a file
                                	config.supportDocs.fileUpload.removeFileButton.prop("disabled", false).attr("style", "display:block;");
                                	//  hide the upload button since we added and can only add one at a time
                                	config.supportDocs.fileUpload.fileUploadButtonContainer.prop("disabled", true).attr("style", "display:none;");
                                	//  bind the save button click event handler (will only fire off when config.supportDocs.editMode === false)
                                	section(config).modal.saveButton.control().off("click").on("click", function (e) {
                                    	//  upload the file and save the description
                                    	section(config).modal.saveButton.save(data);
                                	});
                            	} else {
                                	section(config).modal.saveButton.control().prop("disabled", true);
                            	}
                        	},
                        	fail: function (e, data) {
                            	$.each(data.messages, function (index, error) {
                                	alert(error);
                            	});
                        	},
                        	progressall: function (e, data) {
                            	//  hide the spinner since we're done
                            	section(config).modal.saveButton.control().find(".spinner").hide();
                        	},
                        	processfail: function (e, data) {
                            	config.references.utility.displayPageMessage(
                                	data.files[data.index].name + ": " + data.files[data.index].error,
                                	config.references.globals.alerts.DANGER.klass,
                                	config.references.globals.alerts.DANGER.color,
                                	false,
                                	section(config).modal.messageControl().empty().selector,
                                	null
                            	);
                        	}
                    	}).on('fileuploadsubmit', function (e, data) {
                        	//  pass form data along with the file upload
                        	data.formData = {
                            	description: section(config).modal.docDescription.val(),
                            	dmpNumber: config.supportDocs.data.model.tempDMPNumber,
                            	dmpNumberVersion: config.supportDocs.data.model.tempDMPNumberVersion,
                            	dmpType: config.page.info.dmpType,
                            	entityId: config.page.info.targetCUSTOMERID,
                            	entityType: config.page.info.entityType,
                            	token: config.token
                        	};
                    	}).on('fileuploadfail', function (e, data) {
                        	$.each(data.files, function (index, file) {
                            	config.references.utility.displayPageMessage(
                                	config.supportDocs.fileUpload.messages.FILE_UPLOAD_FAILED.replace(/{{FILENAME}}/, file.name),
                                	config.references.globals.alerts.DANGER.klass,
                                	config.references.globals.alerts.DANGER.color,
                                	false,
                                	section(config).modal.messageControl().empty().selector,
                                	null
                            	);
                        	});
                    	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
                    	//  check if remove button click event was bound
                    	if (!config.supportDocs.fileUpload.removeFileButton.attr("data-bind")) {
                        	//  bind the remove button click event
                        	config.supportDocs.fileUpload.removeFileButton.off("click").on("click", function (e) {
                            	//  clear the file name
                            	config.supportDocs.fileUpload.fileNameContainer.html("");
                            	//  set delete flag
                            	config.supportDocs.fileUpload.deletedFlag.val('true');
                            	//  hide the remove button now that we've removed the file
                            	config.supportDocs.fileUpload.removeFileButton.prop("disabled", true).attr('style', 'display:none')
                            	//  show the file upload button
                            	config.supportDocs.fileUpload.fileUploadButtonContainer.prop("disabled", false).attr('style', 'display:block');
                            	//  validate the form
                            	section(config).modal.validate();
                        	});
                        	//  set databind attr so that we don't re-bind it
                        	config.supportDocs.fileUpload.removeFileButton.attr("data-bind", true)
                    	}
                	}
            	},
            	//  MODAL DESCRIPTION INPUT
            	docDescription: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.modalId, "input", this.key)[0];
                	},
                	key: config.supportDocs.keys.modal.Description,
                	control: function () {
                    	return this.configMap().control;
                	},
                	init: function () {
                    	this.bind();
                	},
                	reinit: function () {
                    	//restore the original "other" value from the database or default value, since we cleared out when we changed value to something other than "other", geesh!
                    	if (this.val().length == 0) {
                        	$(this.control()).val(this.dbValue() || this.defaultValue() || "");
                        	section(config).modal.docDescription.control().keyup();
                    	}
                	},
                	bind: function () {
                    	var $this = section(config).modal.docDescription;
                    	config.references.inputTextUI.init({
                        	containerId: config.supportDocs.modalId,
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
                                	section(config).modal.validate();
                                	$this.control().focus();
                            	},
                            	onChangeCallback: function (e) { },
                            	onBlurCallback: function (e) {
                                	section(config).modal.validate();
                            	}
                        	},
                        	utility: config.references.utility
                    	});
                	},
                	dbValue: function () {
                    	return config.supportDocs.data.modal.description.dbValue;
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
                    	//  remove any line breaks
                    	this.control().closest("div").find("br").remove();
                    	//  check for empty value
                    	if (this.val().length == 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                    	//  if adding, then validate description doesn't already exists; otherwise, ignore
                    	if (config.supportDocs.editMode === false) {
                        	if (section(config).table.validation.fileDescriptionExists(this.val())) {
                            	config.references.utility.html({
                                	klass: config.validation.ERROR_CLASS,
                                	text: config.supportDocs.validation.messages.DOC_DESCRIPTION_EXISTS.replace("{{DESCRIPTION}}", this.val())
                            	}).insertAfter($("<br/>").insertAfter(this.control()));
                            	return false;
                        	}
                    	}
                    	//  if editing then check if current value is the same as original value and if so, then user not allowed to save yet
                    	//  only changes to a description can the user save
                    	if (config.supportDocs.editMode === true) {
                        	if (this.val() === (this.dbValue() || this.defaultValue())) {
                            	config.references.utility.html({
                                	klass: config.validation.ERROR_CLASS,
                                	text: ""
                            	}).insertAfter(this.control());
                            	return false
                        	}
                    	}
                    	return true;
                	}
            	},
            	//  MODAL FILENAME LABEL
            	docFileName: {
                	configMap: function () {
                    	return config.references.utility.mapping.getMappingItem(config.supportDocs.mappings.controls, config.supportDocs.modalId, "label", this.key)[0];
                	},
                	key: config.supportDocs.keys.modal.FileName,
                	control: function () {
                    	return this.configMap().control;
                	},
                	init: function () {
                    	if (config.supportDocs.editMode) {
                        	var titleValue = this.dbValue() || this.val();
                        	this.control().attr("title", titleValue).text(this.dbValue());
                    	} else {
                        	this.control().text("");
                    	}
                    	this.isValid();
                	},
                	reinit: function () {
                	},
                	dbValue: function () {
                    	return config.supportDocs.data.modal.filename.dbValue;
                	},
                	val: function () {
                    	return config.references.utility.getString(this.control().text());
                	},
                	isValid: function () {
                    	//  remove any previous error message
                    	this.control().closest("div").find("." + config.validation.ERROR_CLASS).remove();
                    	this.control().closest("div").find("br").remove();
                    	if (this.val().length == 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: "* A supporting document is required. Please click on the Upload File button and upload a document."
                        	}).insertAfter(this.control());
                        	return false;
                    	}
                    	return true;
                	}
            	},
            	validate: function () {
                	this.docDescription.isValid();
                	this.docFileName.isValid();
                	if (this.control().find("." + config.validation.ERROR_CLASS).length > 0) {
                    	section(config).modal.saveButton.control().prop("disabled", true);
                	} else {
                    	section(config).modal.saveButton.control().prop("disabled", false);
                	}
            	}
        	}
    	}
	};
	//public API
	$.bg.web.app.dmp.support.docs.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	section(localConfig).table.init();
    	}
	};
})(jQuery);
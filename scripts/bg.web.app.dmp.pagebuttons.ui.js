(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.pagebuttons === undefined) $.bg.web.app.dmp.pagebuttons = {};
	
	var localConfig = {};
	var buttons = function (config) {
    	return {
        	init: function () {
            	//  initialize the bottom buttons section
            	if (config.editMode === true) {
                	this.saveButton.init();
                	this.fileButton.init();
                	this.cancelButton.init();
                	//TODO: DEVELOPER ONLY (VIEW AUDIT TRAIL OF CHANGES) (REMOVE BEFORE PROD RELEASE)
                	//this.dirtyDataButton.init();
                	if (config.addMode === true) {
                    	config.page.message.buttonActionDescription.html(config.page.data.buttonDescription.newDMP);
                	} else {
                    	config.page.message.buttonActionDescription.html(config.page.data.buttonDescription.amendingDMP);
                	}
            	} else {
                	this.backButton.init();
            	}
            	//  bind the event handlers
            	this.bind();
        	},
        	bind: function () {
            	if (!config.page.centerColumn.attr("buttons-data-bind")) {
                	var $this = this;
                	//  event handler that checks when sections are loading, which is triggered from each section
                	config.page.centerColumn.off(config.page.data.eventHandler.SECTION_LOAD_COMPLETE).on(config.page.data.eventHandler.SECTION_LOAD_COMPLETE, function (e) {
                    	//  get number of sections still loading
                    	var visibleSpinnerLength = function () {
                        	return $("#" + config.centerColumnContainerId + " .panel-heading .spinner").filter(function () {
                            	return this.style.display !== 'none';
                        	}).length;
                    	}
                    	//  if all sections done loading
                    	if (visibleSpinnerLength() === 0) {
                        	//  initialize the bottom buttons section
                        	if (config.editMode === true) {
                            	//  intialize the buttons
                            	$this.fileButton.init();
                            	$this.saveButton.init();
                            	$this.cancelButton.init();
                            	//$this.dirtyDataButton.init();
                            	//  editing dmp
                            	if (!config.addMode) {
                                	//  amend button was clicked
                                	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Amend) {
                                    	setTimeout(function () {
                                        	config.references.utility.displayPageMessage(config.page.data.messages.READY_TO_AMEND, config.references.globals.alerts.INFO.klass, config.references.globals.alerts.INFO.color, true, config.page.message.pageMessage.selector);
                                    	}, config.timeoutDelay);
                                	}
                            	}
                            	//  hide the page message after all the content is loading
                            	config.page.message.pageMessage.empty();
                            	//  show the button container now that all sections have succesfully completed loading
                            	config.page.bottomButtonContainer.slideDown();
                            	//  hide the back button since the cancel will take user to same place
                            	config.page.bottomButtonContainerReadOnly.hide();
                        	} else {
                            	//  show the back button if readonly mode
                            	config.page.bottomButtonContainerReadOnly.slideDown();
                            	//  hide the page message after all the content is loading
                            	config.page.message.pageMessage.empty();
                            	$this.amendButton.init();
                            	//  if an error didn't occur, then go ahead and alert that all sections were loaded successfully; otherwise, keep the error on the page.
                            	if (!config.page.message.pageMessageAlert.hasClass(config.references.globals.alerts.DANGER.klass)) {
                                	setTimeout(function () {
                                    	config.page.message.pageMessage.empty();
                                    	config.references.utility.displayPageMessage(config.page.data.messages.SECTIONS_LOADED, config.references.globals.alerts.INFO.klass, config.references.globals.alerts.INFO.color, true, config.page.message.pageMessage.selector);
                                	}, config.timeoutDelay);
                            	}
                        	}
                    	}
                	});
                	//  event handler that updates page's dirty data indicator
                	config.page.centerColumn.off(config.page.data.eventHandler.PAGE_DATA_CHANGED).on(config.page.data.eventHandler.PAGE_DATA_CHANGED, function (e, data) {
                    	config.page.data.isDirty.log.push(data);
                    	buttons(config).fileButton.control().attr("data-isdirty", true);
                    	buttons(config).saveButton.control().attr("data-isdirty", true);
                    	//buttons(config).dirtyDataButton.control().show();
                	});
                	//  event handler that clears page dirty data indicator
                	config.page.centerColumn.off(config.page.data.eventHandler.DIRTY_DATA_CLEANED).on(config.page.data.eventHandler.DIRTY_DATA_CLEANED, function (e, data) {
                    	if (config.page.data.isDirty.log.length > 0) {
                        	for (var i = config.page.data.isDirty.log.length - 1; i >= 0; i--) {
                            	if (config.page.data.isDirty.log[i]["control"] === data.control) {
                                	config.page.data.isDirty.log.splice(i, 1);
                            	}
                        	}
                        	if (config.page.data.isDirty.log.length == 0) {
                            	buttons(config).fileButton.control().attr("data-isdirty", false);
                            	buttons(config).saveButton.control().attr("data-isdirty", false);
                            	//buttons(config).dirtyDataButton.control().hide();
                            	//alert("All dirty data was removed, so the file and save operations are not valid any longer.");
                        	} else {
                            	//buttons(config).dirtyDataButton.control().show();
                        	}
                    	}
                	});
                	//  set databind flag so we don't rebind
                	config.page.centerColumn.attr("buttons-data-bind", true);
            	}
        	},
        	scrollUpPage: function (padding) {
            	//  gently move the fullscreen view in focus
            	setTimeout(function () {
                	$("body").animatescroll({
                    	scrollSpeed: 400,
                    	padding: padding ? padding : -150,
                    	easing: "easeOutExpo"
                	});
            	}, 300);
        	},
        	save: function (saveType, callback) {
            	var args = config.references.utility.mergeOptions(config.getDefaultSaveObject(config), config.page.data[config.page.info.dmpType.toLowerCase().replace(" ", "") + "SaveObject"](config));
            	var responseHandler = function (response) {
                	try {
                    	//  validate the response object
                    	if (!response || !response.result || !response.result.message) {
                        	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, saveType.toUpperCase() + " DMP").replace(/{{CODE}}/, 1);
                    	}
                    	var result = response.result;
                    	if (result.success) {
                        	var redirectTo = config.page.summaryHref.replace(/{{ENTITY_ID}}/, config.entity.data.id).replace(/{{ENTITY_TYPE}}/, config.page.info.entityType).replace(/{{DMP_TYPE}}/, config.page.info.dmpType);
                        	var message = (saveType.toUpperCase() === "SAVE") ? config.page.data.messages.DMP_SAVE_SUCCESSFUL.replace(/{{HREF}}/, redirectTo) : config.page.data.messages.DMP_FILE_SUCCESSFUL.replace(/{{HREF}}/, redirectTo);
                        	//  show success message just above save button
                        	config.references.utility.displayPageMessage(
                            	message,
                            	config.references.globals.alerts.SUCCESS.klass,
                            	config.references.globals.alerts.SUCCESS.color,
                            	false,
                            	config.page.message.buttonActionMessageContainer.empty().selector,
                            	null
                        	);
                        	//  redirect to the summary page after saving the dmp
                        	if (config.redirectDelay > 0) {
                            	setTimeout(function () {
                                	location.href = redirectTo;
                            	}, config.page.redirectDelay);
                        	} else {
                            	location.href = redirectTo;
                        	}
                    	} else {
                        	if ($.isArray(result.result)) {
                            	//TODO: BUILD LIST OF ERRAPP
                            	//loop result to create <li> of error messages
                            	//throw result.message + $("<ul/>").append("");
                        	} else {
                            	throw result.message;
                        	}
                    	}
                	} catch (ex) {
                    	config.checkPermission(ex);
                    	//  show failure message at top of page
                    	config.references.utility.displayPageMessage(
                        	ex,
                        	config.references.globals.alerts.DANGER.klass,
                        	config.references.globals.alerts.DANGER.color,
                        	false,
                        	config.page.message.pageMessage.empty().selector,
                        	null
                    	);
                    	//  show failure message just above save button
                    	config.references.utility.displayPageMessage(
                        	ex,
                        	config.references.globals.alerts.DANGER.klass,
                        	config.references.globals.alerts.DANGER.color,
                        	true,
                        	config.page.message.buttonActionMessageContainer.empty().selector,
                        	null
                    	);
                    	config.page.justBottomButtons.slideDown();
                    	setTimeout(function () {
                        	buttons(config).scrollUpPage();
                    	}, 500);
                	}
            	};
            	//  hide the buttons and display a message so user know what is going on while the operation is occurring. We don't want users double-clicking on the buttons, so we remove
            	config.page.justBottomButtons.slideUp(function () {
                	var type = saveType.toUpperCase();
                	var message = (type === "SAVE") ? config.page.data.messages.DMP_SAVING : config.page.data.messages.DMP_FILING;
                	//  give feedback to user that some save/file operation is occurring
                	config.references.utility.displayPageMessage(
                    	message,
                    	config.references.globals.alerts.INFO.klass,
                    	config.references.globals.alerts.INFO.color,
                    	false,
                    	config.page.message.buttonActionMessageContainer.empty().selector,
                    	null
                	);
                	//  saving the page data (save or file dmp)
                	if (type === "SAVE") {
                    	config.data.dmpHandler.saveDMP(config.token, args, responseHandler);
                	} else if (type === "FILE") {
                    	config.data.dmpHandler.fileDMP(config.token, args, responseHandler);
                	}
                	if (config.references.utility.callbackExists(callback)) {
                    	callback();
                	}
            	});
        	},
        	fileButton: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.page.buttonMappingData, config.centerColumnContainerId, "button", this.key)[0];
            	},
            	key: config.page.keys.File,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (this.control().length > 0) {
                    	this.bind();
                    	this.control().show();
                	}
            	},
            	bind: function () {
                	if (!this.control().attr("data-bind")) {
                    	this.control().off("click").click(function (e) {
                        	e.preventDefault();
                        	//  set button click to be file button so it can be checked on the init
                        	config.page.centerColumn.attr("data-button-clicked", buttons(config).fileButton.key);
                        	//  hide any previous messages
                        	config.page.message.pageMessage.empty();
                        	//  set visibility of view changes button
                        	//                        	if ($(this).attr("data-isdirty") === "true") {
                        	//                            	buttons(config).dirtyDataButton.control().show();
                        	//                        	} else {
                        	//                            	buttons(config).dirtyDataButton.control().hide();
                        	//                        	}
                        	if ($(this).attr("data-isdirty") === "true") {
                            	//  once the config has been refreshed, run this code
                            	config.page.data.eventHandler.onPageRefreshCallback = function () {
                                	//  if errapp found on the page
                                	if ($(config.page.centerColumn).find("." + config.validation.ERROR_CLASS).length !== 0) {
                                    	//  display error message
                                    	config.references.utility.displayPageMessage(
                                        	config.validation.messages.RESOLVE_PAGE_ERRAPP_BEFORE_ACTION.replace(/{{ACTION}}/, "filing the DMP"),
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	false,
                                        	config.page.message.pageMessage.empty().selector,
                                        	null
                                    	);
                                    	//  show failure message just above save button
                                    	config.references.utility.displayPageMessage(
                                        	config.validation.messages.RESOLVE_PAGE_ERRAPP_BEFORE_ACTION.replace(/{{ACTION}}/, "filing the DMP"),
                                        	config.references.globals.alerts.DANGER.klass,
                                        	config.references.globals.alerts.DANGER.color,
                                        	true,
                                        	config.page.message.buttonActionMessageContainer.empty().selector,
                                        	null
                                    	);
                                    	//  scroll up to view message and prepare to fix
                                    	setTimeout(function () {
                                        	buttons(config).scrollUpPage();
                                    	}, 500);
                                	} else {
                                    	//  file the DMP
                                    	buttons(config).save("FILE");
                                	}

                            	};
                            	//  trigger a page refresh so that the page is validated, then handle the callback
                            	config.page.centerColumn.trigger(config.page.data.eventHandler.REFRESH_PAGE, config);
                            	this.control().attr("data-bind", true);
                        	} else {
                            	alert("No updates made.");
                        	}
                    	});
                	}
            	}
        	},
        	saveButton: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.page.buttonMappingData, config.centerColumnContainerId, "button", this.key)[0];
            	},
            	key: config.page.keys.Save,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	//  if the button exists (visibility set on server)
                	if (this.control().length > 0) {
                    	this.bind();
                    	this.control().show();
                	}
            	},
            	bind: function () {
                	if (!this.control().attr("data-bind")) {
                    	this.control().off("click").click(function (e) {
                        	e.preventDefault();
                        	//  set button click to be save button so it can be checked on the init
                        	config.page.centerColumn.attr("data-button-clicked", buttons(config).saveButton.key);
                        	//  hide any previous messages
                        	config.page.message.pageMessage.empty();
                        	//  set view changes visibility
                        	//                        	if ($(this).attr("data-isdirty") === "true") {
                        	//                            	buttons(config).dirtyDataButton.control().show();
                        	//                        	} else {
                        	//                            	buttons(config).dirtyDataButton.control().hide();
                        	//                        	}
                        	//  once the config has been refreshed, run this code
                        	config.page.data.eventHandler.onPageRefreshCallback = function () {
                            	//  if errapp found on the page
                            	if ($(config.page.centerColumn).find("." + config.validation.ERROR_CLASS).length !== 0) {
                                	//  display error message
                                	config.references.utility.displayPageMessage(
                                    	config.validation.messages.RESOLVE_PAGE_ERRAPP_BEFORE_ACTION.replace(/{{ACTION}}/, "saving the DMP"),
                                    	config.references.globals.alerts.DANGER.klass,
                                    	config.references.globals.alerts.DANGER.color,
                                    	false,
                                    	config.page.message.pageMessage.empty().selector,
                                    	null
                                	);
                                	//  show failure message just above save button
                                	config.references.utility.displayPageMessage(
                                    	config.validation.messages.RESOLVE_PAGE_ERRAPP_BEFORE_ACTION.replace(/{{ACTION}}/, "saving the DMP"),
                                    	config.references.globals.alerts.DANGER.klass,
                                    	config.references.globals.alerts.DANGER.color,
                                    	true,
                                    	config.page.message.buttonActionMessageContainer.empty().selector,
                                    	null
                                	);
                                	//  scroll up to view message and prepare to fix
                                	setTimeout(function () {
                                    	buttons(config).scrollUpPage();
                                	}, 500);
                            	} else {
                                	//  save the DMP
                                	buttons(config).save("SAVE");
                            	}
                        	};
                        	//  trigger a page refresh so that the page is validated, then handle the callback
                        	config.page.centerColumn.trigger(config.page.data.eventHandler.REFRESH_PAGE, config);
                    	});
                    	this.control().attr("data-bind", true);
                	}
            	}
        	},
        	amendButton: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.page.buttonMappingData, config.centerColumnContainerId, "button", this.key)[0];
            	},
            	key: config.page.keys.Amend,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (this.control().length > 0) {
                    	if (config.addMode === true) {
                        	this.control().hide();
                    	} else {
                        	this.control().show();
                        	this.bind();
                    	}
                	}
            	},
            	bind: function () {
                	if (config.editMode === true) {
                    	//  hide amend button
                    	this.control().hide();
                	} else {
                    	//  show the amend button
                    	this.control().show();
                    	if (!this.control().attr("data-bind")) {
                        	this.control().off("click").on("click", function (e) {
                            	e.preventDefault();
                            	//  set the button that was clicked when reinitializing the sections
                            	config.page.centerColumn.attr("data-button-clicked", buttons(config).amendButton.key);
                            	//  update to edit mode
                            	config.editMode = true;
                            	//  re-initialize the sections
                            	config.page.centerColumn.trigger(config.page.data.eventHandler.REFRESH_PAGE, config);
                            	//  hide the amendment button
                            	setTimeout(function () {
                                	buttons(config).amendButton.control().hide();
                                	config.page.backButtonTopContainer.hide();
                                	config.page.bottomButtonContainerReadOnly.hide();
                            	}, 200);
                            	//  scroll the page down a bit
                            	buttons(config).scrollUpPage();
                        	});
                        	this.control().attr("data-bind", true);
                    	}
                	}
            	}
        	},
        	cancelButton: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.page.buttonMappingData, config.centerColumnContainerId, "button", this.key)[0];
            	},
            	key: config.page.keys.Cancel,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (this.control().length > 0) {
                    	this.bind();
                    	this.control().show();
                	}
            	},
            	bind: function () {
                	if (!this.control().attr("data-bind")) {
                    	this.control().off("click").click(function (e) {
                        	config.page.centerColumn.attr("data-button-clicked", buttons(config).cancelButton.key);
                        	//  set appropriate message based on whether add/edit
                        	var message = config.addMode ?
                        	config.page.data.messages.CONFIRM_CANCEL_NEW_DMP :
                        	config.page.data.messages.CONFIRM_CANCEL_EDIT_DMP.replace(/{{MATTER_NAME}}/, config.references.utility.getString(config.page.data.matterName));
                        	//  prompt user for confirmation before cancelling
                        	var confirmed = confirm(message);
                        	//  if user clicked okay button
                        	if (confirmed == true) {
                            	//TODO: GET THIS INTEGRATED WITH BACKEND
                            	//alert("TODO: Will need to call method to delete any temporary DMP records if they exist for supporting documents.");
                            	var redirectTo = config.page.summaryHref.replace(/{{ENTITY_ID}}/, config.entity.data.id).replace(/{{ENTITY_TYPE}}/, config.page.info.entityType).replace(/{{DMP_TYPE}}/, config.page.info.dmpType.replace(/ /g, ""));
                            	//  redirect to the summary page after cancelling the dmp
                            	location.href = redirectTo;
                        	}
                    	});
                    	this.control().attr("data-bind", true);
                	}
            	}
        	},
        	backButton: {
            	configMap: function () {
                	return config.references.utility.mapping.getMappingItem(config.page.buttonMappingData, config.centerColumnContainerId, "button", this.key)[0];
            	},
            	key: config.page.keys.Back,
            	control: function () {
                	return this.configMap().control;
            	},
            	init: function () {
                	if (this.control().length > 0) {
                    	this.bind();
                    	this.control().show();
                	}
            	},
            	bind: function () {
                	if (!this.control().attr("data-bind")) {
                    	this.control().off("click").click(function (e) {
                        	config.page.centerColumn.attr("data-button-clicked", buttons(config).backButton.key);
                        	//  redirect to the summary page
                        	location.href = config.page.summaryHref.replace(/{{ENTITY_ID}}/, config.entity.data.id).replace(/{{ENTITY_TYPE}}/, config.page.info.entityType).replace(/{{DMP_TYPE}}/, config.page.info.dmpType.replace(/ /g, ""));
                    	});
                    	this.control().attr("data-bind", true);
                	}
            	}
        	}
        	//        	,
        	//        	dirtyDataButton: {
        	//            	configMap: function () {
        	//                	return config.references.utility.mapping.getMappingItem(config.page.buttonMappingData, config.centerColumnContainerId, "button", this.key)[0];
        	//            	},
        	//            	key: config.page.keys.Dirty,
        	//            	control: function () {
        	//                	return this.configMap().control;
        	//            	},
        	//            	init: function () {
        	//                	//if the button exists
        	//                	if (this.control().length > 0) {
        	//                    	//  if user has permission to see the button
        	//                    	if (config.userId.substring(0, this.configMap().visibility.length) === this.configMap().visibility) {

        	//                        	this.bind();
        	//                        	if (config.page.data.isDirty.log.length > 0) {
        	//                            	this.control().show();
        	//                        	}
        	//                    	} else {
        	//                        	this.control().hide();
        	//                    	}
        	//                	}
        	//            	},
        	//            	bind: function () {
        	//                	this.control().off("click").click(function (e) {
        	//                    	if (config.page.data.isDirty.log.length > 0) {
        	//                        	var logData = "";
        	//                        	$.each(config.page.data.isDirty.log, function (index, item) {
        	//                            	logData += "TIMESTAMP: " + config.references.utility.validation.dates.getFormattedDateTime(item.timestamp) + "; FIELD ID: " + item.control.prop("id") + "; ORIGINAL VALUE: " + (item.originalValue || "{NO_VALUE}") + "; CHANGED VALUE: " + (item.changedValue || "{NO_VALUE}") + "; CHANGED BY: " + config.userId + "\n";
        	//                        	});
        	//                        	window.prompt("Copy your change history for this page to clipboard so you can view and/or send to IS for support: Ctrl+C, Enter", logData);
        	//                    	} else {
        	//                        	alert("No page data changes to display.");
        	//                    	}
        	//                	});
        	//            	}
        	//        	}
    	}
	};
	//  public API for shared buttons across DMP pages
	$.bg.web.app.dmp.pagebuttons.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	buttons(localConfig).init();
    	}
	};
})(jQuery);
(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.disciplinary === undefined) $.bg.web.app.dmp.disciplinary = {};
	if ($.bg.web.app.dmp.disciplinary.questions === undefined) $.bg.web.app.dmp.disciplinary.questions = {};
	
	var localConfig = {
    	questions: {
        	data: {
            	questions: null
        	}
    	}
	};
	var section = function (config) {
    	return {
        	//  page level vs. modal
        	page: {
            	messageControl: function () {
                	return config.questions.messageControl;
            	},
            	control: function () {
                	return config.questions.container.find(":checkbox");
            	},
            	readOnlyControl: function () {
                	return config.questions.container.find("span.readonly-control");
            	},
            	//  initialize the section content
            	init: function () {
                	
                	var $this = this;
                	if (config.page.centerColumn.attr("data-button-clicked") === config.page.keys.File ||
                    	config.page.centerColumn.attr("data-button-clicked") === config.page.keys.Save) {
                    	//  handle specific edit/read-only functions
                    	if (config.editMode) {
                        	$this.isValid();
                    	}
                	} else {
                    	if (config.questions.data.questions) {
                        	if (config.editMode) {
                            	$this.reinit();
                        	} else {
                            	$this.initControls(config.questions.data.questions);
                        	}
                    	} else {
                        	setTimeout(function () {
                            	$this.getData();
                        	}, config.timeoutDelay);
                    	}
                	}
            	},
            	reinit: function (data) {
                	this.readOnlyControl().hide();
                	this.control().show();
            	},
            	initControls: function (data) {
                	var $this = this;
                	config.references.radioCheckboxUI.init({
                    	editMode: config.editMode,
                    	controlContainer: config.questions.questions,
                    	controlType: "checkbox",
                    	orientVertical: false,
                    	data: {
                        	rows: data,
                        	dbValue: config.questions.data.dbValue,
                        	defaultValue: config.questions.data.defaultValue,
                        	valueColumn: "SDDI_QUESTION_CODE",
                        	textColumn: "SDDI_QUESTION_CODE",
                        	controlGroupName: "disc_questions",
                        	attributes: {
                            	"data-definition": "{{SDDI_QUESTION_TEXT}}"
                        	},
                        	linkText: {
                            	apply: true,
                            	attributes: {
                                	"data-definition": "{{SDDI_QUESTION_TEXT}}",
                                	"data-toggle": "popover",
                                	"data-content": "<span class='small'>{{SDDI_QUESTION_TEXT}}</span>"
                            	},
                            	events: {
                                	onClickCallback: function (e, link, controlConfig) {
                                    	e.preventDefault();
                                    	e.stopPropagation();
                                    	section(config).modal.init(link);
                                    	section(config).modal.show();
                                	}
                            	}
                        	}
                    	},
                    	events: {
                        	onInitCallback: function (controlConfig) { },
                        	onBindCallback: function (controlConfig) {
                            	//  configure the popovers
                            	config.references.utility.setPopover(config.questions.container, config.popOverSettings);
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
                                	"An error occurred while attempting to intialize and render disciplinary question " + controlConfig.controlType + " controls." + ex,
                                	config.references.globals.alerts.DANGER.klass,
                                	config.references.globals.alerts.DANGER.color,
                                	false,
                                	$this.messageControl().empty().selector,
                                	null
                            	);
                        	}
                    	},
                    	utility: config.references.utility
                	});
            	},
            	getData: function () {
                	var $this = this;
                	var $messageControl = section(config).page.messageControl();
                	var $questionData = config.questions.data;
                	config.data.dmpHandler.getSDDIQuestions(config.token, config.page.info.entityType, config.page.info.dmpType, config.page.info.dmpNumber, config.page.info.dmpNumberVersion, function (response) {
                    	try {
                        	if (response) {
                            	var result = response.result;
                            	if (result && result.success) {
                                	if (result.result && result.result.rows && result.result.rows.length > 0) {
                                    	//  set property values
                                    	$questionData.description = config.references.utility.getString(result.result.DMP_QUESTION_INSTR_TEXT);
                                    	$questionData.questions = result.result.rows;
                                    	$this.initControls(result.result.rows);
                                    	//  update section description based on dmp type
                                    	config.questions.description.html(config.questions.description.html().replace(/{{DESCRIPTION}}/, $questionData.description));
                                    	//  initialize and bind the show questions button
                                    	section(config).modal.opener.showQuestionButton.init();
                                    	//TODO: FOR SOME REASON, THE ASTRISK IS NOT SHOWING WHEN IN EDIT MODE
                                    	//  show the astrisk indicator if we're in edit mode
                                    	if (config.editMode) {
                                        	config.questions.astrisks.css({ "display": "inline" });
                                    	};
                                    	//  show content now that it's refreshed
                                    	config.questions.containerPanelBody.slideDown();
                                    	config.questions.spinner.hide();
                                    	config.page.centerColumn.trigger(config.page.data.eventHandler.SECTION_LOAD_COMPLETE);
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "DISCIPLINARY QUESTIONS").replace(/{{CODE}}/, 1);
                                	}
                            	} else {
                                	if (result.message) {
                                    	throw result.message;
                                	} else {
                                    	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "DISCIPLINARY QUESTIONS").replace(/{{CODE}}/, 2);
                                	}
                            	}
                        	} else {
                            	throw config.validation.messages.PROCESS_REQUEST_ERROR_DETAILS.replace(/{{DETAILS}}/, "DISCIPLINARY QUESTIONS").replace(/{{CODE}}/, 3);
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
                        	config.questions.spinner.hide();
                    	}
                	});
            	},
            	//  get the data for the section description
            	getPageDescriptionData: function () {
                	return config.questions.data.description;
            	},
            	//  get list of questions for page
            	getQuestions: function () {
                	return config.questions.data.questions;
            	},
            	isRequired: function () {
                	return config.questions.validation.required(config);
            	},
            	isValid: function () {
                	//  remove any previous error message
                	config.questions.container.find("." + config.validation.ERROR_CLASS).remove();
                	if (config.editMode && this.isRequired()) {
                    	//  no checked values
                    	if ($(config.questions.checkedOptonsSelector).length == 0) {
                        	config.references.utility.html({
                            	klass: config.validation.ERROR_CLASS,
                            	text: config.validation.messages.REQUIRED
                        	}).appendTo(config.questions.description);
                        	return false;
                    	}
                	}
                	return true;
            	}
        	},
        	modal: {
            	control: function () {
                	return config.questions.modal.control;
            	},
            	init: function (link) {
                	var $modal = section(config).modal;
                	$.bg.web.app.control.modal.ui.init({
                    	modal: $modal.control(),
                    	headerText: "Disciplinary Questions",
                    	messagesContainer: null,
                    	saveButton: null,
                    	cancelButton: $modal.cancelButton.control(),
                    	events: {
                        	onShowCallback: function (e, data) {
                            	$modal.buildModalContent(link);
                        	},
                        	onHideCallback: function (e, data) {
                            	if (location.hash.length > 0) location.hash = "";
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
            	questionIndex: function () {
                	return config.questions.modal.index;
            	},
            	questionList: function () {
                	return config.questions.modal.list;
            	},
            	questionDefinitions: function () {
                	return config.questions.modal.definitions;
            	},
            	questionDefinitionTemplate: function () {
                	return config.questions.modal.template;
            	},
            	buildModalContent: function (question) {
                	var $modal = section(config).modal;
                	if (question) {
                    	//  hide the sections/text for when all definitions are to appear
                    	$modal.questionIndex().hide();
                    	$modal.questionList().hide();
                    	//  get the defintion
                    	var definition = $(question).attr("data-definition");
                    	//  append the definition
                    	$modal.questionDefinitions().empty().append($("<div/>", { class: "well well-sm single-definition" }).append(definition)).show();
                	} else {
                    	//  get top links that anchor to the definition via scroll
                    	var questions = section(config).page.getQuestions();
                    	$modal.questionList().empty();
                    	var definitions = "";
                    	var question = "";
                    	$.each(questions, function (index, item) {
                        	question = config.references.utility.getString(item.SDDI_QUESTION_CODE);
                        	var definition = config.references.utility.getString(item.SDDI_QUESTION_TEXT);
                        	//  create link so that user can open modal popup
                        	var $link = $("<a/>", {
                            	href: "#" + question,
                            	text: question,
                            	"data-definition": definition,
                            	"data-toggle": "popover",
                            	"data-content": "<span class='small'>" + definition + "</span>"
                        	});
                        	//  prevent page from kicking back to top
                        	$link.click(function (e) {
                            	return;
                        	});
                        	//  build definitions html
                        	definitions += $modal.questionDefinitionTemplate().replace(/{{QUESTION}}/g, question).replace(/{{DEFINITION}}/, config.references.utility.getString(item.SDDI_QUESTION_TEXT));
                        	//  append the term index links
                        	$modal.questionList().append($link);
                    	});
                    	//  show the index and definitions
                    	$modal.questionIndex().show();
                    	$modal.questionList().show();
                    	$modal.questionDefinitions().empty().append(definitions).show();
                	}
            	},
            	opener: {
                	showQuestionButton: {
                    	control: function () {
                        	return config.questions.showQuestions;
                    	},
                    	init: function () {
                        	this.bind();
                    	},
                    	bind: function () {
                        	$("#center_column [id='questions_container'] [id='show_disciplinary_questions']").click(function (e) {
                            	e.preventDefault();
                            	section(config).modal.init();
                            	section(config).modal.show();
                        	});
                    	}
                	}
            	},
            	cancelButton: {
                	control: function () {
                    	return config.questions.modal.cancelButton;
                	}
            	}
        	}
    	}
	};
	
	//  public API
	$.bg.web.app.dmp.disciplinary.questions.ui = {
    	register: function (context) {
        	$.extend(true, localConfig, context);
    	},
    	init: function () {
        	section(localConfig).page.init();
    	}
	};
	
})(jQuery);
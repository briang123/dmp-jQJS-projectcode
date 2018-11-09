(function ($) {
	if ($.bg === undefined) $.bg = {};
	if ($.bg.web === undefined) $.bg.web = {};
	if ($.bg.web.app === undefined) $.bg.web.app = {};
	if ($.bg.web.app.dmp === undefined) $.bg.web.app.dmp = {};
	if ($.bg.web.app.dmp.ui === undefined) $.bg.web.app.dmp.ui = {};

	/*
	
	DESCRIPTION: GENERAL DEVELOPER NOTES FOR DMP PAGES
	ORIGINALLY CREATED BY: BRIAN GAINES
	ORIGINALLY CREATED ON: JUNE 19, 2017 (BEFORE MY DEPARTURE)
	NOTE: Please add any additional developer notes here. When minified, all comments will be removed, so none of this should appear on the servers.
	*** DEBUGGING ***
	- You will be unable to debug with Visual Studio (stepping through) dynamically loaded script files without referencing them manually on the page, so comment
	out the dynamic script loader and physically place reference on page if you wish to step through the logic to debug.
	*** Setting Page Heading ***
	- Currently, we are hard-coding for the sake of time on the individual dmp pages. The should be dynamically determined based on what comes back from getDMPInfo or
	via a querystring value.
	*** Setting/Checking for DMP Type and Entity Type ***
	- Currently, we are hard-coding the entity type and dmp type in the DMP type pages (Criminal, Employment, etc.). At the time of creating these pages, I was unaware
	that there were different flavapp of entity/dmp types for DMP pages. Now knowing this, we have a solution that could work for these pages; however, will need
	to be coded later at the time when FIRM DMP pages are created. There are some email communications regarding passing the dmp type and entity type as a querystring
	instead of a hash. The build of the side navigation links needs to know the context of the page and the server cannot access the hash values. The introduction
	of using an entityType and dmpType querystring parameter will allow for the side navigation to generate the context on the DMP summary page. Since we have an CUSTOMER ID
	search box on the DMP summary page, we can just append #{{CUSTOMERID}} where {{CUSTOMERID}} will be replaced with the actual CUSTOMER ID to the URL since that is really the ONLY
	value we manipulate on the DMP summary page. (See Building Side Navigation Links for related info)
	*** Building Side Navigation Links ***
	When building the URL on the DMPSummary.aspx page, you could build it this way:
    	"/APP/DMP/DMPSummary.aspx?entityType={{ENTITY_TYPE}}&dmpType={{DMP_TYPE}}” (replace these values with actual values using the Request.Querystring)
    	Which yields this href "/APP/DMP/DMPSummary.aspx?entityType=INDVWEB&dmpType=CRIMINAL”
	So, the link might look like this:
    	<a class=”dmp-summary-link” href="/APP/DMP/DMPSummary.aspx?entityType=INDVWEB&dmpType=CRIMINAL”>Criminal DMP Summary</a>
	When we click the link, we could attach the CUSTOMERID as a “#0300001” to the URL. We need a way to manipulate the CUSTOMERID since we have the CUSTOMER ID search box, but we wouldn’t
	need to manipulate the entity and dmp type, so a querystring should be safe to pass. This is basically how the COMPANY Dashboard works (minus the types)
	This would require a little bit of a change from how Jose is handling this, but should not be a big effort. We build context all the time over on the FACTSPlus side
	where once we click the link, we know to append certain querystring parameters. I don’t see this being any different. We build a simple click event for any
	hyperlink with the class “dmp-summary-link” and append the CUSTOMER ID to the existing HREF and redirect the user.
	In case you didn’t get it from below, in order to populate the ENTITY_TYPE and DMP_TYPE values in the HREF you could just reference the Request.Querystring
	parameters entityType/dmpType respectively. The appendage of the CUSTOMERID would be done via the client since that needs to be a hash value as we manipulate it from the CUSTOMERID search box.	
	*** File/Save Buttons Logic ***
 - User clicks button
  - The click event is in the app.dmp.pagebuttons.ui.js file
  - We set an attribute on the center column indicating which button was clicked
  - We clear any previous page message
  - We check to see if any data was modified on page and show "View Changes" button (for IS only)
  - We create an event handler callback function so we can execute after we validate
  - We trigger the REFRESH_PAGE event handler and pass the current configuration object to it
   - we pass the configuration because we just updated it with the callback function and need to merge it with the page
 - We call the init function in dmp type's ui
  - We check which button was clicked by referencing the center column attribute
  - if either the File/Save button was clicked and is in edit mode, then we call the current section's validate method
  - While validating each section
   - If invalid, then we show the invalid message aside each control
   - If invalid, then we also display a page-level message indicating that the page is invalid and that a Save/File cannot be done until changes are fixed.
   - Once done validating, we trigger the SECTION_LOAD_COMPLETE event handler
    - Once we determine that all sections are done loading, we will initialize the appropriate buttons.
   - After all sections have been reinitialized and validated, we issue a callback to the onPageRefreshCallback function we created in
            	the app.dmp.pagebuttons.ui.js file just before triggering the REFRESH_PAGE event handler.
    - Within the callback function, we check if the page is valid, and if so, then we call the save method and pass an argument indicating whether
                	we are filing or saving.
     - We issue call to saveDMP or fileDMP based on type and handle any errapp or successes accordingly.
    - If invalid, then we display an error message. The user can then fix any issues and try again.

	*** DMP Object Merging ***
	dmp.ui.js (master page)
 	- We have a globals object ($.bg.web.app.dmp.ui.globals), which is the ui file for the DMP.Master page that is available to every dmp type
    	page by merging it down with the dmp type (ie. app.dmp.{{type}}.ui.js) ui file's configuration object. Note, that the dmp type configuration
    	that is local to the page will be merged into by the global configuration, and that configuration object will be merged down to the section
    	ui files. It looks something like this, as far as hiearchy.
 
  	$.bg.app.dmp.ui (dmp type master page's ui)
   	>> $.bg.app.dmp.{{type}}.ui  (where {{type}} is criminal, employment, etc.)
    	>> $.bg.app.dmp.{{type}}.{{section}}.ui (where {{section}} are the sections (panels with headings), such as charges, case info, etc.)
 
 	In other words, we merge down from global all the way to the section ui files. As a result, any variable that needs to be set and made
    	available (cached) post-validation, should be set at the lowest possible level (ie. app.dmp.{{type}}.{{section}}.ui.js file).
	*/
	
	//  public API for master page ui
	$.bg.web.app.dmp.ui = {
    	globals: {
        	getDefaultSaveObject: function (config) {
            	var $$utility = config.references.utility;
            	//  a generic object that, for the part, is shared across all dmp types
            	var defaultObject = {
                	dmpNumber: config.page.info.dmpNumber,
                	dmpNumberVersion: config.page.info.dmpNumberVersion,
                	tempDMPNumber: config.supportDocs.data.model.tempDMPNumber,
                	tempDMPNumberVersion: config.supportDocs.data.model.tempDMPNumberVersion,
                	dmpType: config.page.info.dmpType,
                	entityId: config.entity.data.id,
                	entityType: config.page.info.entityType,
                	disciplinary: $$utility.data.getSelectedItems($(config.questions.checkedOptonsSelector), "checkbox"),
                	disclosure: $$utility.data.getSelectedItems($(config.disclosure.checkedOptonsSelector), "checkbox"),
                	comment: $$utility.getString(config.comments.control.val())
            	};
            	return defaultObject;
        	},
        	//NOTE: VALUES FROM THIS OBJECT WILL BE MERGED WITH SPECIFIC DMP TYPE OBJECTS
        	//  HANDLER REFERENCES
        	data: {
            	initialLoad: true,
            	dmpHandler: new DmpHandler(),
            	relationshipHandler: new RelationshipHandler(),
            	nameHandler: new NameHandler()
        	},
        	//  JS OBJECT REFERENCES
        	references: {
            	dataService: $.bg.web.app.data.services,
            	utility: $.bg.web.app.common.utility,
            	security: $.bg.web.app.common.security,
            	data: $.bg.web.app.data.services,
            	debug: $.bg.web.app.common.utility.debug,
            	system: $.bg.web.app.common.system,
            	globals: $.bg.web.app.globals,
            	multiselectUI: $.bg.web.app.control.multiselect.ui,
            	inputTextUI: $.bg.web.control.input.text.ui,
            	datatablesUI: $.bg.web.app.control.datatable.client.ui,
            	radioCheckboxUI: $.bg.web.control.input.radio.checkbox.ui,
        	},
        	//  CURRENT URL
        	url: $.bg.web.app.common.system.applicationUrl() + ($.bg.web.app.common.system.applicationUrl().substring($.bg.web.app.common.system.applicationUrl().length - 1) !== "/" ? "/" : ""),
        	//  CURRENT USER
        	userId: $.bg.web.app.common.security.currentUserId(),
        	//  JS VERSIONING OF STATIC FILES
        	jsVersion: $.bg.web.app.common.system.jsVersion(),
        	//  SETIMEOUT DELAY FOR LETTING THINGS WORK
        	timeoutDelay: $.bg.web.app.globals.timeoutDelay,
        	//  SETTIMEOUT DELAY FOR LETTING USER SEE SUCCESS MESSAGE BEFORE REDIRECTION
        	redirectDelay: $.bg.web.app.globals.redirectDelay || 0,
        	//  OVERRIDE THE POPOVER GLOBAL SETTINGS WITH THESE SETTINGS
        	popOverSettings: {
            	delay: { hide: 2000 }
        	},
        	//  TOKEN REFERENCE
        	csrfInput: $("#csrf_token"),
        	token: $("#csrf_token").val(),
        	//  CONTAINER
        	centerColumnContainerId: "center_column",
        	//  FLAG INDICATING THAT WE'RE EDITING THE DMP
        	editMode: false,
        	//  FLAG INDICATING THAT WE'RE ADDING A NEW DMP
        	addMode: false,
        	//  ENTITY NAME INFORMATION TO DISPLAY ON PAGE
        	entity: {
            	control: $("#center_column [id='entity_info']"),
            	template: "CUSTOMER ID {{ENTITY_ID}} - {{ENTITY_NAME}}",
            	data: {
                	id: null,
                	name: null
            	}
        	},
        	//  PAGE ELEMENTS
        	page: {
            	summaryHref: "DMPSummary.aspx#{{ENTITY_ID}},{{ENTITY_TYPE}},{{DMP_TYPE}}",
            	info: {
                	dmpTypes: {
                    	CRIMINAL: "CRIMINAL",
                    	REGULATORY: "REGULATORY",
                    	EMPLOYMENT: "EMPLOYMENT",
                    	FINANCIALJ: "FINANCIAL J",
                    	FINANCIALK: "FINANCIAL K"
                	},
                	entityTypes: {
                    	INDIVIDUAL: "INDVWEB",
                    	FIRM: "FIRM"
                	},
                	pageHeadingTemplate: "Disciplinary Information - {{TYPE}} Disclosure Matter Page",
                	targetCUSTOMERID: $.bg.web.app.common.utility.formatEntityId($.bg.web.app.common.utility.requestQueryString("CUSTOMERID"), 7) === "0000000" ? null : $.bg.web.app.common.utility.formatEntityId($.bg.web.app.common.utility.requestQueryString("CUSTOMERID"), 7),
                	dmpNumber: $.bg.web.app.common.utility.requestQueryString("dmpNumber") || null,
                	dmpNumberVersion: $.bg.web.app.common.utility.requestQueryString("dmpNumberVersion") || null
            	},
            	centerColumn: $("#center_column"),
            	sectionContainer: $("#center_column [id='page_description_container']"),
            	bottomButtonContainer: $("#center_column [id='bottom_button_container']"),
            	bottomButtonContainerReadOnly: $("#center_column [id='bottom_button_container_readonly']"),
            	backButtonTopContainer: $("#center_column .back-button").closest("span"),
            	justBottomButtons: $("#center_column [id='just_buttons']"),
            	checkBoxes: $("#center_column input[type='checkbox']"),
            	astrisks: $("#center_column .astrisk, #center_column .double-astrisk"),
            	buttonMappingData: [
                	{ container: "center_column", category: "button", key: "AMEND", id: "amend", control: $("#center_column [id='amend']") },
                	{ container: "center_column", category: "button", key: "FILE", id: "file", control: $("#center_column [id='file']") },
                	{ container: "center_column", category: "button", key: "SAVE", id: "save", control: $("#center_column [id='save']") },
                	{ container: "center_column", category: "button", key: "CANCEL", id: "cancel", control: $("#center_column [id='cancel']") },
                	{ container: "center_column", category: "button", key: "BACK", control: $("#center_column .back-button") },
                	{ container: "center_column", category: "button", key: "DIRTY", id: "dirty", control: $("#center_column [id='dirty']"), visibility: "NFIS" }
            	],
            	keys: {
                	Amend: "AMEND",
                	File: "FILE",
                	Save: "SAVE",
                	Cancel: "CANCEL",
                	Back: "BACK",
                	Dirty: "DIRTY"
            	},
            	message: {
                	pageHeading: $("#page-heading"),
                	pageMessage: $("#center_column [id='page_message_container']"),
                	pageMessageAlert: $("#center_column [id='page_message_container'] .alert"),
                	pageDescription: $("#center_column [id='page_description']"),
                	buttonActionDescription: $("#center_column [id='button_action_description']"),
                	buttonActionMessageContainer: $("#center_column [id='button_action_message']"),
                	requiredToFileIndicatorMsg: $("#center_column [id='requiredToFileDMPforUSIndicatorMsg']"),
                	requiredToFileDMPforUSIndicatorMsg: $("#center_column [id='requiredToFileDMPforUSIndicatorMsg']")
            	},
            	data: {
                	matterName: null,
                	eventHandler: {
                    	SECTION_LOAD_COMPLETE: "sectionLoadingComplete",
                    	PAGE_DATA_CHANGED: "pageDataChanged",
                    	DIRTY_DATA_CLEANED: "dirtyDataCleaned",
                    	REFRESH_PAGE: "pageNeedsRefresh",
                    	onPageRefreshCallback: null
                	},
                	//  flag to show the raw json data on the page
                	showRawData: false,
                	//  all the data changes that were made
                	isDirty: {
                    	log: []
                	},
                	//  global propert settings
                	noDataValue: $.bg.web.app.globals.data.noDataValue,
                	upperCaseOnBlur: $.bg.web.app.globals.data.upperCaseOnBlur,
                	upperCaseEditText: $.bg.web.app.globals.data.upperCaseEditText,
                	upperCaseReadOnlyText: $.bg.web.app.globals.data.upperCaseReadOnlyText,
                	setLabelOnSameLineWhenReadOnly: $.bg.web.app.globals.data.setLabelOnSameLineWhenReadOnly,
                	showLabelsForReadOnly: $.bg.web.app.globals.data.showLabelsForReadOnly,
                	messages: {
                    	DMP_SAVE_SUCCESSFUL: "<span class=\"spinner spinner-alert\"><img alt=\"redirecting...\" src=\"../images/spin-sm-arrows-success.gif\" /></span>The DMP has been successfully saved. Please wait while you are redirected to the DMP Summary page. If your web browser does not redirect you, please <a href=\"{{HREF}}\" title='DMP Summary Page'>click here</a> to be redirected.",
                    	DMP_FILE_SUCCESSFUL: "<span class=\"spinner spinner-alert\"><img alt=\"redirecting...\" src=\"../images/spin-sm-arrows-success.gif\" /></span>The DMP has been successfully filed. Please wait while you are redirected to the DMP Summary page. If your web browser does not redirect you, please <a href=\"{{HREF}}\" title='DMP Summary Page'>click here</a> to be redirected.",
                    	DMP_SAVING: "<span class=\"spinner button-spinner pull-left\"><img src=\"../images/spin-sm-arrows-info.gif\" /></span>Please wait a moment while we save the DMP. Once the DMP is saved, you will be redirected to the DMP Summary page.",
                    	DMP_FILING: "<span class=\"spinner button-spinner pull-left\"><img src=\"../images/spin-sm-arrows-info.gif\" /></span>Please wait a moment while we file the DMP. Once the DMP is filed, you will be redirected to the DMP Summary page.",
                    	CONFIRM_CANCEL_NEW_DMP: "Are you sure you want to delete this DMP filing?",
                    	CONFIRM_CANCEL_EDIT_DMP: "Are you sure you want to cancel changes to DMP '{{MATTER_NAME}}'?",
                    	SECTIONS_LOADED: "All the DMP section data has been loaded.",
                    	READY_TO_AMEND: "The DMP page is ready to be amended.",
                    	NO_DATA: "No data exists."
                	},
                	//  description text for page
                	description: {
                    	criminal: "Please file a separate Disclosure Matter Page (DMP) for each criminal case.",
                    	regulatory: "Please file a separate Disclosure Matter Page (DMP) for each regulatory action. A regulatory action may be reportable under more than one regulatory disclosure question. If the same conduct/event resulted in more than one regulatory action, provide details for each action on a separate DMP.",
                    	employment: "Please file a separate Disclosure Matter Page (DMP) for each event.",
                    	financialj: "Please file a separate Disclosure Matter Page (DMP) for each action.",
                    	financialk: "Please file a separate Disclosure Matter Page (DMP) for each action."
                	},
                	//  description above bottom buttons
                	buttonDescription: {
                    	newDMP: "To file all DMP information and any uploaded supporting documentation, click File. If you wish to save all DMP information and any uploaded supporting documentation but not file, click Save. If you wish to discard your changes, including any uploaded supporting documentation, click Cancel.",
                    	amendingDMP: "To file all DMP information and any uploaded supporting documentation, click File. If you wish to save all DMP information and any uploaded supporting documentation but not file, click Save. If you wish to discard your changes, including any uploaded supporting documentation, click Cancel."
                	}
            	}
        	},
        	//  DISCIPLINARY QUESTIONS SECTION
        	questions: {
            	container: $("#center_column [id='questions_container']"),
            	messageControl: $("#center_column [id='questions_container'] .section-messages"),
            	astrisks: $("#center_column [id='questions_container'] .astrisk"),
            	containerPanelBody: $("#center_column [id='questions_container'] .panel-body, #center_column [id='questions_container'] .section-description"),
            	spinner: $("#center_column [id='questions_container'] .spinner"),
            	astrisks: $("#center_column [id='questions_container'] .astrisk"),
            	description: $("#center_column [id='questions_container'] [class*='section-description']"),
            	showQuestions: $("#center_column [id='questions_container'] [id='show_disciplinary_questions']"),
            	questions: $("#center_column [id='questions_container'] [class*='section-content']"),
            	questionLink: $("#center_column [id='questions_container'] [class*='section-content'] a"),
            	questionCheckbox: $("#center_column [id='questions_container'] [class*='section-content'] :checkbox"),
            	checkedOptonsSelector: "#center_column [id='questions_container'] [class*='section-content'] :checkbox[name='disc_questions']:checked",
            	modal: {
                	control: $("#center_column [id='modal_question']"),
                	cancelButton: $("#center_column [id='modal_question'] [class*='cancel-button']"),
                	index: $("#center_column [id='question_index']"),
                	list: $("#center_column [id='question_list']"),
                	definitions: $("#center_column [id='question_container']"),
                	template: "<a name='{{QUESTION}}'></a><div class='well well-sm'><strong>{{QUESTION}}:</strong><br/>{{DEFINITION}}</div>"
            	},
            	data: {
                	dbValue: [],      	// TO REMOVE... array of checked values
                	defaultValue: [],
                	description: null,
                	//questions: null,
                	definition: null,
                	definitions: null
            	}
        	},
        	//  BASIS FOR DISCLOSURE SECTION
        	disclosure: {
            	container: $("#center_column [id='basis_disclosure_container']"),
            	messageControl: $("#center_column [id='basis_disclosure_container'] .section-messages"),
            	astrisks: $("#center_column [id='basis_disclosure_container'] .astrisk"),
            	containerPanelBody: $("#center_column [id='basis_disclosure_container'] .panel-body, #center_column [id='basis_disclosure_container'] .section-description"),
            	spinner: $("#center_column [id='basis_disclosure_container'] .spinner"),
            	astrisks: $("#center_column [id='basis_disclosure_container'] .astrisk"),
            	description: $("#center_column [id='basis_disclosure_container'] [class*='section-description']"),
            	questions: $("#center_column [id='basis_disclosure_container'] [class*='section-content']"),
            	questionCheckbox: $("#center_column [id='basis_disclosure_container'] [class*='section-content'] :checkbox"),
            	checkedOptonsSelector: "#center_column [id='basis_disclosure_container'] [class*='section-content'] :checkbox[name='basis_disclosure_question']:checked",
            	personallyNamedCheckedSelector: "#center_column [id='basis_disclosure_container'] [class*='section-content'] :checkbox[name='basis_disclosure_question'][data-value='PERSONAL']:checked",
            	actionTakenPrincipalCheckedSelector: "#center_column [id='basis_disclosure_container'] [class*='section-content'] :checkbox[name='basis_disclosure_question'][data-value='PRINCIPAL']:checked",
            	data: {
                	dbValue: [],
                	defaultValue: [],
                	typeCode: "DMP_DISCLOSURE",
                	description: "Check all that apply"
            	}
        	},
        	//  COMMENTS SECTION
        	comments: {
            	containerPanelBody: $("#center_column [id='comments_container'] .panel-body, #center_column [id='comments_container'] .section-description"),
            	spinner: $("#center_column [id='comments_container'] .spinner"),
            	description: $("#center_column [id='comments_container'] [class='section-description']"),
            	control: $("#center_column [id='comments_container'] [id='comment']"),
            	astrisks: $("#center_column [id='comments_container'] .section-description .astrisk"),
            	readOnlyControl: $("#center_column [id='comments_container'] [id='comment_readonly']"),
            	sectionContent: $("#center_column [id='comments_container'] [class*='section-content']"),
            	charsLeft: $("#center_column [id='comments_container'] [id='charNum']"),
            	data: {
                	//  description text in comments section
                	description: {
                    	criminal: "Use this field to provide a summary of the circumstances surrounding the charge(s), the current status or final disposition including sentencing/penalty information.",
                    	regulatory: "Use this field to provide a summary of the circumstances surrounding the action and/or additional sanction information.",
                    	employment: "Use this field to provide a summary of the allegations and circumstances surrounding the employment termination.",
                    	financialj: "Use this field to provide a summary of the circumstances leading to the action as well as status/disposition details. ",
                    	financialk: "Use this field to provide a summary of the circumstances leading to the adversary action as well as status/disposition details."
                	},
                	dbValue: null,
                	defaultValue: null
            	}
        	},
        	//  SUPPORTING DOCUMENTS SECTION
        	supportDocs: {
            	modalId: "modal_docs",
            	containerId: "supportingDocs_container",
            	container: $("#center_column [id='supportingDocs_container']"),
            	containerPanelBody: $("#center_column [id='supportingDocs_container'] .panel-body"),
            	spinner: $("#center_column [id='supportingDocs_container'] .spinner"),
            	description: $("#center_column [id='supportingDocs_container'] [class='section-description']"),
            	sectionContent: $("#center_column [id='supportingDocs_container'] [class*='section-content']"),
            	table: {
                	messageControl: $("#center_column [id='supportingDocs_container'] [id='tblMessages_SupportingDocs']"),
                	id: "tblSupportingDocs",                        	//  id of table
                	pageSize: -1,                                   	//  default page size
                	initialLoad: true,                              	//  indicator of whether tab has been loaded
                	summaryPanelId: "supporting-docs-summary-panel",	//  summary panel id above table
                	btnGroupHtml: null,                             	//  button group in summary panel
                	reinit: null,
                	link: {
                    	href: "#",
                    	target: ""
                	}
            	},
            	mappings: {
                	table: [
                    	{ container: "supportingDocs_container", category: "table", key: "DESCRIPTION", ColumnName: "DOC_DESC", DisplayName: "Description", Visible: true, Sortable: false, width: "40%" },
                    	{ container: "supportingDocs_container", category: "table", key: "FILE_NAME", ColumnName: "DOC_FILE_NAME", DisplayName: "Uploaded File", ClassName: "dt-head-nowrap dt-body-left cell-overflow", Visible: true, Sortable: false, width: "50%" },
                    	{ container: "supportingDocs_container", category: "table", key: "ACTIONS", ColumnName: "ACTIONS", DisplayName: "Action", Visible: true, Sortable: false, width: "10%" }
                	],
                	controls: [
                    	{ container: "supportingDocs_container", category: "table", key: "TABLE", id: "tblSupportingDocs", control: $("#center_column [id='supportingDocs_container'] [id='tblSupportingDocs']") },
                    	{ container: "supportingDocs_container", category: "button", key: "ADD", id: "btnAddDocument", class: "btn btn-sm btn-primary", title: "Add", text: "<span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>", control: $("#center_column [id='supportingDocs_container'] [id='btnAddDocument']") },
                    	{ container: "supportingDocs_container", category: "button", key: "VIEW", id: "", class: "btn btn-xs btn-primary btn-glyphicon-nocaption readonly-setting btn-view", title: "View Supporting Document", text: "<span class=\"glyphicon glyphicon-open\" aria-hidden=\"true\"></span>" },
                    	{ container: "supportingDocs_container", category: "button", key: "EDIT", id: "", class: "btn btn-xs btn-primary btn-glyphicon-edit btn-glyphicon-nocaption readonly-setting btn-edit", title: "Edit Supporting Document", text: "<span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span>" },
                    	{ container: "supportingDocs_container", category: "button", key: "DELETE", id: "", class: "btn btn-xs btn-danger btn-glyphicon-nocaption readonly-setting btn-delete", title: "Delete Supporting Document", text: "<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>" },
                    	{ container: "modal_docs", category: "modal", key: "MODAL", id: "modal_docs", control: $("#center_column [id='modal_docs']") },
                    	{ container: "modal_docs", category: "input", key: "MODAL_DESCRIPTION", id: "modal_doc_description", control: $("#center_column [id='modal_docs'] [id='modal_docs_description']") },
                    	{ container: "modal_docs", category: "button", key: "MODAL_UPLOAD", id: "btnFileUpload", control: $("#center_column [id='modal_docs'] [id='btnFileUpload']") },
                    	{ container: "modal_docs", category: "button", key: "MODAL_REMOVE_UPLOAD", id: "removeFile", control: $("#center_column [id='modal_docs'] [id='removeFile']") },
                    	{ container: "modal_docs", category: "label", key: "MODAL_FILENAME", id: "doc_file_name", control: $("#center_column [id='modal_docs'] [id='docFileName']") },
                    	{ container: "modal_docs", category: "button", key: "MODAL_SAVE", id: "btnSave", control: $("#center_column [id='modal_docs'] [id^='btnSave']") },
                    	{ container: "modal_docs", category: "button", key: "MODAL_CANCEL", id: "btnCancel", control: $("#center_column [id='modal_docs'] [id^='btnClose']") }
                	]
            	},
            	keys: { //  lookup keys for the mappings array
                	table: {
                    	Table: "TABLE",
                    	Description: "DESCRIPTION",
                    	FileName: "FILE_NAME",
                    	Actions: "ACTIONS",
                    	View: "VIEW",
                    	Edit: "EDIT",
                    	Delete: "DELETE"
                	},
                	modal: {
                    	Modal: "MODAL",
                    	Add: "ADD",
                    	Description: "MODAL_DESCRIPTION",
                    	UploadButton: "MODAL_UPLOAD",
                    	RemoveUpload: "MODAL_REMOVE_UPLOAD",
                    	FileName: "MODAL_FILENAME",
                    	Save: "MODAL_SAVE",
                    	Cancel: "MODAL_CANCEL"
                	}
            	},
            	data: {
                	model: {
                    	tempDMPNumber: null,
                    	tempDMPNumberVersion: null
                	}
            	},
            	fileUpload: {
                	settings: {
                    	maxFileNameLength: 255,
                    	autoUpload: $.bg.web.app.globals.fileUpload.autoUpload,
                    	maxFileSize: $.bg.web.app.globals.fileUpload.maxFileSize,
                    	getFileHandlerUrl: function () {
                        	var url = $.bg.web.app.common.system.applicationUrl();
                        	url = url + (url.substring(url.length - 1) !== "/" ? "/" : "");
                        	return url + "Api/Dmp/SupportDocUploadToDBHandler.ashx";
                    	},
                    	dataType: $.bg.web.app.globals.fileUpload.dataType,
                    	acceptFileTypes: $.bg.web.app.globals.fileUpload.acceptFileTypes
                	},
                	messages: $.bg.web.app.globals.fileUpload.messages,
                	errorMessageContainer: $("#center_column [id='modal_docs'] [id='fileErrorMessages']"),
                	fileUploadButton: $("#center_column [id='modal_docs'] [id='fileupload']"),
                	fileUploadButtonContainer: $("#center_column [id='modal_docs'] [id='btnFileUpload']"),
                	fileNameContainer: $("#center_column [id='modal_docs'] [id='docFileName']"),
                	removeFileButton: $("#center_column [id='modal_docs'] [id='removeFile']"),
                	deletedFlag: $("#center_column [id='modal_docs'] [id='fileDeletedFlag']")
            	},
            	validation: {
                	messages: $.bg.web.app.globals.supportDocs.messages
            	}
        	},
        	//  CHECK SYSTEM PERMISSIONS
        	checkPermission: function (ex) {
            	var msg = (typeof ex === "object" && !!ex["message"]) ? ex.message : ex;
            	if (msg.toUpperCase().indexOf($.bg.web.app.dmp.ui.globals.validation.PERMISSION_STR_CHECK) > -1) {
                	location.href = $.bg.web.app.dmp.ui.globals.url + $.bg.web.app.dmp.ui.globals.validation.ACCESS_DENIED_PAGE;
            	}
        	},
        	hideSection: function (obj) {
            	obj.container.hide();
            	obj.spinner.hide();
        	},
        	//  hide the spinner controls as data is loaded
        	hideSpinner: function (control, closestSelector, spinners, sectionPanelBody, config) {
            	control.closest(closestSelector).find(".spinner").hide();
            	//  get number of spinners still showing
            	var visibleSpinnerLength = function () {
                	return spinners.filter(function () {
                    	return this.style.display !== 'none';
                	}).length;
            	}
            	//  if only a single spinner is showing, then it's the spinner in the section header, so hide it, as we
            	//  we are all done loading all fields in the section.
            	if (visibleSpinnerLength() == 1) {
                	//  show the section content and hide the spinner to indicate that it's done loading
                	spinners.not(":hidden").hide();
                	sectionPanelBody.slideDown();
                	config.page.centerColumn.trigger(config.page.data.eventHandler.SECTION_LOAD_COMPLETE);
            	}
        	},
        	validation: $.bg.web.app.globals.validation
    	},
    	init: function () {
        	var $$globals = $.bg.web.app.dmp.ui.globals;
        	//  if the CUSTOMER ID is not valid, then redirect to system error page
        	if (!$$globals.page.info.targetCUSTOMERID) {
            	location.href = $$globals.url + $$globals.validation.SYSTEM_ERROR_PAGE;
        	} else {
            	//  if dmpnumber and version do not exist, then we're adding a new DMP
            	if (!$$globals.page.info.dmpNumber && !$$globals.page.info.dmpNumberVersion) {
                	$$globals.entity.id = $$globals.page.info.targetCUSTOMERID;
                	$$globals.addMode = true;
                	$$globals.editMode = true;
            	} else {
                	//  if dmpnumber and version exist, then we're editing an existing DMP
                	$$globals.addMode = false;
            	}
            	//  if read only, then hide all astrisks and ensure the button container is hidden
            	if (!$$globals.editMode) {
                	$$globals.page.astrisks.hide();
                	$$globals.page.bottomButtonContainer.hide();
                	
                	//  show the back button
                	$$globals.page.bottomButtonContainerReadOnly.slideDown();
                	$$globals.page.backButtonTopContainer.slideDown();
            	} else {
                	//  hide the back button
                	$$globals.page.backButtonTopContainer.hide();
                	$$globals.page.bottomButtonContainerReadOnly.hide();
            	}
            	//  event handler for any click event of a link that is attempting to open a popup window from ereg
            	$(document).on("click", "a[href*=':open']", function (e) {
                	e.preventDefault();
                	e.stopPropagation();
                	var href = $(this).attr("href");
                	var call = "$.bg.web.app.common.utility." + href.toLowerCase().replace("javascript:openpopup('", "openPopup('" + $.bg.web.app.common.system.securedExternalWebAddress());
                	eval(call);
            	}).on("shown.bs.popover", "[data-toggle='popover']", function () {
                	//  initiate a reset of the session timeout if user hovers over
                	//  a button that triggers a popover for the current container
                	$.bg.web.common.utility.sessiontimeout.initiateReset();
            	});
        	}
    	}
	};
})(jQuery);
/**
 * @module @ui5/flexibility-utils/src/changeUtils
 */

let iIdCounter = 0;
const CHANGE_UTILS_PREFIX = "changeUtils: ";

function uid() {
	return "id-" + new Date().valueOf() + "-" + iIdCounter++;
}

function appendComponentToReference(sComponentName) {
	if (sComponentName && sComponentName.indexOf(".Component") < 0) {
		sComponentName += ".Component";
	}
	return sComponentName;
}

function getFlexReference(manifest) {
	const oSapUi5Entry = manifest["sap.ui5"];
	if (oSapUi5Entry) {
		if (oSapUi5Entry.appVariantId) {
			return oSapUi5Entry.appVariantId;
		}

		if (oSapUi5Entry.componentName) {
			return appendComponentToReference(oSapUi5Entry.componentName);
		}
	}

	const sapApp = manifest["sap.app"];
	if (!sapApp || !sapApp.id) {
		throw Error("app ID could not be determined");
	}
	return sapApp.id;
}

function getAppVersion(manifest) {
	const sapApp = manifest["sap.app"];
	if (!sapApp || !sapApp.applicationVersion || !sapApp.applicationVersion.version) {
		throw Error("app version could not be determined");
	}
	return sapApp.applicationVersion.version;
}

function getProjectId(manifest, reference) {
	if (
		manifest &&
		manifest["sap.app"] &&
		manifest["sap.app"].sourceTemplate &&
		["ui5template.smartTemplate", "ui5template.smarttemplate"].includes(manifest["sap.app"].sourceTemplate.id)
	) {
		return reference;
	}

	return "";
}

function createString(propertyBag) {
	return JSON.stringify({
		fileName: propertyBag.id || uid().replace(/-/g, "_") + "_" + propertyBag.type,
		fileType: "change",
		changeType: propertyBag.type,
		moduleName: "",
		reference: propertyBag.reference,
		packageName: "",
		content: propertyBag.content || {},
		selector: {
			id: propertyBag.controlId,
			idIsLocal: false,
			type: propertyBag.controlType
		},
		layer: propertyBag.isCustomer ? "CUSTOMER_BASE" : "VENDOR",
		texts: {},
		namespace: "apps/" + propertyBag.reference.replace(".Component", "") + "/changes/",
		projectId: propertyBag.projectId,
		creation: propertyBag.creation || new Date().valueOf(),
		originalLanguage: "",
		support: {
			generator: CHANGE_UTILS_PREFIX + propertyBag.creatingTool,
			service: "",
			user: "",
			sapui5Version: propertyBag.sapui5Version,
			sourceChangeFileName: "",
			compositeCommand: ""
		},
		oDataInformation: {},
		dependentSelector: {},
		validAppVersions: {
			from: propertyBag.appVersion,
			to: propertyBag.appVersion,
			creation: propertyBag.appVersion

		},
		jsOnly: false,
		variantReference: "",
		appDescriptorChange: false
	});
}

/**
 * Object containing information for a change update.
 *
 * @typedef {object} 	ChangeDefinition
 * @property {string}	controlId - ID of the control containing all prefixes excluding the application ID prefix
 * @property {string}	type - Change type, i.e. <code>propertyChange</code>
 * @property {Object}	content - Content of the change needed by the corresponding change handler
 * @property {boolean}	isCustomer - Flag indicating whether the project is related to a customer project
 * @property {string}	sapui5Version - SAPUI5 version for which the change is created
 * @property {string}	creatingTool - Name of the tool calling this function for support reasons
 * @property {string}	id - UID of the change;
 * 							Defined on the first <code>toString</code> function call via the <code>manifest</code>
 * @property {string}	reference - Reference to the application;
 * 							Defined on the first <code>toString</code> function call via the <code>manifest</code>
 * @property {string}	appVersion - Version of the application;
 *		 					Defined on the first <code>toString</code> function call via the <code>manifest</code>
 * @property {string}	creation - String with the creation timestamp;
 * 							Defined on the first <code>toString</code> function call via the <code>manifest</code>
 */

/**
 * Object containing information for a change creation.
 *
 * @typedef {object} 	ChangeDefinitionInCreation
 * @property {string}  	controlId - ID of the control containing all prefixes excluding the application ID prefix
 * @property {string}  	type - Change type, i.e. <code>propertyChange</code>
 * @property {Object}  	[content] - Content of the change needed by the corresponding change handler
 * @property {boolean} 	isCustomer - Flag indicating whether the project is related to a customer project
 * @property {string}  	[sapui5Version] - SAPUI5 version for which the change is created
 * @property {string}  	creatingTool - Name of the tool calling this function (this is needed for support reasons)
 */

module.exports = {
	/**
	 * Parses a string of a change file into a change definition;
	 * The parsed entities <code>id</code>, <code>reference</code>, <code>appVersion</code>, <code>creation</code>
	 * must not be changed between <code>toString</code> operations.
	 *
	 * @param {string} changeString - Stringified change object stored in the workspace
	 * @returns {ChangeDefinition}
	 */
	parse: function(changeString) {
		const change = JSON.parse(changeString);

		if (
			!change.fileName ||
			!change.changeType ||
			!change.selector ||
			!change.reference ||
			!change.creation ||
			!change.content ||
			!change.layer ||
			!change.support
		) {
			throw Error("Parsed object does not contain all required parameters");
		}

		return {
			id: change.fileName,
			reference: change.reference,
			appVersion: change.validAppVersions ? change.validAppVersions.creation : "",
			creation: change.creation,
			projectId: change.projectId,
			type: change.changeType,
			controlId: change.selector.id,
			controlType: change.selector.type,
			isCustomer: change.layer === "CUSTOMER_BASE",
			creatingTool: change.support.generator.replace(CHANGE_UTILS_PREFIX, ""),
			content: change.content,
			sapui5Version: change.support.sapui5Version
		};
	},

	/**
	 * Generates a string of a change to write it as a file into the workspace.
	 *
	 * @param {changeDefinitionInCreation} propertyBag -
	 * 			Object containing parameters for the change string creation
	 * @param {object} manifest - Application manifest
	 * @returns {string} Stringified change object needed and understood by the SAPUI5 runtime for storing in the workspace
	 */
	createChangeString: function (propertyBag, manifest) {
		if (
			!propertyBag.type ||
			!propertyBag.controlId ||
			!(typeof propertyBag.isCustomer === "boolean") ||
			!propertyBag.creatingTool
		) {
			throw Error("not all property parameters of the change were provided");
		}

		if (!manifest) {
			throw Error("no manifest was provided");
		}

		propertyBag.reference = getFlexReference(manifest);
		propertyBag.appVersion = getAppVersion(manifest);
		propertyBag.projectId = getProjectId(manifest, propertyBag.reference);

		return createString(propertyBag);
	},

	/**
	 * Generates a string of a parsed change to write it as a file into the workspace.
	 *
	 * @param {ChangeDefinition} propertyBag -
	 * 			Object containing parameters for the change string creation
	 * @returns {string} Stringified change object needed and understood by the SAPUI5 runtime for storing in the workspace
	 */
	toString: function(propertyBag) {
		if (
			!propertyBag.type ||
			!propertyBag.controlId ||
			!(typeof propertyBag.isCustomer === "boolean") ||
			!propertyBag.creatingTool ||
			!(propertyBag.reference && propertyBag.appVersion)
		) {
			throw Error("not all parameters of the change were provided");
		}

		return createString(propertyBag);
	}
};

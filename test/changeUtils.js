const test = require("ava");
const changeUtils = require("../src/changeUtils");

function clone(object, propertiesToRemove) {
	const clonedObject = Object.assign({}, object);
	propertiesToRemove.forEach(function (property) {
		delete clonedObject[property];
	});

	return clonedObject;
}

const manifest = {
	"sap.app": {
		id: "test.app",
		applicationVersion: {
			version: "1.0.0"
		}
	}
};

const manifestFioriElementsBased = {
	"sap.app": {
		id: "test.app",
		applicationVersion: {
			version: "1.0.0"
		},
		sourceTemplate: {
			id: "ui5template.smartTemplate"
		}
	}
};


const manifestFioriElementsBasedLowerCase = {
	"sap.app": {
		id: "test.app",
		applicationVersion: {
			version: "1.0.0"
		},
		sourceTemplate: {
			id: "ui5template.smarttemplate"
		}
	}
};

const completeChange = {
	id: "id_123_0_propertyChange",
	reference: "test.app",
	appVersion: "1.0.0",
	creation: 1585730948833,
	type: "propertyChange",
	controlId: "myTable",
	controlType: "sap.m.Table",
	projectId: "",
	isCustomer: true,
	creatingTool: "ava test",
	content: {
		"property": "exportToExcel",
		"newValue": true
	}
};


const changeInCreation = clone(completeChange, ["id", "reference", "appVersion", "projectId"]);

test("changeUtils parses", (t) => {
	const change = changeUtils.parse("{\"fileName\":\"id_1585730948833_0_propertyChange\",\"fileType\":\"change\",\"changeType\":\"propertyChange\",\"moduleName\":\"\",\"reference\":\"test.app\",\"packageName\":\"\",\"content\":{\"property\":\"exportToExcel\",\"newValue\":true},\"selector\":{\"id\":\"myTable\",\"idIsLocal\":false,\"type\":\"sap.m.Table\"},\"layer\":\"CUSTOMER_BASE\",\"texts\":{},\"namespace\":\"apps/test.app/changes/\",\"projectId\":\"test.app\",\"creation\":1585730948833,\"originalLanguage\":\"\",\"support\":{\"sapui5Version\": \"1.77.0\",\"generator\":\"changeUtils: ava test\",\"service\":\"\",\"user\":\"\",\"sourceChangeFileName\":\"\",\"compositeCommand\":\"\"},\"oDataInformation\":{},\"dependentSelector\":{},\"validAppVersions\":{\"from\":\"1.0.0\",\"to\":\"1.0.0\",\"creation\":\"1.0.0\"},\"jsOnly\":false,\"variantReference\":\"\",\"appDescriptorChange\":false}");
	t.deepEqual(change, {
		id: "id_1585730948833_0_propertyChange",
		type: "propertyChange",
		reference: "test.app",
		appVersion: "1.0.0",
		controlId: "myTable",
		controlType: "sap.m.Table",
		isCustomer: true,
		creatingTool: "ava test",
		creation: 1585730948833,
		sapui5Version: "1.77.0",
		projectId: "test.app",
		content: {
			"property": "exportToExcel",
			"newValue": true
		}
	}, "The change object should be parsed correct");
});

test("changeUtils parses with an empty projectId", (t) => {
	const change = changeUtils.parse("{\"fileName\":\"id_1585730948833_0_propertyChange\",\"fileType\":\"change\",\"changeType\":\"propertyChange\",\"moduleName\":\"\",\"reference\":\"test.app\",\"packageName\":\"\",\"content\":{\"property\":\"exportToExcel\",\"newValue\":true},\"selector\":{\"id\":\"myTable\",\"idIsLocal\":false,\"type\":\"sap.m.Table\"},\"layer\":\"CUSTOMER_BASE\",\"texts\":{},\"namespace\":\"apps/test.app/changes/\",\"projectId\":\"\",\"creation\":1585730948833,\"originalLanguage\":\"\",\"support\":{\"sapui5Version\": \"1.77.0\",\"generator\":\"changeUtils: ava test\",\"service\":\"\",\"user\":\"\",\"sourceChangeFileName\":\"\",\"compositeCommand\":\"\"},\"oDataInformation\":{},\"dependentSelector\":{},\"validAppVersions\":{\"from\":\"1.0.0\",\"to\":\"1.0.0\",\"creation\":\"1.0.0\"},\"jsOnly\":false,\"variantReference\":\"\",\"appDescriptorChange\":false}");
	t.deepEqual(change, {
		id: "id_1585730948833_0_propertyChange",
		type: "propertyChange",
		reference: "test.app",
		appVersion: "1.0.0",
		controlId: "myTable",
		controlType: "sap.m.Table",
		isCustomer: true,
		creatingTool: "ava test",
		creation: 1585730948833,
		sapui5Version: "1.77.0",
		projectId: "",
		content: {
			"property": "exportToExcel",
			"newValue": true
		}
	}, "The change object should be parsed correct");
});

test("changeUtils parses without validAppVersion (legacy change)", (t) => {
	const change = changeUtils.parse("{\"fileName\":\"id_1585730948833_0_propertyChange\",\"fileType\":\"change\",\"changeType\":\"propertyChange\",\"moduleName\":\"\",\"reference\":\"test.app\",\"packageName\":\"\",\"content\":{\"property\":\"exportToExcel\",\"newValue\":true},\"selector\":{\"id\":\"myTable\",\"idIsLocal\":false,\"type\":\"sap.m.Table\"},\"layer\":\"CUSTOMER_BASE\",\"texts\":{},\"namespace\":\"apps/test.app/changes/\",\"projectId\":\"\",\"creation\":1585730948833,\"originalLanguage\":\"\",\"support\":{\"sapui5Version\": \"1.77.0\",\"generator\":\"changeUtils: ava test\",\"service\":\"\",\"user\":\"\",\"sourceChangeFileName\":\"\",\"compositeCommand\":\"\"},\"oDataInformation\":{},\"dependentSelector\":{},\"jsOnly\":false,\"variantReference\":\"\",\"appDescriptorChange\":false}");
	t.deepEqual(change, {
		id: "id_1585730948833_0_propertyChange",
		type: "propertyChange",
		reference: "test.app",
		appVersion: "",
		controlId: "myTable",
		controlType: "sap.m.Table",
		isCustomer: true,
		creatingTool: "ava test",
		creation: 1585730948833,
		sapui5Version: "1.77.0",
		projectId: "",
		content: {
			"property": "exportToExcel",
			"newValue": true
		}
	}, "The change object should be parsed correct");
});

function testToString(t, propertiesToRemove = []) {
	const testChange = clone(changeInCreation, propertiesToRemove);
	const error = t.throws(changeUtils.toString.bind(undefined, testChange, manifest));
	t.is(error.message, "not all parameters of the change were provided");
}

test("changeUtils toString throws an error: no manifest and no reference/appVersion", (t) => {
	const error = t.throws(changeUtils.toString.bind(undefined, changeInCreation));
	t.is(error.message, "not all parameters of the change were provided");
});

test("changeUtils toString throws an error: no type", (t) => {
	testToString(t, ["type"], manifest);
});

test("changeUtils toString throws an error: no controlId", (t) => {
	testToString(t, ["controlId"], manifest);
});

test("changeUtils toString throws an error: no isCustomer", (t) => {
	testToString(t, ["isCustomer"], manifest);
});

test("changeUtils toString throws an error: no creatingTool", (t) => {
	testToString(t, ["creatingTool"], manifest);
});

test("changeUtils createChangeString create a change (manifest is provided)", (t) => {
	let stringifiedChange = changeUtils.createChangeString(changeInCreation, manifest);

	// replace uid & creation time
	stringifiedChange = stringifiedChange.replace(
		/"fileName":"id_.*_.*_propertyChange"/,
		"\"fileName\":\"id_123_0_propertyChange\""
	);
	stringifiedChange = stringifiedChange.replace(/"creation":[0-9]*/, "\"creation\":0");
	t.deepEqual(stringifiedChange, "{\"fileName\":\"id_123_0_propertyChange\",\"fileType\":\"change\",\"changeType\":\"propertyChange\",\"moduleName\":\"\",\"reference\":\"test.app\",\"packageName\":\"\",\"content\":{\"property\":\"exportToExcel\",\"newValue\":true},\"selector\":{\"id\":\"myTable\",\"idIsLocal\":false,\"type\":\"sap.m.Table\"},\"layer\":\"CUSTOMER_BASE\",\"texts\":{},\"namespace\":\"apps/test.app/changes/\",\"projectId\":\"\",\"creation\":0,\"originalLanguage\":\"\",\"support\":{\"generator\":\"changeUtils: ava test\",\"service\":\"\",\"user\":\"\",\"sourceChangeFileName\":\"\",\"compositeCommand\":\"\"},\"oDataInformation\":{},\"dependentSelector\":{},\"validAppVersions\":{\"from\":\"1.0.0\",\"to\":\"1.0.0\",\"creation\":\"1.0.0\"},\"jsOnly\":false,\"variantReference\":\"\",\"appDescriptorChange\":false}", "then the change string is generated correct");
});

test("changeUtils createChangeString create a change (manifest is provided based on fiori elements)", (t) => {
	let stringifiedChange = changeUtils.createChangeString(changeInCreation, manifestFioriElementsBased);

	// replace uid & creation time
	stringifiedChange = stringifiedChange.replace(
		/"fileName":"id_.*_.*_propertyChange"/,
		"\"fileName\":\"id_123_0_propertyChange\""
	);
	stringifiedChange = stringifiedChange.replace(/"creation":[0-9]*/, "\"creation\":0");
	t.deepEqual(stringifiedChange, "{\"fileName\":\"id_123_0_propertyChange\",\"fileType\":\"change\",\"changeType\":\"propertyChange\",\"moduleName\":\"\",\"reference\":\"test.app\",\"packageName\":\"\",\"content\":{\"property\":\"exportToExcel\",\"newValue\":true},\"selector\":{\"id\":\"myTable\",\"idIsLocal\":false,\"type\":\"sap.m.Table\"},\"layer\":\"CUSTOMER_BASE\",\"texts\":{},\"namespace\":\"apps/test.app/changes/\",\"projectId\":\"test.app\",\"creation\":0,\"originalLanguage\":\"\",\"support\":{\"generator\":\"changeUtils: ava test\",\"service\":\"\",\"user\":\"\",\"sourceChangeFileName\":\"\",\"compositeCommand\":\"\"},\"oDataInformation\":{},\"dependentSelector\":{},\"validAppVersions\":{\"from\":\"1.0.0\",\"to\":\"1.0.0\",\"creation\":\"1.0.0\"},\"jsOnly\":false,\"variantReference\":\"\",\"appDescriptorChange\":false}", "then the change string is generated correct");
});

test("changeUtils createChangeString create a change (manifest is provided based on fiori elements with a lower case smarttemplate property in the manfiest)", (t) => {
	let stringifiedChange = changeUtils.createChangeString(changeInCreation, manifestFioriElementsBasedLowerCase);

	// replace uid & creation time
	stringifiedChange = stringifiedChange.replace(
		/"fileName":"id_.*_.*_propertyChange"/,
		"\"fileName\":\"id_123_0_propertyChange\""
	);
	stringifiedChange = stringifiedChange.replace(/"creation":[0-9]*/, "\"creation\":0");
	t.deepEqual(stringifiedChange, "{\"fileName\":\"id_123_0_propertyChange\",\"fileType\":\"change\",\"changeType\":\"propertyChange\",\"moduleName\":\"\",\"reference\":\"test.app\",\"packageName\":\"\",\"content\":{\"property\":\"exportToExcel\",\"newValue\":true},\"selector\":{\"id\":\"myTable\",\"idIsLocal\":false,\"type\":\"sap.m.Table\"},\"layer\":\"CUSTOMER_BASE\",\"texts\":{},\"namespace\":\"apps/test.app/changes/\",\"projectId\":\"test.app\",\"creation\":0,\"originalLanguage\":\"\",\"support\":{\"generator\":\"changeUtils: ava test\",\"service\":\"\",\"user\":\"\",\"sourceChangeFileName\":\"\",\"compositeCommand\":\"\"},\"oDataInformation\":{},\"dependentSelector\":{},\"validAppVersions\":{\"from\":\"1.0.0\",\"to\":\"1.0.0\",\"creation\":\"1.0.0\"},\"jsOnly\":false,\"variantReference\":\"\",\"appDescriptorChange\":false}", "then the change string is generated correct");
});



test("changeUtils toString strigifies a change again (id, reference, appVersion provided; manifest not provided)", (t) => {
	const stringifiedChange = changeUtils.toString(completeChange);
	t.deepEqual(stringifiedChange, "{\"fileName\":\"id_123_0_propertyChange\",\"fileType\":\"change\",\"changeType\":\"propertyChange\",\"moduleName\":\"\",\"reference\":\"test.app\",\"packageName\":\"\",\"content\":{\"property\":\"exportToExcel\",\"newValue\":true},\"selector\":{\"id\":\"myTable\",\"idIsLocal\":false,\"type\":\"sap.m.Table\"},\"layer\":\"CUSTOMER_BASE\",\"texts\":{},\"namespace\":\"apps/test.app/changes/\",\"projectId\":\"\",\"creation\":1585730948833,\"originalLanguage\":\"\",\"support\":{\"generator\":\"changeUtils: ava test\",\"service\":\"\",\"user\":\"\",\"sourceChangeFileName\":\"\",\"compositeCommand\":\"\"},\"oDataInformation\":{},\"dependentSelector\":{},\"validAppVersions\":{\"from\":\"1.0.0\",\"to\":\"1.0.0\",\"creation\":\"1.0.0\"},\"jsOnly\":false,\"variantReference\":\"\",\"appDescriptorChange\":false}", "then the change string is generated correct");
});

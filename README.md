# @ui5/flexibility-utils

##Description
This project provides an API to create SAPUI5 flexibility change files outside of a ui5 run time.

It enables tools to create UI5 flexibility changes without the need of a runtime environment or access to and knowledge about ui5 internals.



The first section of your file should start with the description of your project. Describe your project, why it exists, what it should provide to the user, and what differentiates it from any other project available.

The 1-2 sentence description used to create the project is the minimum requirement, but more text is preferred. The expectation is that the developer who reads this can use this text to determine if this project is the correct software for their needs and goals.

If your project is in an early stage and is not yet ready to be used productively, please mention this explicitly.

##Requirements
* Node.js

##Installation
~~~
npm install --global @ui5/flexibility-utils

# Verify installation
npm view @ui5/flexibility-utils version
~~~

##Usage
~~~
flexibilityUtils = require("@ui5/flexibility-utils");
let initialChangeData = {...}
let changeString = flexibilityUtils.change.createChangeString(initialChangeData, manifest)
let parsedChange = flexibilityUtils.change.parse(changeString)
let changeString2 = flexibilityUtils.change.toString(parsedChange)
~~~

![Data Flow](./dataflow.jpg)

For more details about the functions and types read the [JSDoc](jsdoc/index.html).

##Known Issues
No issues are currently known.

##How to obtain support
In case you need any support, please create a GitHub issue.

License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file and all other files in this repository are licensed under the Apache License, v 2.0 except as noted otherwise in the [LICENSE file](LICENSE.txt).


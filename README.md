# @ui5/flexibility-utils

## Description
This project provides an API to create SAPUI5 flexibility change files outside of a ui5 run time.

It enables tools to create UI5 flexibility changes without the need of a runtime environment or access to and knowledge about ui5 internals.

## Requirements
* Node.js

## Installation
~~~
npm install --global @ui5/flexibility-utils

# Verify installation
npm view @ui5/flexibility-utils version
~~~

## Usage
~~~
flexibilityUtils = require("@ui5/flexibility-utils");
let changeDefinitionInCreation = {...}
let stringifiedChange = flexibilityUtils.change.createChangeString(changeDefinitionInCreation, manifest)
let changeDefinition = flexibilityUtils.change.parse(stringifiedChange)
stringifiedChange = flexibilityUtils.change.toString(changeDefinition)
~~~

![Data Flow](./dataflow.jpg)

For more details about the functions and types read the [JSDoc](jsdoc/index.html).

## Known Issues
No issues are currently known.

## How to obtain support
In case you need any support, please create a GitHub issue.

License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file and all other files in this repository are licensed under the Apache License, v 2.0 except as noted otherwise in the [LICENSE file](LICENSE.txt).


/*
  Copyright 2019-2021 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
/* global it, describe */

const assert = require("assert"),
      testID = "PO002",
      debug = require("debug")("apigeelint:" + testID),
      Bundle = require("../../lib/package/Bundle.js"),
      bl = require("../../lib/package/bundleLinter.js"),
      Policy = require("../../lib/package/Policy.js"),
      Step = require("../../lib/package/Step.js"),
      Flow = require("../../lib/package/Flow.js"),
      plugin = require(bl.resolvePlugin(testID)),
      Dom = require("@xmldom/xmldom").DOMParser,
      test = function(caseNum, exp, stepExp, flowExp, assertion) {
        it(`tests case ${caseNum}, expect(${assertion})`,
           function() {
             let pDoc = new Dom().parseFromString(exp),
                 sDoc,
                 fDoc,
                 p = new Policy(pDoc.documentElement, this),
                 s,
                 f;

             p.addMessage = function(msg) {
               debug(msg);
             };
             p.getElement = function() {
               return pDoc.documentElement;
             };
             p.getSteps = function() {
               if (s) return [s];
               return [];
             };

             if (flowExp) {
               fDoc = new Dom().parseFromString(flowExp);
               f = new Flow(fDoc.documentElement, null);
             }

             if (stepExp) {
               sDoc = new Dom().parseFromString(stepExp);
               s = new Step(sDoc.documentElement, f);
             }

             plugin.onPolicy(p, function(err,result) {
               assert.equal(err, undefined, err ? " err " : " no err");
               assert.equal(
                 result,
                 assertion,
                 result
                   ? "warning/error was returned"
                   : "warning/error was not returned"
               );
             });
           }
          );
      };

//now generate a full report and check the format of the report

describe(`${testID} - ${plugin.plugin.name}`, function() {

  test(
    1,
    `<XMLThreatProtection async="false" continueOnError="false" enabled="true" name="XML-Threat-Protection-1">
     <DisplayName>XML Threat Protection 1</DisplayName>
     <NameLimits>
        <Element>10</Element>
        <Attribute>10</Attribute>
        <NamespacePrefix>10</NamespacePrefix>
        <ProcessingInstructionTarget>10</ProcessingInstructionTarget>
     </NameLimits>
     <Source>request</Source>
     <StructureLimits>
        <NodeDepth>5</NodeDepth>
        <AttributeCountPerElement>2</AttributeCountPerElement>
        <NamespaceCountPerElement>3</NamespaceCountPerElement>
        <ChildCount includeComment="true" includeElement="true" includeProcessingInstruction="true" includeText="true">3</ChildCount>
     </StructureLimits>
     <ValueLimits>
        <Text>15</Text>
        <Attribute>10</Attribute>
        <NamespaceURI>10</NamespaceURI>
        <Comment>10</Comment>
        <ProcessingInstructionData>10</ProcessingInstructionData>
     </ValueLimits>
  </XMLThreatProtection>`,
    null,
    null,
    false //not attached
  );

  test(
    2,
    `<XMLThreatProtection async="false" continueOnError="false" enabled="true" name="XML-Threat-Protection-1">
     <DisplayName>XML Threat Protection 1</DisplayName>
     <NameLimits>
        <Element>10</Element>
        <Attribute>10</Attribute>
        <NamespacePrefix>10</NamespacePrefix>
        <ProcessingInstructionTarget>10</ProcessingInstructionTarget>
     </NameLimits>
     <Source>request</Source>
     <StructureLimits>
        <NodeDepth>5</NodeDepth>
        <AttributeCountPerElement>2</AttributeCountPerElement>
        <NamespaceCountPerElement>3</NamespaceCountPerElement>
        <ChildCount includeComment="true" includeElement="true" includeProcessingInstruction="true" includeText="true">3</ChildCount>
     </StructureLimits>
     <ValueLimits>
        <Text>15</Text>
        <Attribute>10</Attribute>
        <NamespaceURI>10</NamespaceURI>
        <Comment>10</Comment>
        <ProcessingInstructionData>10</ProcessingInstructionData>
     </ValueLimits>
  </XMLThreatProtection>`,
    `<Step>
      <Condition>message.content != ""</Condition>
      <Name>XML-Threat-Protection-1</Name>
  </Step>`,
    null,
    false //attached good condition
  );

  test(
    3,
    `<XMLThreatProtection async="false" continueOnError="false" enabled="true" name="XML-Threat-Protection-1">
     <DisplayName>XML Threat Protection 1</DisplayName>
     <NameLimits>
        <Element>10</Element>
        <Attribute>10</Attribute>
        <NamespacePrefix>10</NamespacePrefix>
        <ProcessingInstructionTarget>10</ProcessingInstructionTarget>
     </NameLimits>
     <Source>request</Source>
     <StructureLimits>
        <NodeDepth>5</NodeDepth>
        <AttributeCountPerElement>2</AttributeCountPerElement>
        <NamespaceCountPerElement>3</NamespaceCountPerElement>
        <ChildCount includeComment="true" includeElement="true" includeProcessingInstruction="true" includeText="true">3</ChildCount>
     </StructureLimits>
     <ValueLimits>
        <Text>15</Text>
        <Attribute>10</Attribute>
        <NamespaceURI>10</NamespaceURI>
        <Comment>10</Comment>
        <ProcessingInstructionData>10</ProcessingInstructionData>
     </ValueLimits>
  </XMLThreatProtection>`,
    `<Step>
      <Condition>foo != ""</Condition>
      <Name>XML-Threat-Protection-1</Name>
  </Step>`,
    null,
    true //attached insufficient condition
  );

  test(
    4,
    `<XMLThreatProtection async="false" continueOnError="false" enabled="true" name="XML-Threat-Protection-1">
     <DisplayName>XML Threat Protection 1</DisplayName>
     <NameLimits>
        <Element>10</Element>
        <Attribute>10</Attribute>
        <NamespacePrefix>10</NamespacePrefix>
        <ProcessingInstructionTarget>10</ProcessingInstructionTarget>
     </NameLimits>
     <Source>request</Source>
     <StructureLimits>
        <NodeDepth>5</NodeDepth>
        <AttributeCountPerElement>2</AttributeCountPerElement>
        <NamespaceCountPerElement>3</NamespaceCountPerElement>
        <ChildCount includeComment="true" includeElement="true" includeProcessingInstruction="true" includeText="true">3</ChildCount>
     </StructureLimits>
     <ValueLimits>
        <Text>15</Text>
        <Attribute>10</Attribute>
        <NamespaceURI>10</NamespaceURI>
        <Comment>10</Comment>
        <ProcessingInstructionData>10</ProcessingInstructionData>
     </ValueLimits>
  </XMLThreatProtection>`,
    `<Step>
      <Condition>foo != ""</Condition>
      <Name>XML-Threat-Protection-1</Name>
  </Step>`,
    `<Flow name="flow2">
          <Step>
              <Condition>foo != ""</Condition>
              <Name>XML-Threat-Protection-1</Name>
          </Step>
          <Condition/>
      </Flow>`,
    true //attached insufficient condition
  );

  test(
    5,
    `<XMLThreatProtection async="false" continueOnError="false" enabled="true" name="XML-Threat-Protection-1">
     <DisplayName>XML Threat Protection 1</DisplayName>
     <NameLimits>
        <Element>10</Element>
        <Attribute>10</Attribute>
        <NamespacePrefix>10</NamespacePrefix>
        <ProcessingInstructionTarget>10</ProcessingInstructionTarget>
     </NameLimits>
     <Source>request</Source>
     <StructureLimits>
        <NodeDepth>5</NodeDepth>
        <AttributeCountPerElement>2</AttributeCountPerElement>
        <NamespaceCountPerElement>3</NamespaceCountPerElement>
        <ChildCount includeComment="true" includeElement="true" includeProcessingInstruction="true" includeText="true">3</ChildCount>
     </StructureLimits>
     <ValueLimits>
        <Text>15</Text>
        <Attribute>10</Attribute>
        <NamespaceURI>10</NamespaceURI>
        <Comment>10</Comment>
        <ProcessingInstructionData>10</ProcessingInstructionData>
     </ValueLimits>
  </XMLThreatProtection>`,
    ` <Step>
          <Condition>foo != ""</Condition>
          <Name>XML-Threat-Protection-1</Name>
      </Step>`,
    ` <Flow name="flow2">
          <Step>
              <Condition>foo != ""</Condition>
              <Name>XML-Threat-Protection-1</Name>
          </Step>
          <Condition>message.content != ""</Condition>
      </Flow>`,
    false //attached sufficient condition
  );

  test(
    6,
    '<RegularExpressionProtection async="false" continueOnError="false" enabled="true" name="regExLookAround"><DisplayName>regExLookAround</DisplayName><Source>request</Source><IgnoreUnresolvedVariables>false</IgnoreUnresolvedVariables><URIPath><Pattern>(?/(@?[w_?w:*]+([[^]]+])*)?)+</Pattern></URIPath></RegularExpressionProtection>',
    null,
    null,
    false //not extractVar
  );

  debug("test configuration: " + JSON.stringify(configuration));

  var bundle = new Bundle(configuration);
  bl.executePlugin(testID, bundle);

  //need a case where we are using ref for the key
  //also prefix

  describe(`Print plugin results (${testID})`, function() {
    let report = bundle.getReport(),
        formatter = bl.getFormatter("json.js");

    if (!formatter) {
      assert.fail("formatter implementation not defined");
    }
    it("should create a report object with valid schema", function() {
      let schema = require("./../fixtures/reportSchema.js"),
          Validator = require("jsonschema").Validator,
          v = new Validator(),
          jsonReport = JSON.parse(formatter(bundle.getReport())),
          validationResult = v.validate(jsonReport, schema);
      assert.equal(
        validationResult.errors.length,
        0,
        validationResult.errors
      );
    });

  });

  var stylimpl = bl.getFormatter("unix.js");
  var stylReport = stylimpl(bundle.getReport());
  debug("unix formatted report: \n" + stylReport);
});

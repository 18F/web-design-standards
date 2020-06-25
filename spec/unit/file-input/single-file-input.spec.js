const assert = require("assert");
const fileInput = require("../../../src/js/components/file-input");
const fs = require("fs");
const path = require("path");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/single-file-input.template.html"));

describe("file input: single file input", () => {
 const { body } = document;

 let dropZone;
 let dragText;

 beforeEach(() => {
   body.innerHTML = TEMPLATE;
   fileInput.on();
   dragText = body.querySelector(".usa-file-input__drag-text")
   fileInput.on(body);
 });

 afterEach(() => {
   body.innerHTML = "";
   fileInput.off(body);
 });

 it('uses singular "file" if there is not a "multiple" attribute', () => {
   assert.equal(dragText.innerHTML, "Drag file here or ")
 });

})
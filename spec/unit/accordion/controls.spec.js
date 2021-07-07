const Accordion = require("../../../src/js/components/accordion");
const assert = require("assert");
const fs = require("fs");
const { it } = require("mocha");

const TEMPLATE = fs.readFileSync(`${__dirname}/controls-template.html`);

// `aria` prefixed attributes
const EXPANDED = "aria-expanded";

// Accordion expand/collapse control classes
const BUTTON_CONTROL_ALL = "usa-accordion__control-all";

describe("accordion controls behavior", () => {
  const { body } = document;

  let root;
  let buttons;
  let controlAllBtn;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    Accordion.on();

    root = body.querySelector(".usa-accordion");
    [controlAllBtn] = root.querySelectorAll(`.${BUTTON_CONTROL_ALL}`);
    buttons = root.querySelectorAll(".usa-accordion__button");
  });

  afterEach(() => {
    body.innerHTML = "";
    Accordion.off();
  });

  describe("DOM state", () => {
    it('Controls has an "aria-expanded" attribute', () => {
      assert(controlAllBtn.getAttribute(EXPANDED));
    });
    it('Has a "Control All" button', () => {
      assert(controlAllBtn);
    });
    it('All items collapsed by default', () => {
      buttons.forEach((button) => {
        assert.strictEqual(button.getAttribute(EXPANDED), 'false');
      });
    })
  });

  describe("interaction", () => {
    it("Expands all accordions on click", () => {
      controlAllBtn.click();
      buttons.forEach((button) => {
        assert.strictEqual(button.getAttribute(EXPANDED), 'true');
      });
    });
    it("Collapses all accordions on second click", () => {
      controlAllBtn.click();
      controlAllBtn.click();
      buttons.forEach((button) => {
        assert.strictEqual(button.getAttribute(EXPANDED), 'false');
      });
    });
  });
});

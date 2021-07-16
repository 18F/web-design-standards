const assert = require("assert");
const fs = require("fs");
const path = require("path");

const modal = require("../../../src/js/components/modal");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "template.html"));

describe("Modal window", () => {
  const { body } = document;

  let closeButton;
  let modalWrapper;
  let modalWindow;
  let openButton1;
  let openButton2;
  let overlay;

  const isVisible = el => el.classList.contains("is-visible");

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    modal.on();
    closeButton = body.querySelector("#close-button");
    modalWrapper = body.querySelector(".usa-modal-wrapper");
    modalWindow = body.querySelector(".usa-modal");
    overlay = body.querySelector(".usa-modal-overlay");
    openButton1 = body.querySelector("#open-button1");
    openButton2 = body.querySelector("#open-button2");
  });

  afterEach(() => {
    body.innerHTML = "";
    body.className = "";
    modal.off();
  });

  describe("Builds the modal HTML", () => {

    it('creates new parent elements', () => {
      assert.ok(modalWindow, "creates inner div");
      assert.ok(overlay, "creates the overlay");
      assert.ok(modalWrapper, "creates the outer div");
    });

    it('adds role="dialog" to modal parent', () => {
      assert.strictEqual(modalWrapper.getAttribute("role"), "dialog");
    });

    it('moves aria-lableledby, aria-describedby, and id to the parent', () => {
      assert.strictEqual(modalWindow.hasAttribute("aria-describedby"), false);
      assert.strictEqual(modalWindow.hasAttribute("aria-labelledby"), false);
      assert.strictEqual(modalWindow.hasAttribute("id"), false);
      assert.strictEqual(modalWrapper.hasAttribute("aria-describedby"), true);
      assert.strictEqual(modalWrapper.hasAttribute("aria-labelledby"), true);
      assert.strictEqual(modalWrapper.getAttribute("id"), "modal");
    })

    it('sets tabindex="-1" to the modal window', () => {
      assert.strictEqual(modalWindow.getAttribute("tabindex"), "-1");
    });

    it('moves the modal to the bottom of the DOM', () => {
      assert.strictEqual(body.lastElementChild.classList.contains("usa-modal-wrapper"), true);
    });

    it('adds role="button" to any <a> opener, but not <button>', () => {
      assert.strictEqual(openButton1.getAttribute("role"), "button");
      assert.strictEqual(openButton2.hasAttribute("role"), false);
    })

    it('adds aria-controls to each opener', () => {
      assert.strictEqual(openButton1.getAttribute("aria-controls"), "modal");
      assert.strictEqual(openButton2.getAttribute("aria-controls"), "modal");
    })
  });

  describe("When opened", () => {
    beforeEach(() => {
      openButton1.click();
    });

    it("makes the modal visible", () => {
      assert.strictEqual(isVisible(modalWrapper), true);
    });

    it("focuses the modal window when opened", () => {
      assert.strictEqual(document.activeElement, modalWindow);
    });

    it("makes all other page content invisible to screen readers", () => {
      const activeContent = document.querySelectorAll("body > :not([aria-hidden])");
      assert.strictEqual(activeContent.length, 1);
      assert.strictEqual(activeContent[0], modalWrapper);
    });
  });

  describe("When closing", () => {

    beforeEach(() => {
      openButton2.click();
    });

    it("hides the modal when close button is clicked", () => {
      closeButton.click();
      assert.strictEqual(isVisible(modalWrapper), false);
    });

    it("closes the modal when the overlay is clicked", () => {
      overlay.click();
      assert.strictEqual(isVisible(modalWrapper), false);
    });

    it("sends focus to the element that opened it", () => {
      closeButton.click();
      assert.strictEqual(document.activeElement, openButton2);
    });

    it("restores other page content screen reader visibility", () => {
      closeButton.click();
      const activeContent = document.querySelectorAll("body > :not([aria-hidden])");
      const staysHidden = document.getElementById("stays-hidden");
      assert.strictEqual(activeContent.length, 4);
      assert.strictEqual(staysHidden.hasAttribute("aria-hidden"), true);
    });
  });
});

const sinon = require("sinon");

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el = document.activeElement) => {
  const evt = new KeyboardEvent("input", {
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a click event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.click = (el = document.activeElement) => {
  const evt = new MouseEvent("click", {
    view: el.ownerDocument.defaultView,
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a focusout event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.focusout = (el = document.activeElement) => {
  const evt = new Event("focusout", {
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Enter event
 * @param {HTMLElement} el the element to sent the event to
 * @returns {{preventDefaultSpy: sinon.SinonSpy<[], void>}}
 */
EVENTS.keydownEnter = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    keyCode: 13,
    key: "Enter"
  });
  const preventDefaultSpy = sinon.spy(evt, "preventDefault");
  el.dispatchEvent(evt);
  return { preventDefaultSpy };
};

/**
 * send a keyup Enter event
 * @param {HTMLElement} el the element to sent the event to
 * @returns {{preventDefaultSpy: sinon.SinonSpy<[], void>}}
 */
EVENTS.keyupEnter = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keyup", {
    bubbles: true,
    keyCode: 13,
    key: "Enter"
  });
  const preventDefaultSpy = sinon.spy(evt, "preventDefault");
  el.dispatchEvent(evt);
  return { preventDefaultSpy };
};

/**
 * send a keydown Escape event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownEscape = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Escape"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Space event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownSpace = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    keyCode: 32,
    key: " "
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowDown"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowUp"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowLeft event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowLeft = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowLeft"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowRight event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowRight = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowRight"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Home event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownHome = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Home"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown End event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownEnd = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "End"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown PageUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownPageUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "PageUp"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown PageDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownPageDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "PageDown"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Shift + PageUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownShiftPageUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "PageUp",
    shiftKey: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Shift + PageDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownShiftPageDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "PageDown",
    shiftKey: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a mouseover event
 * @param {HTMLElement} el the element to sent the event to
 *
 */
EVENTS.mouseover = el => {
  const evt = new MouseEvent("mouseover", {
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Tab event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownTab = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Tab",
    keyCode: 9
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Shift + Tab event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownShiftTab = (el = document.activeElement) => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Tab",
    keyCode: 9,
    shiftKey: true
  });
  el.dispatchEvent(evt);
};

module.exports = EVENTS;

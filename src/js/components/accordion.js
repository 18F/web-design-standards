const select = require("../utils/select");
const behavior = require("../utils/behavior");
const toggle = require("../utils/toggle");
const isElementInViewport = require("../utils/is-in-viewport");
const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const ACCORDION = `.${PREFIX}-accordion, .${PREFIX}-accordion--bordered`;
const BUTTON = `.${PREFIX}-accordion__button[aria-controls]`;
const BUTTON_CONTROL_ALL = `.${PREFIX}-accordion__control-all`;
const EXPANDED = "aria-expanded";
const MULTISELECTABLE = "aria-multiselectable";

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
const getAccordionButtons = (accordion) => {
  const buttons = select(BUTTON, accordion);

  return buttons.filter((button) => button.closest(ACCORDION) === accordion);
};

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
const toggleButton = (button, expanded) => {
  const accordion = button.closest(ACCORDION);
  let safeExpanded = expanded;

  if (!accordion) {
    throw new Error(`${BUTTON} is missing outer ${ACCORDION}`);
  }

  safeExpanded = toggle(button, expanded);

  // XXX multiselectable is opt-in, to preserve legacy behavior
  const multiselectable = accordion.getAttribute(MULTISELECTABLE) === "true";

  if (safeExpanded && !multiselectable) {
    getAccordionButtons(accordion).forEach((other) => {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
};

/**
 * Toggle the Collapse/Expand all text label.
 * @param {HTMLElement} button
 */
const toggleText = (element) => {
  let controlBtn = element;

  const originalString = controlBtn.textContent.trim();
  const startText = controlBtn.getAttribute("data-label--expanded");
  const endText = controlBtn.getAttribute("data-label--collapsed");

  controlBtn.textContent = (originalString === startText) ? endText : startText;
}

const toggleAll = (buttonAll) => {
  const controlAllBtn = buttonAll.closest(BUTTON_CONTROL_ALL);
  const accordion = controlAllBtn.closest(ACCORDION);
  const buttons = accordion.querySelectorAll(BUTTON);

  let accordionIsExpanded = controlAllBtn.getAttribute(EXPANDED) === "true";

  toggleText(controlAllBtn);
  controlAllBtn.setAttribute("aria-expanded", !accordionIsExpanded);
  buttons.forEach((button) => toggle(button, !accordionIsExpanded));
}


/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
const showButton = (button) => toggleButton(button, true);

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
const hideButton = (button) => toggleButton(button, false);

const accordion = behavior(
  {
    [CLICK]: {
      [BUTTON](event) {
        event.preventDefault();

        toggleButton(this);

        if (this.getAttribute(EXPANDED) === "true") {
          // We were just expanded, but if another accordion was also just
          // collapsed, we may no longer be in the viewport. This ensures
          // that we are still visible, so the user isn't confused.
          if (!isElementInViewport(this)) this.scrollIntoView();
        }
      },
      [BUTTON_CONTROL_ALL](event) {
        event.preventDefault();
        toggleAll(this);
      }
    },
  },
  {
    init(root) {
      select(BUTTON, root).forEach((button) => {
        const expanded = button.getAttribute(EXPANDED) === "true";
        toggleButton(button, expanded);
      });
    },
    ACCORDION,
    BUTTON,
    show: showButton,
    hide: hideButton,
    toggle: toggleButton,
    getButtons: getAccordionButtons
  }
);

module.exports = accordion;

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker.template.html")
);

describe("date picker component mouse move selection", () => {
  const { body } = document;

  let root;
  let input;
  let button;

  const getCalendarEl = () => root.querySelector(".usa-date-picker__calendar");

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
    root = body.querySelector(".usa-date-picker");
    input = root.querySelector(".usa-date-picker__external-input");
    button = root.querySelector(".usa-date-picker__button");
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
  });

  it("should ignore mouse move events over disabled days", () => {
    root.dataset.minDate = "2020-06-01";
    root.dataset.maxDate = "2020-06-24";
    input.value = "6/20/2020";
    EVENTS.click(button);
    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-06-20",
      "focuses correct date"
    );

    EVENTS.mouseover(
      getCalendarEl().querySelector(
        '.usa-date-picker__calendar__date[data-day="26"]'
      )
    );

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-06-20",
      "does not focus disabled day"
    );
  });

  it("should update the focus when moving over a non-selected valid day", () => {
    root.dataset.minDate = "2020-06-01";
    root.dataset.maxDate = "2020-06-24";
    input.value = "6/20/2020";
    EVENTS.click(button);
    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-06-20",
      "focuses correct date"
    );

    EVENTS.mouseover(
      getCalendarEl().querySelector(
        '.usa-date-picker__calendar__date[data-day="19"]'
      )
    );

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-06-19",
      "focuses correct date"
    );
  });

  it("should ignore mouse event on the same day", () => {
    root.dataset.minDate = "2020-06-01";
    root.dataset.maxDate = "2020-06-24";
    input.value = "6/20/2020";
    EVENTS.click(button);
    getCalendarEl().dataset.wouldDisappearOnRerender = "true";
    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-06-20",
      "focuses correct date"
    );

    EVENTS.mouseover(
      getCalendarEl().querySelector(
        '.usa-date-picker__calendar__date[data-day="20"]'
      )
    );

    assert.strictEqual(
      getCalendarEl().dataset.wouldDisappearOnRerender,
      "true",
      "calendar did not rerender"
    );
    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__date--focused").dataset.value,
      "2020-06-20",
      "focuses correct date"
    );
  });
});

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker.template.html")
);

describe("date picker component month selection", () => {
  const { body } = document;

  let root;
  let input;
  let button;

  const getCalendarEl = (query) =>
    root.querySelector(
      ".usa-date-picker__calendar" + (query ? ` ${query}` : "")
    );

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
    root = body.querySelector(".usa-date-picker");
    input = root.querySelector(".usa-date-picker__external-input");
    button = root.querySelector(".usa-date-picker__button");
  });

  beforeEach("Open month selection view", () => {
    input.value = "6/20/2020";
    EVENTS.click(button);
    EVENTS.click(getCalendarEl(".usa-date-picker__calendar__month-selection"));
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
  });

  it("should show month of June as focused", () => {
    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "June",
      "focuses correct month"
    );
  });

  it("should show month of June as selected", () => {
    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--selected").dataset
        .label,
      "June",
      "selects correct month"
    );
  });

  it("should navigate back three months when pressing up", () => {
    EVENTS.keydownArrowUp();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "March",
      "focuses correct month"
    );
  });

  it("should navigate ahead three months when pressing down", () => {
    EVENTS.keydownArrowDown();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "September",
      "focuses correct month"
    );
  });

  it("should navigate back one month when pressing left", () => {
    EVENTS.keydownArrowLeft();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "May",
      "focuses correct month"
    );
  });

  it("should navigate ahead one month when pressing right", () => {
    EVENTS.keydownArrowRight();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "July",
      "focuses correct month"
    );
  });

  it("should navigate to the beginning of the month row when pressing home", () => {
    EVENTS.keydownHome();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "April",
      "focuses correct month"
    );
  });

  it("should navigate to the end of the month row when pressing end", () => {
    EVENTS.keydownEnd();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "June",
      "focuses correct month"
    );
  });

  it("should navigate to January when pressing page up", () => {
    EVENTS.keydownPageUp();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "January",
      "focuses correct month"
    );
  });

  it("should navigate to December when pressing page down", () => {
    EVENTS.keydownPageDown();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "December",
      "focuses correct month"
    );
  });

  it("should update the focus when moving over a non-selected valid month", () => {
    EVENTS.mouseover(
      getCalendarEl().querySelector(
        '.usa-date-picker__calendar__month[data-label="October"]'
      )
    );

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__month--focused").dataset.label,
      "October",
      "focuses correct month"
    );
  });
});

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker.template.html")
);

describe("date picker component year selection", () => {
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

  beforeEach("Open year selection view", () => {
    input.value = "6/20/2020";
    EVENTS.click(button);
    EVENTS.click(getCalendarEl(".usa-date-picker__calendar__year-selection"));
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
  });

  it("should show year of 2020 as focused", () => {
    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2020",
      "focuses correct year"
    );
  });

  it("should show year of 2020 as selected", () => {
    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--selected").dataset.value,
      "2020",
      "selects correct year"
    );
  });

  it("should navigate back three years when pressing up", () => {
    EVENTS.keydownArrowUp();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2017",
      "focuses correct year"
    );
  });

  it("should navigate ahead three years when pressing down", () => {
    EVENTS.keydownArrowDown();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2023",
      "focuses correct year"
    );
  });

  it("should navigate back one year when pressing left", () => {
    EVENTS.keydownArrowLeft();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2019",
      "focuses correct year"
    );
  });

  it("should navigate ahead one year when pressing right", () => {
    EVENTS.keydownArrowRight();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2021",
      "focuses correct year"
    );
  });

  it("should navigate to the beginning of the year row when pressing home", () => {
    EVENTS.keydownHome();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2019",
      "focuses correct year"
    );
  });

  it("should navigate to the end of the year row when pressing end", () => {
    EVENTS.keydownEnd();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2021",
      "focuses correct year"
    );
  });

  it("should navigate back 12 years when pressing page up", () => {
    EVENTS.keydownPageUp();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2008",
      "focuses correct year"
    );
  });

  it("should navigate forward 12 years when pressing page down", () => {
    EVENTS.keydownPageDown();

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2032",
      "focuses correct year"
    );
  });

  it("should update the focus when moving over a non-selected valid year", () => {
    EVENTS.mouseover(
      getCalendarEl().querySelector(
        '.usa-date-picker__calendar__year[data-value="2022"]'
      )
    );

    assert.strictEqual(
      getCalendarEl(".usa-date-picker__calendar__year--focused").dataset.value,
      "2022",
      "focuses correct year"
    );
  });
});

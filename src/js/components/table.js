const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const TABLE = `.${PREFIX}-table`;
const SORTED = "aria-sort";
const ASCENDING = "ascending";
const DESCENDING = "descending";
const SORT_OVERRIDE = "data-sort-value";

const ICON_SOURCE = `
  <svg class="${PREFIX}-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g class="descending" fill="transparent">
      <path d="M19,15l-1.41-1.41L13,18.17V2H11v16.17l-4.59-4.59L5,15l7,7L19,15z"/>
    </g>
    <g class="ascending" fill="transparent">
      <path transform="rotate(180, 12, 12)" d="M19,15l-1.41-1.41L13,18.17V2H11v16.17l-4.59-4.59L5,15l7,7L19,15z"/>
    </g>
    <g class="unsorted" fill="transparent">
      <polygon points="15.17 15 13 17.17 13 6.83 15.17 9 16.58 7.59 12 3 7.41 7.59 8.83 9 11 6.83 11 17.17 8.83 15 7.42 16.41 12 21 16.59 16.41 15.17 15"/>
    </g>
  </svg>
`;

const SORT_BUTTON_CLASS = `${PREFIX}-table__header__button`;
const SORT_BUTTON = `.${SORT_BUTTON_CLASS}`;
const SORTABLE_HEADER = `th[data-sortable]`;
const ANNOUNCEMENT_REGION = `.${PREFIX}-table__announcement-region[aria-live="polite"]`;


/** Gets the data-sort-value attribute value, if provided — otherwise, gets
 * the innerText or textContent — of the child element (HTMLTableCellElement)
 * at the specified index of the given table row
 *
 * @param {number} index
 * @param {array<HTMLTableRowElement>} tr
 * @return {boolean}
 */
const getCellValue = (tr, index) => tr.children[index].getAttribute(SORT_OVERRIDE)
  || tr.children[index].innerText
  || tr.children[index].textContent;

/**
 * Compares the values of two row array items at the given index, then sorts by the given direction
 * @param {number} index
 * @param {string} direction
 * @return {boolean}
 */
const compareFunction = (index, direction) => (a, b) => ((v1, v2) =>
    // if neither value is empty, and if both values are already numbers, compare numerically. Otherwise, compare alphabetically based on current user locale
    v1 !== '' && v2 !== '' && !Number.isNaN(Number(v1)) && !Number.isNaN(Number(v2)) ? v1 - v2 : v1.toString().localeCompare(v2, navigator.language, {numeric: true, ignorePunctuation: true})
    )(getCellValue(direction ? a : b, index), getCellValue(direction ? b : a, index));

/**
 * Get an Array of column headers elements belonging directly to the given
 * table element.
 * @param {HTMLTableElement} table
 * @return {array<HTMLTableHeaderCellElement>}
 */
const getColumnHeaders = (table) => {
  const headers = select(SORTABLE_HEADER, table);
  return headers.filter((header) => header.closest(TABLE) === table);
};

/**
 * Update the button label within the given header element, resetting it
 * to the default state (ready to sort ascending) if it's no longer sorted
 * @param {HTMLTableHeaderCellElement} header
 */
const updateSortLabel = (header) => {
  const headerName = header.innerText;
  const sortedAscending = header.getAttribute(SORTED) === ASCENDING;
  const isSorted = header.getAttribute(SORTED) === ASCENDING || header.getAttribute(SORTED) === DESCENDING || false;
  const headerLabel = `${headerName}', sortable column, currently ${isSorted ? `${sortedAscending ? `sorted ${ASCENDING}` : `sorted ${DESCENDING}`}`: 'unsorted'}`;
  const headerButtonLabel = `Click to sort by ${headerName} in ${sortedAscending ? DESCENDING : ASCENDING} order.`;
  header.setAttribute("aria-label", headerLabel);
  header.querySelector(SORT_BUTTON).setAttribute("title", headerButtonLabel);
}

/**
 * Remove the aria-sort attribute on the given header element, and reset the label and button icon
 * @param {HTMLTableHeaderCellElement} header
 */
const unsetSort = (header) => {
  header.removeAttribute(SORTED);
  updateSortLabel(header);
}

/**
 * Sort rows either ascending or descending, based on a given header's aria-sort attribute
 * @param {HTMLTableHeaderCellElement} header
 * @param {boolean} ascending
 * @return {boolean} true
 */
const sortRows = (header, ascending) => {
  header.setAttribute(SORTED, ascending === true ? DESCENDING : ASCENDING );
  updateSortLabel(header);

  const tbody = header.closest(TABLE).querySelector('tbody');

  // We can use Array.from() and Array.sort() instead once we drop IE11 support, likely in the summer of 2021
  //
  // Array.from(tbody.querySelectorAll('tr').sort(
  //   compareFunction(
  //     Array.from(header.parentNode.children).indexOf(header),
  //     !ascending)
  //   )
  // .forEach(tr => tbody.appendChild(tr) );

  // [].slice.call() turns array-like sets into true arrays so that we can sort them
  const allRows = [].slice.call(tbody.querySelectorAll('tr'));
  const allHeaders = [].slice.call(header.parentNode.children);
  const thisHeaderIndex = allHeaders.indexOf(header);
  allRows.sort(
    compareFunction(
      thisHeaderIndex,
      !ascending
    )
  ).forEach(tr => {
    [].slice.call(tr.children).forEach(td => td.removeAttribute("data-sort-active"));
    tr.children[thisHeaderIndex].setAttribute("data-sort-active", true);
    tbody.appendChild(tr)
  });

  return true;
}

/**
 * Update the live region immediately following the table whenever sort changes.
 * @param {HTMLTableElement} table
 * @param {HTMLTableHeaderCellElement} sortedHeader
 */

const updateLiveRegion = (table, sortedHeader) => {
  const caption = table.querySelector('caption').innerText;
  const sortedAscending = sortedHeader.getAttribute(SORTED) === ASCENDING;
  const headerLabel = sortedHeader.innerText;
  const liveRegion = table.nextElementSibling;
  if (liveRegion && liveRegion.matches(ANNOUNCEMENT_REGION)) {
    const sortAnnouncement = `The table named "${caption}" is now sorted by ${headerLabel} in ${sortedAscending ? ASCENDING : DESCENDING } order.`;
    liveRegion.innerText = sortAnnouncement;
  } else {
    throw new Error(`Table containing a sortable column header is not followed by an aria-live region.`)
  }
}

/**
 * Toggle a header's sort state, optionally providing a target
 * state.
 *
 * @param {HTMLTableHeaderCellElement} header
 * @param {boolean?} ascending If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 */
const toggleSort = (header, ascending) => {
  const table = header.closest(TABLE);
  let safeAscending = ascending;
  if (typeof safeAscending !== "boolean") {
    safeAscending = header.getAttribute(SORTED) === ASCENDING;
  }

  if (!table) {
    throw new Error(`${SORTABLE_HEADER} is missing outer ${TABLE}`);
  }

  safeAscending = sortRows(header, ascending);

  if (safeAscending) {
    getColumnHeaders(table).forEach((otherHeader) => {
      if (otherHeader !== header) {
        unsetSort(otherHeader);
      }
    });
    updateLiveRegion(table, header);
  }
};

/**
 ** Inserts a button with icon inside a sortable header
 * @param {HTMLTableHeaderCellElement} header
 */

const createHeaderButton = (header) => {
  const buttonEl = document.createElement("button");
  buttonEl.setAttribute('tabindex', '0');
  buttonEl.classList.add(SORT_BUTTON_CLASS);
  buttonEl.innerHTML = `${ICON_SOURCE}`;
  header.appendChild(buttonEl);
  updateSortLabel(header);
}

const table = behavior(
  {
    [CLICK]: {
      [SORT_BUTTON](event) {
        event.preventDefault();
        toggleSort(
          event.target.closest(SORTABLE_HEADER),
          event.target.closest(SORTABLE_HEADER).getAttribute(SORTED) === ASCENDING
        );
      },
    },
  },
  {
    init(root) {
      const sortableHeaders = select(SORTABLE_HEADER, root);
      sortableHeaders.forEach((header) => createHeaderButton(header));

      const firstSorted = sortableHeaders.filter((header) => header.getAttribute(SORTED) === ASCENDING || header.getAttribute(SORTED) === DESCENDING)[0];
      if (typeof firstSorted === "undefined") {
        // no sortable headers found
        return;
      }
      const sortDir = firstSorted.getAttribute(SORTED);
      if (sortDir === ASCENDING) {
        toggleSort(firstSorted, true);

      }
      else if (sortDir === DESCENDING) {
        toggleSort(firstSorted, false);
      }
    },
    TABLE,
    SORTABLE_HEADER,
    SORT_BUTTON
  }
);

module.exports = table;
const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const DROPZONE_CLASS = `${PREFIX}-file-input`;
const DROPZONE = `.${DROPZONE_CLASS}`;
const INPUT_CLASS = `${PREFIX}-file-input__input`;
const TARGET_CLASS = `${PREFIX}-file-input__target`;
const INPUT = `.${INPUT_CLASS}`;
const BOX_CLASS = `${PREFIX}-file-input__box`;
const INSTRUCTIONS_CLASS = `${PREFIX}-file-input__instructions`;
const PREVIEW_CLASS = `${PREFIX}-file-input__preview`;
const PREVIEW_HEADING_CLASS = `${PREFIX}-file-input__preview-heading`;
const DISABLED_CLASS = `${PREFIX}-file-input--disabled`;
const CHOOSE_CLASS = `${PREFIX}-file-input__choose`;
const ACCEPTED_FILE_MESSAGE_CLASS = `${PREFIX}-file-input__accepted-files-message`;
const DRAG_TEXT_CLASS = `${PREFIX}-file-input__drag-text`;
const DRAG_CLASS = `${PREFIX}-file-input--drag`;
const LOADING_CLASS = "is-loading";
const HIDDEN_CLASS = "display-none";
const INVALID_FILE_CLASS = "has-invalid-file";
const GENERIC_PREVIEW_CLASS_NAME = `${PREFIX}-file-input__preview-image`;
const GENERIC_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--generic`;
const PDF_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--pdf`;
const WORD_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--word`;
const VIDEO_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--video`;
const EXCEL_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--excel`;
const SPACER_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * The properties and elements within the file input.
 * @typedef {Object} FileInputContext
 * @property {HTMLDivElement} dropZoneEl
 * @property {HTMLInputElement} inputEl
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * file input component.
 *
 * @param {HTMLElement} el the element within the file input
 * @returns {FileInputContext} elements
 */
const getFileInputContext = (el) => {
  const dropZoneEl = el.closest(DROPZONE);

  if (!dropZoneEl) {
    throw new Error(`Element is missing outer ${DROPZONE}`);
  }

  const inputEl = dropZoneEl.querySelector(INPUT);

  return {
    dropZoneEl,
    inputEl,
  };
};

/**
 * Disable the file input component
 *
 * @param {HTMLElement} el An element within the file input component
 */
const disable = (el) => {
  const { dropZoneEl, inputEl } = getFileInputContext(el);

  inputEl.disabled = true;
  dropZoneEl.classList.add(DISABLED_CLASS);
  dropZoneEl.setAttribute("aria-disabled", "true");
};

/**
 * Enable the file input component
 *
 * @param {HTMLElement} el An element within the file input component
 */
const enable = (el) => {
  const { dropZoneEl, inputEl } = getFileInputContext(el);

  inputEl.disabled = false;
  dropZoneEl.classList.remove(DISABLED_CLASS);
  dropZoneEl.removeAttribute("aria-disabled");
};

/**
 * Creates an ID name for each file that strips all invalid characters.
 * @param {string} name - name of the file added to file input
 * @returns {string} same characters as the name with invalid chars removed
 */
const makeSafeForID = (name) => {
  return name.replace(/[^a-z0-9]/g, function replaceName(s) {
    const c = s.charCodeAt(0);
    if (c === 32) return "-";
    if (c >= 65 && c <= 90) return `img_${s.toLowerCase()}`;
    return `__${("000", c.toString(16)).slice(-4)}`;
  });
};

/**
 * Builds full file input comonent
 * @param {HTMLElement} fileInputEl - original file input on page
 * @returns {HTMLElement|HTMLElement} - Instructions, target area div
 */
const buildFileInput = (fileInputEl) => {
  const acceptsMultiple = fileInputEl.hasAttribute("multiple");
  const fileInputParent = document.createElement("div");
  const dropTarget = document.createElement("div");
  const box = document.createElement("div");
  const instructions = document.createElement("div");
  const disabled = fileInputEl.hasAttribute("disabled");

  // Adds class names and other attributes
  fileInputEl.classList.remove(DROPZONE_CLASS);
  fileInputEl.classList.add(INPUT_CLASS);
  fileInputParent.classList.add(DROPZONE_CLASS);
  box.classList.add(BOX_CLASS);
  instructions.classList.add(INSTRUCTIONS_CLASS);
  instructions.setAttribute("aria-hidden", "true");
  dropTarget.classList.add(TARGET_CLASS);

  // Adds child elements to the DOM
  fileInputEl.parentNode.insertBefore(dropTarget, fileInputEl);
  fileInputEl.parentNode.insertBefore(fileInputParent, dropTarget);
  dropTarget.appendChild(fileInputEl);
  fileInputParent.appendChild(dropTarget);
  fileInputEl.parentNode.insertBefore(instructions, fileInputEl);
  fileInputEl.parentNode.insertBefore(box, fileInputEl);

  // Disabled styling
  if (disabled) {
    disable(fileInputEl);
  }

  // Sets instruction test based on whether or not multiple files are accepted
  if (acceptsMultiple) {
    instructions.innerHTML = `<span class="${DRAG_TEXT_CLASS}">Drag files here or </span><span class="${CHOOSE_CLASS}">choose from folder</span>`;
  } else {
    instructions.innerHTML = `<span class="${DRAG_TEXT_CLASS}">Drag file here or </span><span class="${CHOOSE_CLASS}">choose from folder</span>`;
  }

  // IE11 and Edge do not support drop files on file inputs, so we've removed text that indicates that
  if (
    /rv:11.0/i.test(navigator.userAgent) ||
    /Edge\/\d./i.test(navigator.userAgent)
  ) {
    fileInputParent.querySelector(`.${DRAG_TEXT_CLASS}`).outerHTML = "";
  }

  return { instructions, dropTarget };
};

/**
 * Removes image previews, we want to start with a clean list every time files are added to the file input
 * @param {HTMLElement} dropTarget - target area div that encases the input
 * @param {HTMLElement} instructions - text to inform users to drag or select files
 */
const removeOldPreviews = (dropTarget, instructions) => {
  const filePreviews = dropTarget.querySelectorAll(`.${PREVIEW_CLASS}`);
  const currentPreviewHeading = dropTarget.querySelector(
    `.${PREVIEW_HEADING_CLASS}`
  );
  const currentErrorMessage = dropTarget.querySelector(
    `.${ACCEPTED_FILE_MESSAGE_CLASS}`
  );

  // Remove the heading above the previews
  if (currentPreviewHeading) {
    currentPreviewHeading.outerHTML = "";
  }

  // Remove existing error messages
  if (currentErrorMessage) {
    currentErrorMessage.outerHTML = "";
    dropTarget.classList.remove(INVALID_FILE_CLASS);
  }

  // Get rid of existing previews if they exist, show instructions
  if (filePreviews !== null) {
    if (instructions) {
      instructions.classList.remove(HIDDEN_CLASS);
    }
    Array.prototype.forEach.call(filePreviews, function removeImages(node) {
      node.parentNode.removeChild(node);
    });
  }
};

/**
 * When using an Accept attribute, invalid files will be hidden from
 * file browser, but they can still be dragged to the input. This
 * function prevents them from being dragged and removes error states
 * when correct files are added.
 * @param {event} e
 * @param {HTMLElement} fileInputEl - file input element
 * @param {HTMLElement} instructions - text to inform users to drag or select files
 * @param {HTMLElement} dropTarget - target area div that encases the input
 */
const preventInvalidFiles = (e, fileInputEl, instructions, dropTarget) => {
  const acceptedFilesAttr = fileInputEl.getAttribute("accept");
  dropTarget.classList.remove(INVALID_FILE_CLASS);

  // Runs if only specific files are accepted
  if (acceptedFilesAttr) {
    const acceptedFiles = acceptedFilesAttr.split(",");
    const errorMessage = document.createElement("div");

    // If multiple files are dragged, this iterates through them and look for any files that are not accepted.
    let allFilesAllowed = true;
    for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
      const file = e.dataTransfer.files[i];
      if (allFilesAllowed) {
        for (let j = 0; j < acceptedFiles.length; j += 1) {
          const fileType = acceptedFiles[j];
          allFilesAllowed =
            file.name.indexOf(fileType) > 0 ||
            file.type.includes(fileType.replace(/\*/g, ""));
          if (allFilesAllowed) break;
        }
      } else break;
    }

    // If dragged files are not accepted, this removes them from the value of the input and creates and error state
    if (!allFilesAllowed) {
      removeOldPreviews(dropTarget, instructions);
      fileInputEl.value = ""; // eslint-disable-line no-param-reassign
      dropTarget.insertBefore(errorMessage, fileInputEl);
      errorMessage.innerHTML =
        fileInputEl.dataset.errormessage || `This is not a valid file type.`
      errorMessage.classList.add(ACCEPTED_FILE_MESSAGE_CLASS);
      dropTarget.classList.add(INVALID_FILE_CLASS);
      e.preventDefault();
      e.stopPropagation();
    }
  }
};

/**
 * When new files are applied to file input, this function generates previews
 * and removes old ones.
 * @param {event} e
 * @param {HTMLElement} fileInputEl - file input element
 * @param {HTMLElement} instructions - text to inform users to drag or select files
 * @param {HTMLElement} dropTarget - target area div that encases the input
 */
const handleChange = (e, fileInputEl, instructions, dropTarget) => {
  const fileNames = e.target.files;
  const filePreviewsHeading = document.createElement("div");

  // First, get rid of existing previews
  removeOldPreviews(dropTarget, instructions);

  // Iterates through files list and creates previews
  for (let i = 0; i < fileNames.length; i += 1) {
    const reader = new FileReader();
    const fileName = fileNames[i].name;

    // Starts with a loading image while preview is created
    reader.onloadstart = function createLoadingImage() {
      const imageId = makeSafeForID(fileName);
      const previewImage = `<img id="${imageId}" src="${SPACER_GIF}" alt="" class="${GENERIC_PREVIEW_CLASS_NAME} ${LOADING_CLASS}"/>`;

      instructions.insertAdjacentHTML(
        "afterend",
        `<div class="${PREVIEW_CLASS}" aria-hidden="true">${previewImage}${fileName}<div>`
      );
    };

    // Not all files will be able to generate previews. In case this happens, we provide several types "generic previews" based on the file extension.
    reader.onloadend = function createFilePreview() {
      const imageId = makeSafeForID(fileName);
      const previewImage = document.getElementById(imageId);
      if (fileName.indexOf(".pdf") > 0) {
        previewImage.setAttribute(
          "onerror",
          `this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${PDF_PREVIEW_CLASS}")`
        );
      } else if (
        fileName.indexOf(".doc") > 0 ||
        fileName.indexOf(".pages") > 0
      ) {
        previewImage.setAttribute(
          "onerror",
          `this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${WORD_PREVIEW_CLASS}")`
        );
      } else if (
        fileName.indexOf(".xls") > 0 ||
        fileName.indexOf(".numbers") > 0
      ) {
        previewImage.setAttribute(
          "onerror",
          `this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${EXCEL_PREVIEW_CLASS}")`
        );
      } else if (fileName.indexOf(".mov") > 0 || fileName.indexOf(".mp4") > 0) {
        previewImage.setAttribute(
          "onerror",
          `this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${VIDEO_PREVIEW_CLASS}")`
        );
      } else {
        previewImage.setAttribute(
          "onerror",
          `this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${GENERIC_PREVIEW_CLASS}")`
        );
      }

      // Removes loader and displays preview
      previewImage.classList.remove(LOADING_CLASS);
      previewImage.src = reader.result;
    };

    if (fileNames[i]) {
      reader.readAsDataURL(fileNames[i]);
    }

    // Adds heading above file previews, pluralizes if there are multiple
    if (i === 0) {
      dropTarget.insertBefore(filePreviewsHeading, instructions);
      filePreviewsHeading.innerHTML = `Selected file <span class="usa-file-input__choose">Change file</span>`;
    } else if (i >= 1) {
      dropTarget.insertBefore(filePreviewsHeading, instructions);
      filePreviewsHeading.innerHTML = `${
        i + 1
      } files selected <span class="usa-file-input__choose">Change files</span>`;
    }

    // Hides null state content and sets preview heading class
    if (filePreviewsHeading) {
      instructions.classList.add(HIDDEN_CLASS);
      filePreviewsHeading.classList.add(PREVIEW_HEADING_CLASS);
    }
  }
};

const fileInput = behavior(
  {},
  {
    init(root) {
      select(DROPZONE, root).forEach((fileInputEl) => {
        const { instructions, dropTarget } = buildFileInput(fileInputEl);

        dropTarget.addEventListener(
          "dragover",
          function handleDragOver() {
            this.classList.add(DRAG_CLASS);
          },
          false
        );

        dropTarget.addEventListener(
          "dragleave",
          function handleDragLeave() {
            this.classList.remove(DRAG_CLASS);
          },
          false
        );

        dropTarget.addEventListener(
          "drop",
          function handleDrop(e) {
            preventInvalidFiles(e, fileInputEl, instructions, dropTarget);
            this.classList.remove(DRAG_CLASS);
          },
          false
        );

        // eslint-disable-next-line no-param-reassign
        fileInputEl.onchange = (e) => {
          handleChange(e, fileInputEl, instructions, dropTarget);
        };
      });
    },
    getFileInputContext,
    disable,
    enable,
  }
);

module.exports = fileInput;

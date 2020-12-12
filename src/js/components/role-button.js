const behavior = require('../utils/behavior');
const keymap = require("receptor/keymap");
const ROLE_BUTTON = `a[role="button"]`;

const toggleRoleBtn = function toggleRoleBtn(event) {
  event.preventDefault();
  event.target.click();
};

const roleButton = behavior(
  {
    keydown: {
      [ROLE_BUTTON]: keymap({
        " ": toggleRoleBtn
      })
    }
  }
);

module.exports = roleButton;

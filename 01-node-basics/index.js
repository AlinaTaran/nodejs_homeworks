import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from "./contacts.js";

import program from "./lib/commander.js";

program.parse(process.argv);

const options = program.opts();

function invokeAction(options) {
  if (options.list) {
    listContacts();
  } else if (options.get) {
    const id = Number(options.get);
    getContactById(id);
  } else if (options.remove) {
    const id = Number(options.remove);
    removeContact(id);
  } else if (options.add) {
    const { name, email, phone } = options;
    addContact(name, email, phone);
  } else {
    console.log("Error!");
  }
}

invokeAction(options);

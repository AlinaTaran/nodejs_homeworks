import * as fs from "fs/promises";
import * as path from "path";

import dirName from "./lib/dirname.js";
import { handleError } from "./lib/handleerror.js";
const { __dirname } = dirName(import.meta.url);

const contactsPath = path.join(__dirname, "./db/contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    console.table(JSON.parse(data.toString()));
  } catch (error) {
    handleError(error);
  }
}

export async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contactsArray = JSON.parse(data.toString());

    const contact = contactsArray.find((contact) => contact.id === contactId);
    if (!contact) console.error("not found!");
    console.table(contact);
  } catch (error) {
    handleError(error);
  }
}

export async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contactsArray = JSON.parse(data.toString());

    const filteredContacts = contactsArray.filter(
      (contact) => contact.id !== contactId
    );

    if (filteredContacts.length !== contactsArray.length) {
      fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
      console.log("Contact deleted.");
    } else {
      console.log("not found!");
      return;
    }
  } catch (error) {
    handleError(error);
  }
}

export async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath);
    const contactsArray = JSON.parse(data.toString());

    contactsArray.push({ id: contactsArray.length + 1, name, email, phone });
    fs.writeFile(contactsPath, JSON.stringify(contactsArray));
    console.log("Contact added.");
  } catch (error) {
    handleError(error);
  }
}

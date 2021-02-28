const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "/contacts.json");
console.log(contactsPath);

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return contacts.find(({ id }) => id.toString() === contactId);
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const deletedContact = getContactById(contactId);
    if (!deletedContact) return;

    const contacts = await listContacts();
    const filteredContacts = contacts.filter((contact) => {
      return contact.id !== contactId;
    });

    const stringifiedContacts = JSON.stringify(filteredContacts, null, 2);
    await fs.writeFile(contactsPath, stringifiedContacts, "utf8");
    return deletedContact;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const newContact = { id: uuidv4(), ...body };
    const newArray = [...contacts, newContact];

    const stringifiedContacts = JSON.stringify(newArray, null, 2);

    await fs.writeFile(contactsPath, stringifiedContacts, "utf8");
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(({ id }) => id.toString() === contactId);
    if (index === -1) return;
    contacts[index] = { ...contacts[index], ...body };

    const stringifiedArray = JSON.stringify(contacts, null, 2);

    await fs.writeFile(contactsPath, stringifiedArray, "utf8");
    return contacts[index];
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

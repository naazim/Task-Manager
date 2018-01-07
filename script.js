'use strict';

class TaskManagerApp {

  constructor() {
    //Dom Elements
    this.taskContainer = document.getElementById('task-container');
    this.taskInput = document.getElementById('task-input');
    this.taskAdder = document.getElementById('add-btn');

    this.taskAdder.addEventListener('click', () => this.addTask());

    // Loads all the notes.
    for (let key in localStorage) {
      this.displayNote(key, localStorage[key]);
    }

    // Listen for updates to notes from other windows.
    window.addEventListener('storage', function (e) {
      this.displayNote(e.key, e.newValue);
    }.bind(this));
  }

  // Saves a new sticky note on localStorage.
  addTask() {
    if (this.taskInput.value) {
      let key = Date.now().toString();
      localStorage.setItem(key, this.taskInput.value);
      this.displayNote(key, this.taskInput.value);
      TaskManagerApp.resetMaterialTextfield(this.taskInput);
    }
  };

  // Resets the given MaterialTextField.
  static resetMaterialTextfield(element) {
    element.value = '';
  };

  // Creates/updates/deletes a note in the UI.
  displayNote(key, message) {
    let note = document.getElementById(key);
    // If no element with the given key exists we create a new note.
    if (!note) {
      note = document.createElement('task-note');
      note.id = key;
      note.className = 'task';
      this.taskContainer.appendChild(note);
    }
    // If the message is null we delete the note.
    if (!message) {
      return note.deleteNote();
    }
    note.setMessage(message);
  };

}
// A Sticky Note custom element that extends HTMLElement.
class StickyNote extends HTMLElement {
  // Fires when an instance of the element is created.
  createdCallback() {
    this.innerHTML = StickyNote.TEMPLATE;
    this.messageElement = this.querySelector('.task-text');
    this.deleteButton = this.querySelector('.delete-btn');
    this.deleteButton.addEventListener('click', () => this.deleteNote());
  };

  // Fires when an attribute of the element is added/deleted/modified.
  attributeChangedCallback(attributeName) {
    // We display/update the created date message if the id changes.
    if (attributeName == 'id') {
      let date;
      if (this.id) {
        date = new Date(parseInt(this.id));
      } else {
        date = new Date();
      }
      
      let shortDate = Intl.DateTimeFormat('en-us',{day: 'numeric', month: 'short'}).format(date);
    }
  };
  
    // Sets the message of the note.
    setMessage(message) {
      this.messageElement.textContent = message;
      // Replace all line breaks by <br>.
      this.messageElement.innerHTML = this.messageElement.innerHTML.replace(/\n/g, '<br>');
    };

  // Deletes the note by removing the element from the DOM and the data from localStorage.
  deleteNote() {
    localStorage.removeItem(this.id);
    this.parentNode.removeChild(this);
  };
};

// Initial content of the element.
StickyNote.TEMPLATE = `
  <div class="task-text"></div>
  <a class="delete-btn">×</a>`;

document.registerElement('task-note',  StickyNote);

// On load start the app.
window.addEventListener('load', function () {
  new TaskManagerApp();
});

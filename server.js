const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { notes } = require("./Develop/db/db.json");
const PORT = process.env.PORT || 3001;

// unique ids
const ShortUniqueId = require('short-unique-id'); 
const uid = new ShortUniqueId({ length: 5 });
uid.setDictionary("number");

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create a new note to add to the notes array in db.json
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./Develop/db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
};

// makes sure that a string has to be put in for title and text of notes
function validateNote(note) {
  if(!note.title || typeof note.title !== "string") {
    return false;
  }
  if(!note.text || typeof note.text !=="string") {
    return false;
  }
  return true;
}

// reads the db file
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// post new notes to db.json
app.post("/api/notes", (req, res) => {
  // unique ids created for each new note
  req.body.id = uid();

  // if any data in req.body is incorrect, sends 400 error
  if(!validateNote(req.body)) {
    res.status(400).send("The note is not formatted correctly.")
  } else {
    // add note to db.json and note array
  const note = createNewNote(req.body, notes);
  res.json(note);
  }
});

app.listen(PORT, () => {
  console.log(`API server is now on port ${PORT}`);
});
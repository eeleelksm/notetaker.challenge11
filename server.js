const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { notes } = require("./Develop/db/db.json");
const PORT = process.env.PORT || 3001;

// unique ids
const ShortUniqueId = require('short-unique-id'); 
const { response } = require("express");
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

// BONUS
function deleteNotes(id, notesArray) {
  for (i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];

    if (note.id = id) {
      notesArray.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./Develop/db/db.json"),
        JSON.stringify({ notes: notesArray }, null, 2)
      );
      break;
    }
  }
};

// api/notes route
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// /notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// index.html route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
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

// BONUS
app.delete("/api/notes/:id", (req, res) => {
  deleteNotes(req.params.id, notes);
  res.json(true);
});

app.listen(PORT, () => {
  console.log(`API server is now on port ${PORT}`);
});
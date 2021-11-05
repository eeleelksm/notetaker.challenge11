const express = require("express");
const app = express();
const { notes } = require("./Develop/db/db.json");

// unique ids
const ShortUniqueId = require('short-unique-id'); 
const uid = new ShortUniqueId();
uid.setDictionary("number");

const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.get("/notes", (req, res) => {
//   res.sendFile(path.join(__dirname, "notes.html"))
// });

// reads the db file
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// post new notes to the db file
app.post("/api/notes", (req, res) => {
  req.body.id = (uid.seq());
  res.json(req.body);
});

app.listen(PORT, () => {
  console.log(`API server is now on port ${PORT}`);
});
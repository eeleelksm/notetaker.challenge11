const express = require("express");
const app = express();
const { notes } = require("./Develop/db/db.json");

const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

// app.get("/notes", (req, res) => {
//   res.sendFile(path.join(__dirname, "notes.html"))
// });

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`API server is now on port ${PORT}`);
});
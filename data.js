import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors'

const app = express();
const port = 4000;


mongoose.connect("mongodb://localhost/notesdb");

const noteSchema = new mongoose.Schema({
    title: String, 
    content: String,
    id: String
})

const Note = mongoose.model("Note", noteSchema);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


var identification = uuidv4();
    // const note = new Note({title: "title", content : "content", id:identification});
    // await note.save();


app.post("/deleteNote", async(req,res) => {
    console.log(req.body);
    let idToDelete = req.body.idToRemove;
    
    
    try {
        await Note.deleteOne({id:idToDelete});
        let notes = await Note.find({}, 'title content id');
        let notesToSend = notes.map(notte=>{
            return(
                {
                    title: notte.title, content:notte.content, id: notte.id 
                }
            )
        })
        
        
        res.send(notesToSend);
        
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Error fetching notes" });
    }
})


app.post("/newNote", async(req, res) => {
    console.log(req.body);
    var note = new Note({title: req.body.title, content: req.body.content, id:uuidv4()})
    await note.save();
    try {
        let notes = await Note.find({}, 'title content id');
        let notesToSend = notes.map(notte=>{
            return(
                {
                    title: notte.title, content:notte.content, id: notte.id 
                }
            )
        })
        
        console.log(notesToSend, "sent!!!")
        res.send(notesToSend);
        
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Error fetching notes" });
    }
})

app.get("/notes", async (req, res) => {
    try {
        let notes = await Note.find({}, 'title content id');
        let notesToSend = notes.map(notte=>{
            return(
                {
                    title: notte.title, content:notte.content, id: notte.id 
                }
            )
        })
        
        console.log(notesToSend, "sent!!!")
      
        // res.json(notesToSend);
        res.send(notesToSend);
        
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Error fetching notes" });
    }
});


app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });
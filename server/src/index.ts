import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db';
import Document from './models/Document';


dotenv.config();

 connectDb(); //this will start Db

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());



app.get('/',(req:Request,res:Response) => {
  res.status(200).json({message: "DocFlow Is now in Production"})
}
);


app.post('/documents',async (req:Request,res:Response) => {
  try {
    const {title, isFolder, parentId} = req.body
    const newDoc = await Document.create({
      title: title || "Untitled", // Use the bofy title or default to "Untitles"
      isFolder : !!isFolder, // Ensures that it is a real boolean
      parentId : parentId || null ,// if no parent id then it is the root file
      isArchived : false // harcoded for now until we create the login page 
    })
    res.status(201).json(newDoc)
  } catch (error) {
    res.status(500).json({message: "Server Error: Could not Create a Document"})
    
  }
  
}
)

app.listen(PORT,() => {
  console.log(`App is Sprinting on PORT ${PORT} `)
}
)

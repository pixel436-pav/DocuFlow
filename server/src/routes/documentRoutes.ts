import express, { Request, Response } from 'express';
import Document from '../models/Document';


const router = express.Router()


router.get('/',(req:Request,res:Response) => {
  res.status(200).json({message: "DocFlow Is now in Production"})
}
);


router.post('/documents', async (req: Request, res: Response) => {
  try {
    const { title, isFolder, parentId } = req.body;
    
    const newDoc = await Document.create({
      title: title || "Untitled",
      isFolder: !!isFolder, // Ensures it's a real boolean
      parentId: parentId || null,
      isArchived: false
    });
    
    res.status(201).json(newDoc);
  } catch (error) {
    console.error("Error Creating a document", error);
    res.status(500).json({ message: "Server Error: Could not Create a Document" });
  }
});

router.get('/documents',async (req:Request,res:Response) => {
try {
  // We find documents where parentId is null (meaning the are the top)
  const docs = await Document.find();
  res.json(docs)
} catch (error) {
  console.error(error)
  res.status(500).json({message:"Error fetching documents"})
}
  
}
);

router.get('/documents/:id', async (req:Request,res:Response) => {
  try{
  const id = req.params.id
  const getDocuById = await Document.findById(id) // will get the document by id 
  
  if (!getDocuById) {
   return res.status(404).json({message:"Document Not Found"}) // adding return here is very important as if req by client didn't find any document return will send status + json and stop the block here from running further
  }
  
    res.json(getDocuById)
  }
  catch (error){
    console.error(error)
    res.status(500).json({message:"Server Error"})
  }
  
  
});

router.put('/documents/:id', async (req: Request, res: Response) => {
  try {

    const { title, content } = req.body
    const updateDocu = await Document.findByIdAndUpdate(req.params.id,
      {
        title,content
      },
      { returnDocument: 'after' }) // this will return the updated version
  res.json(updateDocu)
  }
  catch (error) {
    console.error(error)
    res.status(500).send(error)
    
  }
  
  
  
})


router.delete('/documents/:id', async (req: Request, res: Response) => {
  try {
    // we find document by id 
    const id = req.params.id
   
    // this will delete item itself folder or document
    const deleteDocu = await Document.findByIdAndDelete(id)
    
    // now as we delete a folder the children of the folder means the files isnside the folder becomes orphan taking up dead space - to tackle which we need cascading delete
    // 
    if (!deleteDocu) {
      return res.status(404).json({message:"Document not found"})
    }
    
    await Document.deleteMany({ parentId: id })
    res.json({
      message : "Item and Children Deleted Successfully"
    })
    if (!deleteDocu) {
      res.status(404).json({message:"Document not Found"})
    }
    res.json({ message: "Document Delete Successfully" })
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ messsage: "Server Error" })
    
  }
});




export default router;
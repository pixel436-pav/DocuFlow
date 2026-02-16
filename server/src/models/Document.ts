import mongoose, {Schema , Document} from "mongoose";
import { title } from "node:process";


// this is the type script interface that ('Rules for Our Code')
export interface IDoc extends Document{
    title: string;
    isFolder:boolean;
    content?: string;
    parentId: mongoose.Types.ObjectId | null ;
    userId: string;
    isArchived : boolean,
}

// mongoose schema ( The Rules for MongoDb)
const DocumentSchema = new Schema({
    title: {
    type: String,
    required: true,
    default: "Untitles" // If user Doesn't enter anything this will be automatically saved like this }
},
userId:{
    type: Schema.Types.ObjectId, // It points to another Document's ID
    ref : "Document", //this created the tree structure
    default:null
},
isArchived:{
    type: Boolean,
    default: false
}

},{
    timestamps:true // Automatically Adds Created at Updated at
}

);

export default mongoose.model<IDoc>('Document',DocumentSchema)
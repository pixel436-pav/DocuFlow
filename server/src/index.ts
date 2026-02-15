import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/',(req:Request,res:Response) => {
  res.status(200).json({message: "DocFlow Is now in Production"})
}
);

app.listen(PORT,() => {
  console.log(`App is Sprinting on PORT ${PORT} `)
}
)

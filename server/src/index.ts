import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db';
import documentRoutes from './routes/documentRoutes'




dotenv.config();

 connectDb(); //this will start Db

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api',documentRoutes)



app.listen(PORT,() => {
  console.log(`App is Sprinting on PORT ${PORT} `)
}
);

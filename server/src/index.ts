import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db';
import documentRoutes from './routes/documentRoutes'
import authRouters from './routes/auth'




dotenv.config();

 connectDb(); //this will start Db

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true
}));
app.use(express.json());

app.use('/api/auth',authRouters)
app.use('/api',documentRoutes)



app.listen(PORT,() => {
  console.log(`App is Sprinting on PORT ${PORT} `)
}
);

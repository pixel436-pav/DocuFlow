import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
       
    });
    res.status(201).json({ message: "User Created Successfully" })
    
  } catch (error) {
    res.status(500).json({ message: "Server Error During Registration" })
    
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User Don't exists" })
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    const secret = process.env.JWT_SECRET
    
    if (!secret) {
      console.error("Critical: jwt is missing from env")
      return res.status(500).json({message:"Server Config failed"})
    }
    
    const token = jwt.sign(
      { id: user._id },
      secret as string, 
      {expiresIn: '1d'} // token expires in 24 hours
    )
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
      
    });
    
  } catch (error) {
    console.error("Login crash", error)
    res.status(500).json({message:"Server error During login"})
  }
  
})

export default router;



import express from 'express'
import { config } from "dotenv";
import connectToDatabase from './config/databaseConnection';
import UserModel from './library/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
config()
const app = express();
connectToDatabase();
const Port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());

import busRoutes from './routes/bus-routes';
import busStopRoutes from './routes/bus-stops';
app.use('/api/v1', busRoutes);
app.use('/api/v1/bus-stop', busStopRoutes);

//register
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: 'First name, last name, email, and password are required.' });
  }
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    return res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
});

//login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password is Incorrect.' });
    }
    const payload = {
      userId: user._id, 
      email: user.email
    }
    const token = jwt.sign( payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true, 
    };
    // return res.json({ success: true, message: 'Login successful.', token });
    return res.cookie('token', token, options).status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      message: 'Logged in successfully.'
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`)
})
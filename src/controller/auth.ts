import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '@src/model/auth/userModel';
import { generateOTP } from '@src/library/otp';
import { sendmail } from '@src/library/mail'; 

// register
export const register = async (req: Request, res: Response) => {
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
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 *1000);
    const user = new UserModel({ firstName, lastName, email, password: hashedPassword, otp, otpExpires });
    await user.save();

    await sendmail(
      email,
      'Your OTP Code',
      `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    );

    return res.status(201).json({ success: true, message: 'User registered successfully. OTP sent' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password is Incorrect.' });
    }
    const payload = {
      userId: user._id, 
      email: user.email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true, 
    };
    user.password = undefined;
    return res.cookie('token', token, options).status(200).json({
      success: true,
      token,
      user,
      message: 'Logged in successfully.'
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } =req.body;
  if(!email || !otp){
    return res.status(400).json({success: false, message: 'Email and Otp are required.'})
  }
  try {
    const user = await UserModel.findOne({email});
    if(!user){
      return res.status(404).json({success: false, message: 'User not found.'});
    }
    if(!user.otp || !user.otpExpires){
      return res.status(400).json({succes: false, message: 'No OTP set for this user.'})
    }
    if(user.otp !== otp){
      return res.status(400).json({success: false, message: 'Invalid OTP.'});
    }
    if(user.otpExpires < new Date()){
      return res.status(400).json({success: false, message: 'OTP has expired.'});
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({success: true, message: 'OTP verified successfully.'});

  } catch(error){
    return res.status(500).json({success: false, message: 'Server error.', error})
  }
}
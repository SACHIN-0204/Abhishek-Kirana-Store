const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  // TODO : Implement JWT token generation logic here
  // Example: return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expires
  return  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // TODO : Hash the password before saving it to the databse
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // TODO : Implement JWT token generation and send it back to the client
    // TODO : Implement email verification and send a verification email to the user
    // TODO : Welcome email after successful registration
    const user = await User.create({ username, email, password: hashedPassword });
    if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

        const message = `
        Thank you ${user.username} for registering with our service!
        Your OTP for email verification is: ${otp}`;

        await sendEmail({
          to: email,
          subject: 'Welcome to Our Service - Email Verification OTP',
          text: message
        });

        res.status(201).json({
            _id : user._id,
            username : user.username,
            email : user.email,
            token : generateToken(user._id),
            role : user.role,
            message: 'User registered successfully. Please check your email for the OTP to verify your account.'
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body; 
  try {
    const user = await User.findOne({ email });
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id : user._id,
            username : user.username,
            email : user.email,
            token : generateToken(user._id),
            role : user.role
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getUser = async (req, res) => {
  try {
     const users = await User.find({}).select('-password'); // Exclude password field
     res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};  

module.exports = {
  registerUser,
  loginUser,
  getUser
};
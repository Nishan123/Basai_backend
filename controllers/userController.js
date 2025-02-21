const User = require('../model/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    try {
        // Enhanced validation
        const validationErrors = [];
        
        if (!firstName?.trim()) validationErrors.push('First name is required');
        if (!lastName?.trim()) validationErrors.push('Last name is required');
        if (!email?.trim()) validationErrors.push('Email is required');
        if (!password) validationErrors.push('Password is required');
        
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors 
            });
        }

        // Enhanced password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long and contain both letters and numbers' 
            });
        }

        if (password !== confirmPassword) {
            console.log('Password mismatch');
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Add email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Add password strength validation
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Email already exists:', email);
            return res.status(400).json({ error: 'Email already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        console.log('Attempting to create user with email:', email);
        
        const newUser = await User.create({ 
            firstName,
            lastName,
            email,
            password: hashedPassword 
        });

        console.log('User created successfully:', newUser.id);
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });
    } catch (error) {
        // Enhanced error logging
        console.error('Registration error:', {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        
        // More specific error messages
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }
        
        res.status(500).json({ 
            error: 'Registration failed. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Login an existing user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Enhanced validation
        if (!email?.trim() || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ where: { email: email.trim() } });
        
        // Generic error message for security
        const invalidCredentialsMessage = 'Invalid email or password';
        
        if (!user) {
            return res.status(401).json({ error: invalidCredentialsMessage });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: invalidCredentialsMessage });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            process.env.JWT_SECRET || 'JKHSDKJBKJSDJSDJKBKSD345345345345',
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', email);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { 
                id: user.id, 
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName 
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed. Please try again later.' 
        });
    }
};

const getUser = async(req, res)=>{

    try{
        const tests = await User.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createUser = async(req, res)=>{
    
    try{
        
const {username, password} = req.body;

//Hash the password
const newtest = await User.create({username, password})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the password if it is being updated
        if (req.body.password) {
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        await user.update(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { loginUser, registerUser, getUser, updateUser }
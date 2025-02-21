const User = require('../model/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    console.log('Received registration request:', { 
        firstName, 
        lastName, 
        email,
        passwordLength: password ? password.length : 0,
        confirmPasswordLength: confirmPassword ? confirmPassword.length : 0
    });
    
    // Validate input
    if (!firstName || !lastName || !email || !password) {
        console.log('Missing required fields:', { 
            hasFirstName: !!firstName, 
            hasLastName: !!lastName, 
            hasEmail: !!email, 
            hasPassword: !!password 
        });
        return res.status(400).json({ error: 'All fields are required' });
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

    try {
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
        console.error('Registration error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            errors: error.errors
        });
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'Validation error', 
                details: error.errors.map(e => e.message) 
            });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ 
            error: 'Failed to register user',
            details: error.message 
        });
    }
};


// Login an existing user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
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
        res.status(500).json({ error: 'Failed to login user' });
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
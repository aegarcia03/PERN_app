const express = require('express');
const { PrismaClient } = require ('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
// initialise the app 
const app = express();

//parse the requests to json 
app.use(express.json());

// avoid any cors problem
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.send('Hello Carry Bee!');
});

// test API
app.get('/test', (req, res) => {
    try {
        res.status(200).json({ message: 'Api is working' });
    } catch {
        res.status(500).json({ message: error.message });
    }
})

//get all users 
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

//get user by id
app.get('/users/:id', async (req, res)=> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//create user
app.post('/users', async (req, res) => {
    try {
        const { first_name, last_name, phone, email, password, address } = req.body;
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

        const Newuser = await prisma.user.create({
            data: {
                first_name,
                last_name,
                phone,
                email,
                password: hashedPassword,
                address,
            },
        });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

// login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// update user
app.put('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.update({
            where : { id: req.params.id },
            data : {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address
            }
        });
        res.status(200).json({ message: 'User updated sucessfully', user});
    } catch (error) {
        if (error.code === 'P2025') { // Prisma error for "Record not found"
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: error.message });
    }
});

// delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ message: 'User deleted successfully', user});
    } catch (error) {
        if (error.code === 'P2025') { // Prisma error for "Record not found"
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: error.message });
    }
});

//START the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
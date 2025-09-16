const mongoose = require('mongoose');
const Admin = require('../Model/adminModel');

// MongoDB connection string - update this with your actual connection string
const mongoURI = 'mongodb+srv://arunprasad0305_db_user:ArunPrasad@cluster0.xa2lqmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
    .then(async () => {
        try {
            const adminData = {
                name: 'Arun Prasad',
                mail: 'arunprasad0305@gmail.com',
                password: '1234'
            };

            const admin = new Admin(adminData);
            await admin.save();
            console.log('Admin created successfully!');
        } catch (error) {
            console.error('Error creating admin:', error.message);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('Database connection error:', err));
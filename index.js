import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGO_DB_URI;

await mongoose.connect(uri);
// Connect to MongoDB
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', UserSchema);

async function run() {
    try {
        /*const user = new User( {
            name: "Copa",
            email: "copa@gmail.com",
            password: "12345678"
        })
        const result = await user.save();

        console.log(`A document was inserted with the _id: ${result._id}`);
        */
    } finally {
        const collections = await User.find({name: 'Tridev'})
        console.log("collections: ", collections)
    }
}
run().catch(console.dir);
import express from 'express'
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt'
import User from '.././db/models/userModel.js'

const app = express()
const router = express.Router()

router.get('/signup', (req, res)=> {
    res.render('auth/signup')
})

router.get('/login', (req, res)=> {
    res.render('auth/login')
})

router.get('/forgot', (req, res)=> {
    res.send("We don't have this feature yet contact tridev for password")
})

router.post('/signup', async(req, res)=> {
    const jwtSecret = process.env.JWT_SECRET
    const {
        name,
        email,
        password
    } = req.body

    const userData = await User.find( {
        email: email
    })

    if (userData[0]) {
        return res.send(`User with email ${email} already exists`)
    }
    /*
    const saltRounds =10
    let hashedPassword
    bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log('Hashed password:', hash);
            hashedPassword=hash
        }
    });
    */
    const user = new User( {
        name: name,
        email: email,
        password: password //hashedPassword
    })
    const result = await user.save()

    const jwtToken = jwt.sign({
        name: name,
        email: email,
    }, jwtSecret, {
        expiresIn: '10d'
    })

    res.cookie('jwtToken', jwtToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 10
    })

    //res.send(`A document was inserted with the _id: ${result._id}`)
    res.redirect('/')
})

router.post('/login', async(req, res)=> {
    const jwtSecret = process.env.JWT_SECRET
    const {
        email,
        password
    } = req.body

    const userData = await User.find( {
        email: email
    })

    if (!userData[0]) {
        return res.send(`User with email ${email} does not exists`)
    }

    if (userData[0].password != password) {
        return res.send(`Incorrect password try ${userData[0].password}`)
    }
    const jwtToken = jwt.sign({
        name: userData[0].name,
        email: email,
    }, jwtSecret, {
        expiresIn: '10d'
    })

    res.cookie('jwtToken', jwtToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 10
    })
    res.redirect('/')

    /*bcrypt.compare(password, userData[0].password, (err, result) => {
        if (err) {
            console.log(err.message)
        } else if (result) {
            // Passwords match - authenticate user
            console.log('Password matched!');
            res.redirect('/')
        } else {
            // Passwords do not match - authentication failed
            console.log('Password did not match.');
            res.send(`Incorrect password try ${userData[0].password}`)
        }
    });*/
})

router.get('/logout', async(req, res)=> {
    res.cookie('jwtToken', {
        httpOnly: true,
    })
    req.user = ''
    
    console.log(req.cookies.jwtToken)
    res.send('Logout successfully')
})

export default router
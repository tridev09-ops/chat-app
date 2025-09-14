import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next)=> {
    const jwtSecret = process.env.JWT_SECRET
    const jwtToken = req.cookies.jwtToken
    if (!jwtToken) {
        console.log("No token found")
        return res.redirect('/auth/signup')
    }
    jwt.verify(jwtToken, jwtSecret, (err, decoded) => {
        if (err) {
            console.log('Token is invalid')
            console.log(err.message)
            return res.redirect('/auth/signup')
        } else {
            req.user = decoded
            next()
        }
    })
}

export default authMiddleware
const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const router = Router()
const User = require('../models/User')

router.post(
    '/register',
    [
        check('username', 'Min username length must be > 0').isLength({ min: 1 }),
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Min password length must be > 0').isLength({ min: 1 })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data for Registration'
            })
        }

        const { username, email, password } = req.body

        const person = await User.findOne({$or: [{ username: username}, {email: email}] })

        if (person) return res.status(400).json({ message: 'This user is already exist' })

        const hashPassword = await bcrypt.hash(password, 12)
        const user = new User({ username, email, password: hashPassword })

        await user.save()

        res.status(201).json({ message: 'User created' })
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong' })
    }
})

router.post(
    '/login',
    [
        check('username', 'Enter username').isLength({ min: 1 }),
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data for LogIn'
                })
            }

            const { username, email, password } = req.body

            const user = await User.findOne({$or: [{ username: username}, {email: email }]})

            if (!user) return res.status(400).json({ message: 'User not found' })

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) return res.status(400).json({ message: 'Incorrect password. Try again' })

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h'}
            )

            res.json({ token, userId: user.id })
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' })
        }
})

module.exports = router


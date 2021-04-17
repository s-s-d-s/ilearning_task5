const { Router } = require('express')
const User = require('../models/User')
const router = Router()

router.get(
    '/table',
    async (req, res) => {
        try {
            const data = await User.find({}).select('userId username email registerAt status')

            if (!data) return res.status(400).json({ message: 'NO users in DB' })

            res.json(data)
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    }
)

router.post(
    '/block',
    async (req, res) => {
        try {
            const userId = req.body
            for (const item of Object.values(userId)) {
                const user = await User.findOneAndUpdate({_id: item}, {status: 'BLOCKED'})
                await user.save()
            }
            res.status(200).json({ message: 'Selected users now BLOCKED' })
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    }
)

router.post(
    '/unblock',
    async (req, res) => {
        try {
            const userId = req.body
            for (const item of Object.values(userId)) {
                const user = await User.findOneAndUpdate({_id: item}, {status: 'OK'})
                await user.save()
            }
            res.status(200).json({ message: 'Selected users now UNBLOCKED' })
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    }
)

router.post(
    '/delete',
    async (req, res) => {
        try {
            const userId = req.body
            for (const item of Object.values(userId)) {

                await User.findOneAndDelete({ _id: item })
            }
            res.status(200).json({ message: 'Selected users DELETED' })
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    }
)

module.exports = router
const express = require('express')
const { convertAmount } = require('../services/currencyService.js')

const router = express.Router()

// Convert endpoint
router.get('/convert', async (req, res) => {
    const { amount, from, to } = req.query
    try {
        const converted = await convertAmount(Number(amount), from, to)
        res.json({ amount: Number(amount), from, to, converted })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router

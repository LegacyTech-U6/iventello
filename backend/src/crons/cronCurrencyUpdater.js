// services/cronCurrencyUpdater.js


const cron = require('node-cron')
const axios = require('axios')

const db = require('../config/db.js')
const CurrencyRate = db.CurrencyRate

// Cron pour mettre à jour les taux de change toutes les heures
// Utilise une API gratuite pour récupérer les taux de change
// Stocke les taux dans la base de données et en cache mémoire

// API gratuite (exemple: Frankfurter)
const API_URL = 'https://api.frankfurter.app/latest'
const BASE_CURRENCY = 'USD' // devise de référence pour ton app

function startCurrencyCron() {
    // Toutes les heures
    cron.schedule('0 * * * *', async () => {
        console.log(`[Currency Cron] Running at ${new Date().toISOString()}`)

        try {
            const response = await axios.get(`${API_URL}?from=${BASE_CURRENCY}`)
            const rates = response.data.rates

            // Upsert dans la DB
            await CurrencyRate.upsert({
                base: BASE_CURRENCY,
                rates,
                updatedAt: new Date(),
            })

            console.log('[Currency Cron] Rates updated successfully')
        } catch (err) {
            console.error('[Currency Cron] Failed to fetch rates:', err.message)
        }
    })
}

module.exports = {
    startCurrencyCron,
}

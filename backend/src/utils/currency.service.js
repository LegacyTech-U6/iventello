const axios = require('axios')
const NodeCache = require('node-cache')
const cron = require('node-cron')
const db = require('../config/db.js')
const CurrencyRate = db.CurrencyRate

const cache = new NodeCache({ stdTTL: 3600 }) // cache 1h
const BASE_CURRENCY = 'USD'
const API_KEY = process.env.EXCHANGERATE_KEY
// Taux fixes pour CFA (lié à l'EUR)
const CFA_RATES = {
  XOF: 655.957,
  XAF: 655.957,
}

async function fetchFromExchangerateHost(base, targets = []) {
  try {
    let url = `https://api.exchangerate.host/${API_KEY}/latest?base=${base}`
    if (targets.length) url += `&symbols=${targets.join(',')}`
    console.log('[DEBUG] Fetching rates from exchangerate.host:', url)
    const res = await axios.get(url)
    return res.data.rates
  } catch (err) {
    console.warn('[WARN] exchangerate.host failed:', err.message)
    throw err
  }
}

async function fetchFromFrankfurter(base, targets = []) {
  try {
    let url = `https://api.frankfurter.dev/v1/latest?from=${base}`
    if (targets.length) url += `&to=${targets.join(',')}`
    console.log('[DEBUG] Fetching rates from frankfurter:', url)
    const res = await axios.get(url)
    let rates = res.data.converted || res.data.rates || {}
    // Ajoute CFA manuellement si base est EUR
    if (base === 'EUR') {
      rates = { ...rates, ...CFA_RATES }
    } else {
      // Si target inclut CFA et base n'est pas EUR
      for (const cfa in CFA_RATES) {
        if (targets.includes(cfa)) {
          rates[cfa] = (res.data.converted?.[cfa] || 0) // fallback
        }
      }
    }
    return rates
  } catch (err) {
    console.error('[ERROR] Frankfurter failed:', err.message)
    throw err
  }
}

/**
 * Récupère les taux depuis cache / DB / API (fallback inclus)
 */
async function getRates(base = BASE_CURRENCY, targets = []) {
  const cacheKey = `${base}_${targets.join(',')}`

//   // 1️⃣ Cache mémoire
//   const cached = cache.get(cacheKey)
//   if (cached) {
//     console.log('[DEBUG] Returning rates from memory cache:', cached)
//     return cached
//   }

//   // 2️⃣ DB
//   const dbRecord = await CurrencyRate.findByPk(base)
//   const now = new Date()
//   if (dbRecord && now - new Date(dbRecord.updatedAt) < 3600 * 1000) {
//     cache.set(cacheKey, dbRecord.rates)
//     console.log('[DEBUG] Returning rates from DB cache:', dbRecord.rates)
//     return dbRecord.rates
//   }

  // 3️⃣ API avec fallback
  let rates = {}
  try {
    rates = await fetchFromExchangerateHost(base, targets)
    console.log('====================================');
    console.log("ExchnagerateHost called",rates);
    console.log('====================================');
  } catch (err) {
    console.log('[DEBUG] Falling back to Frankfurter API')
    rates = await fetchFromFrankfurter(base, targets)
  }

  // Stocke cache + DB
  cache.set(cacheKey, rates)
  await CurrencyRate.upsert({
    base:'USD',
    rates,
    updatedAt: new Date(),
  })
  console.log('[DEBUG] Rates fetched and stored:', rates)
  return rates
}

/**
 * Convertit un montant d'une devise à une autre
 */
async function convertAmount(amount, from, to) {
  console.log(`[DEBUG] Converting amount: ${amount} from ${from} to ${to}`)
  if (from === to) return amount
  const rates = await getRates(from)
  if (!rates[to]) throw new Error(`No rate for ${to}`)
  const converted = amount * rates[to]
  console.log(`[DEBUG] Converted amount: ${converted}`)
  return converted
}

/**
 * Cron job pour rafraîchir les taux automatiquement toutes les heures
 */
function startCurrencyCron() {
  cron.schedule('0 * * * *', async () => {
    console.log(`[CRON] Updating currency rates at ${new Date().toISOString()}`)
    try {
      const rates = await getRates(BASE_CURRENCY)
      console.log('[CRON] Currency rates updated successfully:', rates)
    } catch (err) {
      console.error('[CRON] Failed to update currency rates:', err.message)
    }
  })
}

module.exports = {
  getRates,
  convertAmount,
  startCurrencyCron,
}

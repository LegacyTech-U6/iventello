/**
 * Groups an array of data based on the selected period and dates.
 *
 * @param {Array} data - The raw data array (e.g., expenses, discounts).
 * @param {string} period - The selected period ('day', 'week', 'month', 'year', 'semester').
 * @param {string} dateField - The field name containing the date (e.g., 'createdAt').
 * @param {string} amountField - The field name containing the amount to sum (e.g., 'amount', 'discount').
 * @returns {Array} - Array of grouped objects { label, date, count, total, items }.
 */
export const groupByPeriod = (data, period, dateField = 'createdAt', amountField = 'amount') => {
  if (!data || !data.length) return []

  // Define Grouping Strategy based on period
  // If Year/Semester -> Group by Month
  // If Month/Week -> Group by Day
  // If Day -> Detailed (No grouping, or group by Hour/Single Entry?) -> Let's group by Day (which is just one day usually)

  const isLargePeriod = ['year', 'semester'].includes(period)

  const groups = {}

  data.forEach((item) => {
    const dateObj = new Date(item[dateField])
    let key, label, sortDate

    if (isLargePeriod) {
      // Group by Month (e.g., "Janvier 2026")
      key = `${dateObj.getFullYear()}-${dateObj.getMonth()}` // Unique Key YYYY-MM
      label = dateObj.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
      // Capitalize
      label = label.charAt(0).toUpperCase() + label.slice(1)
      // Sort by first day of month
      sortDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime()
    } else {
      // Group by Day (e.g., "05/02/2026")
      // Use YYYY-MM-DD for key to ensure correct day separation
      key = dateObj.toISOString().split('T')[0]
      label = dateObj.toLocaleDateString('fr-FR')
      sortDate = new Date(key).getTime()
    }

    if (!groups[key]) {
      groups[key] = {
        label,
        sortDate,
        count: 0,
        total: 0,
        items: [],
      }
    }

    groups[key].count++
    groups[key].total += Number(item[amountField]) || 0
    groups[key].items.push(item)
  })

  // Convert to array and sort by date
  return Object.values(groups).sort((a, b) => b.sortDate - a.sortDate)
}

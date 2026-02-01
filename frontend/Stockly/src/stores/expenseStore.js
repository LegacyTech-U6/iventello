import { defineStore } from 'pinia'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/service/api'

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [],
    loading: false,
    totalExpenses: 0,
  }),

  actions: {
    async fetchExpenses() {
      this.loading = true
      try {
        const response = await getExpenses()
        this.expenses = response.data || []
        this.totalExpenses = response.count || 0
      } catch (error) {
        console.error('Error fetching expenses:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async addExpense(expenseData) {
      this.loading = true
      try {
        const response = await createExpense(expenseData)
        // Add to list immediately if successful
        this.expenses.unshift(response)
        this.totalExpenses++
        return response
      } catch (error) {
        console.error('Error adding expense:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateExpense(id, expenseData) {
      this.loading = true
      try {
        const response = await updateExpense(id, expenseData)
        const index = this.expenses.findIndex((e) => e.id === id)
        if (index !== -1) {
          this.expenses[index] = response
        }
        return response
      } catch (error) {
        console.error('Error updating expense:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteExpense(id) {
      this.loading = true
      try {
        await deleteExpense(id)
        this.expenses = this.expenses.filter((e) => e.id !== id)
        this.totalExpenses--
      } catch (error) {
        console.error('Error deleting expense:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})

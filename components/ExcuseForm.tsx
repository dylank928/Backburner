'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ExcuseFormProps {
  defaultCategories: string[]
  existingLog?: {
    intendedTask: string
    excuseCategory: string
    note?: string | null
  }
}

export default function ExcuseForm({ defaultCategories, existingLog }: ExcuseFormProps) {
  const router = useRouter()
  const [intendedTask, setIntendedTask] = useState(existingLog?.intendedTask || '')
  const [excuseCategory, setExcuseCategory] = useState(existingLog?.excuseCategory || '')
  const [note, setNote] = useState(existingLog?.note || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/excuse-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intendedTask,
          excuseCategory,
          note: note || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save entry')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="task" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Intended task
        </label>
        <input
          type="text"
          id="task"
          value={intendedTask}
          onChange={(e) => setIntendedTask(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          placeholder="What did you intend to do?"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Why was it deferred?
        </label>
        <select
          id="category"
          value={excuseCategory}
          onChange={(e) => setExcuseCategory(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="">Select a reason</option>
          {defaultCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Optional note
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          placeholder="Any additional context..."
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !intendedTask || !excuseCategory}
        className="w-full px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : existingLog ? 'Update entry' : 'Save entry'}
      </button>
    </form>
  )
}

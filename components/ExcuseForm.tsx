'use client'

import { useState } from 'react'
import { getCategoryColorClasses } from '@/lib/categoryColors'

interface ExcuseFormProps {
  categories: string[]
  existingLog?: {
    intendedTask: string
    excuseCategory: string
    note: string
  }
}

export default function ExcuseForm({ categories, existingLog }: ExcuseFormProps) {
  const [intendedTask, setIntendedTask] = useState(existingLog?.intendedTask || '')
  const [excuseCategory, setExcuseCategory] = useState(existingLog?.excuseCategory || '')
  const [note, setNote] = useState(existingLog?.note || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/excuse-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intendedTask,
          excuseCategory,
          note: note.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save entry')
      }

      // Success - show confirmation
      setSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = intendedTask.trim() !== '' && excuseCategory !== ''

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intended Task */}
      <div>
        <label 
          htmlFor="task" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Intended task
        </label>
        <input
          type="text"
          id="task"
          value={intendedTask}
          onChange={(e) => setIntendedTask(e.target.value)}
          required
          placeholder="What did you intend to do?"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Excuse Category */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">
            Why did you postpone it?
          </p>

          {categories.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No categories available yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const color = getCategoryColorClasses(category)
                const selected = excuseCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setExcuseCategory(category)}
                    className={`
                      flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition
                      ${selected
                        ? `${color.bg} ${color.text} border-transparent`
                        : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}
                    `}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${color.bg}`} />
                    {category}
                  </button>
                )
              })}
            </div>
          )}
        </div>

      {/* Optional Note */}
      <div>
        <label 
          htmlFor="note" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Optional note
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Any additional context..."
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
          Saved
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={`
          w-full rounded-xl py-3 text-sm font-medium transition
          ${isFormValid && !isSubmitting
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}
        `}
      >
        {isSubmitting ? 'Logging…' : 'Log Excuse'}
      </button>

      </div>
    </form>
  )
}

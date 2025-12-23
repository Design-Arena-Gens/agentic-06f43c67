'use client'

import { useState, useEffect } from 'react'

interface Goal {
  id: string
  title: string
  description: string
  category: string
  progress: number
  completed: boolean
  createdAt: string
}

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('personal')

  useEffect(() => {
    const stored = localStorage.getItem('goals')
    if (stored) {
      setGoals(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString()
    }

    setGoals([newGoal, ...goals])
    setTitle('')
    setDescription('')
    setCategory('personal')
  }

  const updateProgress = (id: string, increment: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newProgress = Math.min(100, Math.max(0, goal.progress + increment))
        return {
          ...goal,
          progress: newProgress,
          completed: newProgress === 100
        }
      }
      return goal
    }))
  }

  const toggleComplete = (id: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        return {
          ...goal,
          completed: !goal.completed,
          progress: !goal.completed ? 100 : goal.progress
        }
      }
      return goal
    }))
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const totalGoals = goals.length
  const completedGoals = goals.filter(g => g.completed).length
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0

  return (
    <div className="container">
      <div className="header">
        <h1>🎯 Goal Tracker</h1>
        <p>Set your goals and track your progress</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{totalGoals}</div>
          <div className="stat-label">Total Goals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedGoals}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgProgress}%</div>
          <div className="stat-label">Avg Progress</div>
        </div>
      </div>

      <form className="add-goal-form" onSubmit={addGoal}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Add New Goal</h2>

        <div className="form-group">
          <label htmlFor="title">Goal Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Learn TypeScript"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal in detail..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="personal">Personal</option>
            <option value="career">Career</option>
            <option value="health">Health</option>
            <option value="learning">Learning</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" className="btn">Add Goal</button>
      </form>

      <div className="goals-list">
        {goals.length === 0 ? (
          <div className="empty-state">
            <h2>No goals yet</h2>
            <p>Start by adding your first goal above!</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className={`goal-card ${goal.completed ? 'completed' : ''}`}>
              <div className="goal-header">
                <h3 className="goal-title">{goal.title}</h3>
                <span className="goal-category">{goal.category}</span>
              </div>

              {goal.description && (
                <p className="goal-description">{goal.description}</p>
              )}

              <div className="goal-progress">
                <div className="progress-label">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="goal-actions">
                {!goal.completed && (
                  <>
                    <button
                      className="btn-small btn-progress"
                      onClick={() => updateProgress(goal.id, -10)}
                    >
                      -10%
                    </button>
                    <button
                      className="btn-small btn-progress"
                      onClick={() => updateProgress(goal.id, 10)}
                    >
                      +10%
                    </button>
                  </>
                )}
                <button
                  className="btn-small btn-complete"
                  onClick={() => toggleComplete(goal.id)}
                >
                  {goal.completed ? 'Reopen' : 'Complete'}
                </button>
                <button
                  className="btn-small btn-delete"
                  onClick={() => deleteGoal(goal.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

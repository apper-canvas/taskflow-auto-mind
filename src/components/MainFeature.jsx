import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'
import * as taskService from '../services/api/taskService'
import * as projectService from '../services/api/projectService'
import * as categoryService from '../services/api/categoryService'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [searchTerm, setSearchTerm] = useState('')

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: '',
    projectId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [tasksData, projectsData, categoriesData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData || [])
      setProjects(projectsData || [])
      setCategories(categoriesData || [])
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      toast.error("Task title is required")
      return
    }

    try {
      const taskData = {
        ...taskForm,
        completed: false,
        createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
      }
      
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id || editingTask.id, taskData)
        setTasks(prev => prev.map(task => (task.Id || task.id) === (editingTask.Id || editingTask.id) ? updatedTask : task))
        toast.success("Task updated successfully!")
      } else {
        const newTask = await taskService.create(taskData)
        setTasks(prev => [newTask, ...prev])
        toast.success("Task created successfully!")
      }

      resetForm()
    } catch (err) {
      toast.error("Failed to save task")
    }
  }

  const resetForm = () => {
    setTaskForm({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: '',
      projectId: ''
    })
    setEditingTask(null)
    setShowTaskForm(false)
}

  const handleEditTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || task.due_date || '',
      priority: task.priority,
      category: task.category || '',
      projectId: task.projectId || task.project_id || ''
    })
    setEditingTask(task)
    setShowTaskForm(true)
  }
const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => (task.Id || task.id) !== taskId))
      toast.success("Task deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete task")
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      const taskData = {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate || task.due_date || null,
        priority: task.priority,
        completed: !task.completed,
        category: task.category || null,
        projectId: task.projectId || task.project_id || null
      }
      const updatedTask = await taskService.update(task.Id || task.id, taskData)
      setTasks(prev => prev.map(t => (t.Id || t.id) === (task.Id || task.id) ? updatedTask : t))
      toast.success(updatedTask.completed ? "Task completed!" : "Task reopened!")
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-surface-400'
    }
  }

  const getDateStatus = (dueDate) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    if (isPast(date) && !isToday(date)) return 'overdue'
    if (isToday(date)) return 'today'
    if (isTomorrow(date)) return 'tomorrow'
    return 'future'
  }
}

  const filteredAndSortedTasks = tasks
      if (filter === 'completed') return task.completed
      if (filter === 'pending') return !task.completed
      if (filter === 'overdue') return getDateStatus(task.dueDate || task.due_date) === 'overdue' && !task.completed
      return true
    })
    .filter(task => 
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'dueDate') {
        const aDueDate = a.dueDate || a.due_date
        const bDueDate = b.dueDate || b.due_date
        if (!aDueDate && !bDueDate) return 0
        if (!aDueDate) return 1
        if (!bDueDate) return -1
        return new Date(aDueDate) - new Date(bDueDate)
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-xl rounded-3xl shadow-neu-light dark:shadow-neu-dark border border-surface-200/50 dark:border-surface-700/50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-surface-200 dark:border-surface-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-surface-800 dark:to-surface-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
                Task Manager
              </h3>
              <p className="text-surface-600 dark:text-surface-300">
                {tasks.length} total tasks • {tasks.filter(t => !t.completed).length} pending
              </p>
            </div>
            
            <motion.button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-soft hover:shadow-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name={showTaskForm ? "X" : "Plus"} className="w-5 h-5" />
              <span className="hidden sm:inline">{showTaskForm ? "Cancel" : "Add Task"}</span>
            </motion.button>
          </div>
        </div>

        {/* Task Form */}
        <AnimatePresence>
          {showTaskForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50"
            >
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter task title..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={taskForm.description}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Add task description..."
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={taskForm.dueDate}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="w-full px-4 py-3 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={taskForm.priority}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                          className="w-full px-4 py-3 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Category
                        </label>
                        <select
                          value={taskForm.category}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, category: e.target.value }))}
className="w-full px-4 py-3 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select category</option>
                          {categories?.map(category => (
                            <option key={category.Id || category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Project
                        </label>
                        <select
                          value={taskForm.projectId}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, projectId: e.target.value }))}
className="w-full px-4 py-3 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select project</option>
                          {projects?.map(project => (
                            <option key={project.Id || project.id} value={project.Id || project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-soft hover:shadow-card"
                  >
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Search */}
        <div className="p-6 md:p-8 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/30">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex space-x-2 bg-white dark:bg-surface-700 rounded-xl p-1 shadow-soft">
                {[
                  { key: 'all', label: 'All', icon: 'List' },
                  { key: 'pending', label: 'Pending', icon: 'Clock' },
                  { key: 'completed', label: 'Done', icon: 'CheckCircle' },
                  { key: 'overdue', label: 'Overdue', icon: 'AlertTriangle' }
                ].map(filterOption => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === filterOption.key
                        ? 'bg-primary-500 text-white shadow-soft'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-600'
                    }`}
                  >
                    <ApperIcon name={filterOption.icon} className="w-4 h-4" />
                    <span className="hidden sm:inline">{filterOption.label}</span>
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="created">Sort by Created</option>
              </select>
            </div>

            <div className="relative max-w-sm">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {filteredAndSortedTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-10 h-10 text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                {searchTerm ? 'No matching tasks' : filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </h3>
              <p className="text-surface-500 dark:text-surface-400">
                {searchTerm ? 'Try a different search term' : 'Create your first task to get started!'}
              </p>
            </motion.div>
          ) : (
<div className="space-y-3">
              <AnimatePresence>
                {filteredAndSortedTasks.map((task) => {
                  const dateStatus = getDateStatus(task.dueDate || task.due_date)
                  const project = projects?.find(p => (p.id || p.Id) === (task.projectId || task.project_id))
                  
                  return (
                    <motion.div
                      key={task.Id || task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className={`group p-4 md:p-6 bg-white dark:bg-surface-800 rounded-xl border-l-4 shadow-task-card hover:shadow-hover-lift transition-all duration-200 ${
                        task.completed 
                          ? 'border-l-green-500 opacity-75' 
                          : `border-l-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-500`
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'
                          }`}
                        >
                          {task.completed && <ApperIcon name="Check" className="w-4 h-4" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <h4 className={`text-lg font-semibold ${
                              task.completed 
                                ? 'text-surface-500 dark:text-surface-400 line-through' 
                                : 'text-surface-900 dark:text-white'
                            }`}>
                              {task.title}
                            </h4>
                            
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                              <span className="text-xs font-medium text-surface-500 dark:text-surface-400 capitalize">
                                {task.priority}
                              </span>
                            </div>
                          </div>

                          {task.description && (
                            <p className={`text-sm mb-3 ${
                              task.completed 
                                ? 'text-surface-400 dark:text-surface-500' 
                                : 'text-surface-600 dark:text-surface-300'
                            }`}>
                              {task.description}
                            </p>
)}

                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            {(task.dueDate || task.due_date) && (
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                                dateStatus === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                dateStatus === 'today' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                dateStatus === 'tomorrow' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
                              }`}>
                                <ApperIcon name="Calendar" className="w-3 h-3" />
                                <span>
                                  {dateStatus === 'today' ? 'Today' :
                                   dateStatus === 'tomorrow' ? 'Tomorrow' :
                                   dateStatus === 'overdue' ? 'Overdue' :
                                   format(new Date(task.dueDate || task.due_date), 'MMM d')}
                                </span>
                              </div>
                            )}

                            {task.category && (
                              <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                                <ApperIcon name="Tag" className="w-3 h-3" />
                                <span>{task.category}</span>
                              </div>
                            )}

                            {project && (
                              <div className="flex items-center space-x-1 px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
                                <ApperIcon name="Folder" className="w-3 h-3" />
                                <span>{project.name}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                          >
<ApperIcon name="Edit" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.Id || task.id)}
                            className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default MainFeature
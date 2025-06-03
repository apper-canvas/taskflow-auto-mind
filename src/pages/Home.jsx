import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-soft">
                <ApperIcon name="CheckSquare" className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </motion.div>

            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 md:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200 shadow-soft hover:shadow-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="w-5 h-5 md:w-6 md:h-6 text-surface-600 dark:text-surface-400" 
              />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-4 md:mb-6">
              Master Your
              <span className="block bg-gradient-to-r from-primary-600 via-secondary-500 to-accent bg-clip-text text-transparent">
                Productivity
              </span>
            </h2>
            <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto leading-relaxed">
              Transform chaos into clarity with TaskFlow's intelligent task management system. Organize, prioritize, and conquer your goals with style.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 md:mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              {
                icon: "Target",
                title: "Smart Prioritization",
                description: "AI-powered task ranking keeps you focused on what matters most"
              },
              {
                icon: "Calendar",
                title: "Deadline Mastery",
                description: "Never miss a deadline with intelligent scheduling and reminders"
              },
              {
                icon: "BarChart3",
                title: "Progress Insights",
                description: "Visual analytics show your productivity patterns and growth"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group p-6 lg:p-8 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl border border-surface-200/50 dark:border-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:shadow-hover-lift"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ApperIcon name={feature.icon} className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-surface-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Start Managing Tasks
              <span className="block text-primary-600">Like a Pro</span>
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Experience the power of organized productivity. Create, manage, and complete your tasks with our intuitive interface.
            </p>
          </motion.div>
          
          <MainFeature />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">TaskFlow</h3>
            </div>
            <p className="text-surface-400 mb-6 max-w-md mx-auto">
              Empowering productivity, one task at a time. Built with ❤️ for achievers.
            </p>
            <div className="flex items-center justify-center space-x-6 text-surface-400">
              <span className="text-sm">© 2024 TaskFlow</span>
              <span className="text-sm">Made with modern tech</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default Home
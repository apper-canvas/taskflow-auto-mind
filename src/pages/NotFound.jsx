import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-primary-50 dark:from-surface-900 dark:to-surface-800">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-soft">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-surface-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          
          <p className="text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
            The page you're looking for doesn't exist. Let's get you back to organizing your tasks!
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-soft hover:shadow-card transform hover:scale-105"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to TaskFlow</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
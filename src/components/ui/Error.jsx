import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Error = ({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  onHome,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'border-red-200 bg-red-50',
    minimal: 'border-cloud-300 bg-white',
    fullPage: 'border-red-200 bg-gradient-to-br from-red-50 to-white'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
      {...props}
    >
      <Card 
        className={`text-center ${variants[variant]}`}
        padding="xl"
      >
        <div className="max-w-md mx-auto space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
          >
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-midnight-700 font-display">
              {title}
            </h3>
            <p className="text-midnight-600">
              {message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                onClick={onRetry}
                icon="RotateCcw"
                variant="primary"
              >
                Try Again
              </Button>
            )}
            {onHome && (
              <Button
                onClick={onHome}
                icon="Home"
                variant="outline"
              >
                Go Home
              </Button>
            )}
          </div>

          <div className="pt-4 border-t border-red-200">
            <p className="text-sm text-midnight-500">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Error
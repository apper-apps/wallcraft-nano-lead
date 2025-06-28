import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Empty = ({ 
  title = 'No data available',
  message = 'Get started by adding your first item.',
  icon = 'Inbox',
  actionLabel = 'Get Started',
  onAction,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-white border-cloud-300',
    gradient: 'bg-gradient-to-br from-cloud-50 to-white border-cloud-300',
    minimal: 'bg-transparent border-none'
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
        <div className="max-w-sm mx-auto space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-cloud-200 to-cloud-300 rounded-full flex items-center justify-center"
          >
            <ApperIcon name={icon} className="w-10 h-10 text-midnight-400" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-midnight-700 font-display">
              {title}
            </h3>
            <p className="text-midnight-600">
              {message}
            </p>
          </div>

          {onAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={onAction}
                icon="Plus"
                size="lg"
              >
                {actionLabel}
              </Button>
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cloud-300">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-bright-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Zap" className="w-4 h-4 text-bright-600" />
              </div>
              <p className="text-xs text-midnight-600">Fast</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-carrot-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Shield" className="w-4 h-4 text-carrot-600" />
              </div>
              <p className="text-xs text-midnight-600">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Heart" className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-midnight-600">Easy</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Empty
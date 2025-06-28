import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Loading = ({ 
  variant = 'default',
  size = 'md',
  message = 'Loading...',
  className = '',
  ...props 
}) => {
  const variants = {
    default: (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-cloud-300 rounded w-3/4"></div>
          <div className="h-4 bg-cloud-300 rounded w-1/2"></div>
          <div className="h-4 bg-cloud-300 rounded w-5/6"></div>
        </div>
      </div>
    ),
    spinner: (
      <div className="flex items-center space-x-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-bright-500 border-t-transparent rounded-full"
        />
        <span className="text-midnight-600">{message}</span>
      </div>
    ),
    dots: (
      <div className="flex items-center space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-3 h-3 bg-bright-500 rounded-full"
          />
        ))}
      </div>
    ),
    skeleton: (
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-cloud-300 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-cloud-300 rounded w-3/4"></div>
            <div className="h-3 bg-cloud-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-cloud-300 rounded"></div>
          <div className="h-4 bg-cloud-300 rounded w-5/6"></div>
          <div className="h-4 bg-cloud-300 rounded w-4/6"></div>
        </div>
      </div>
    )
  }

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        flex items-center justify-center
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      <div className="text-center max-w-sm">
        {variants[variant]}
        {variant === 'default' && message && (
          <p className="mt-4 text-midnight-600 text-sm">{message}</p>
        )}
      </div>
    </motion.div>
  )
}

export default Loading
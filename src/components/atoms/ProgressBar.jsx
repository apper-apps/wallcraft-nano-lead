import React from 'react'
import { motion } from 'framer-motion'

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  variant = 'primary',
  size = 'md',
  showValue = false,
  className = '',
  label,
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const variants = {
    primary: "bg-gradient-to-r from-bright-500 to-bright-600",
    secondary: "bg-gradient-to-r from-carrot-500 to-carrot-600",
    success: "bg-gradient-to-r from-green-500 to-green-600",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    danger: "bg-gradient-to-r from-red-500 to-red-600"
  }
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-6"
  }
  
  return (
    <div className={className} {...props}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-midnight-700">{label}</span>
          {showValue && (
            <span className="text-sm text-midnight-600">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-cloud-300 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`${sizes[size]} ${variants[variant]} rounded-full`}
        />
      </div>
    </div>
  )
}

export default ProgressBar
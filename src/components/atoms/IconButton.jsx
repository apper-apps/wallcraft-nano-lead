import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const IconButton = ({ 
  icon, 
  variant = 'ghost', 
  size = 'md',
  className = '',
  tooltip,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-bright-500 to-bright-600 hover:from-bright-600 hover:to-bright-700 text-white shadow-card hover:shadow-panel focus:ring-bright-500",
    secondary: "bg-gradient-to-r from-carrot-500 to-carrot-600 hover:from-carrot-600 hover:to-carrot-700 text-white shadow-card hover:shadow-panel focus:ring-carrot-500",
    ghost: "text-midnight-600 hover:bg-cloud-200 hover:text-midnight-700 focus:ring-midnight-500",
    outline: "border-2 border-midnight-300 text-midnight-600 hover:bg-midnight-50 hover:border-midnight-400 focus:ring-midnight-500"
  }
  
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14"
  }
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7"
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      <ApperIcon 
        name={icon} 
        className={iconSizes[size]} 
      />
    </motion.button>
  )
}

export default IconButton
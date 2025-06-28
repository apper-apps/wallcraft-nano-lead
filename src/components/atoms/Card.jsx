import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  shadow = 'card',
  gradient = false,
  ...props 
}) => {
  const baseClasses = "bg-white rounded-xl border border-cloud-300 transition-all duration-200"
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
  const shadows = {
    none: '',
    card: 'shadow-card',
    panel: 'shadow-panel',
    floating: 'shadow-floating'
  }
  
  const hoverClasses = hover ? 'hover:shadow-panel hover:scale-[1.02] cursor-pointer' : ''
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-cloud-100' : ''
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${baseClasses}
        ${paddings[padding]}
        ${shadows[shadow]}
        ${hoverClasses}
        ${gradientClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
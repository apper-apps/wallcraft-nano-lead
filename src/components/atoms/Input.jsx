import React, { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 border border-cloud-400 rounded-lg focus:ring-2 focus:ring-bright-500 focus:border-bright-500 transition-all duration-200 bg-white"
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''

  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-midnight-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0' : 'right-0'} flex items-center ${iconPosition === 'left' ? 'pl-3' : 'pr-3'} pointer-events-none`}>
            <ApperIcon 
              name={icon} 
              className="w-5 h-5 text-midnight-400" 
            />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            ${baseClasses}
            ${errorClasses}
            ${iconClasses}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
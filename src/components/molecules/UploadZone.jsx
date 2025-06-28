import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const UploadZone = ({ 
  onFileSelect, 
  acceptedTypes = '.jpg,.jpeg,.png,.webp',
  title,
  description,
  icon = 'Upload',
  preview = null,
  className = '',
  maxSize = 10 * 1024 * 1024, // 10MB
  ...props 
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)

  const validateFile = (file) => {
    if (!file) return false
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)')
      return false
    }
    
    // Check file size
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return false
    }
    
    return true
  }

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      onFileSelect(file)
      toast.success('Image uploaded successfully!')
    }
  }

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setIsDragActive(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setIsDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <Card 
      className={`
        relative border-2 border-dashed transition-all duration-200 cursor-pointer
        ${isDragOver ? 'drag-over' : 'border-cloud-400 hover:border-bright-300'}
        ${isDragActive ? 'drag-active' : ''}
        ${className}
      `}
      padding="lg"
      hover={!isDragActive}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      {...props}
    >
      <input
        type="file"
        accept={acceptedTypes}
        onChange={handleInputChange}
        className="file-input"
        aria-label={`Upload ${title}`}
      />
      
      {preview ? (
        <div className="space-y-4">
          <div className="relative w-full h-64 bg-cloud-100 rounded-lg overflow-hidden">
            <img 
              src={preview} 
              alt="Preview" 
              className="image-preview w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-500 text-white rounded-full p-2"
              >
                <ApperIcon name="Check" className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-midnight-600">Click or drag to replace image</p>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-bright-100 to-bright-200 rounded-full flex items-center justify-center">
            <ApperIcon 
              name={icon} 
              className="w-8 h-8 text-bright-600" 
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-midnight-700 font-display">
              {title}
            </h3>
            <p className="text-midnight-500 text-sm">
              {description}
            </p>
            <p className="text-xs text-midnight-400">
              Supports JPEG, PNG, WebP • Max {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
          
          <motion.div
            animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-bright-500 to-bright-600 text-white rounded-lg text-sm font-medium"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Choose File
          </motion.div>
        </motion.div>
      )}
    </Card>
  )
}

export default UploadZone
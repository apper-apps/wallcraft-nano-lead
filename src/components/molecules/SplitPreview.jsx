import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const SplitPreview = ({ 
  originalImage, 
  processedImage, 
  className = '',
  ...props 
}) => {
  const [dividerPosition, setDividerPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100
      setDividerPosition(Math.max(0, Math.min(100, newPosition)))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <Card 
      className={`overflow-hidden ${className}`}
      padding="none"
      {...props}
    >
      <div className="px-6 py-4 border-b border-cloud-300 bg-gradient-to-r from-white to-cloud-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-midnight-700 font-display">
            Before & After Comparison
          </h3>
          <div className="flex items-center space-x-4 text-sm text-midnight-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-midnight-400 rounded-full"></div>
              <span>Original</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-bright-500 to-carrot-500 rounded-full"></div>
              <span>Transformed</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-96 bg-cloud-100 overflow-hidden select-none"
        style={{ cursor: isDragging ? 'col-resize' : 'default' }}
      >
        {/* Original Image */}
        {originalImage && (
          <div className="absolute inset-0">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        )}

        {/* Processed Image */}
        {processedImage && (
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ 
              clipPath: `polygon(${dividerPosition}% 0%, 100% 0%, 100% 100%, ${dividerPosition}% 100%)` 
            }}
          >
            <img 
              src={processedImage} 
              alt="Processed" 
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        )}

        {/* Divider */}
        {originalImage && processedImage && (
          <motion.div
            className="absolute top-0 bottom-0 w-1 split-divider flex items-center justify-center cursor-col-resize z-10"
            style={{ left: `${dividerPosition}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleMouseDown}
            whileHover={{ scale: 1.2 }}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
              <ApperIcon name="GripVertical" className="w-4 h-4 text-bright-600" />
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {(!originalImage || !processedImage) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-cloud-300 rounded-full flex items-center justify-center">
                <ApperIcon name="ImageIcon" className="w-8 h-8 text-midnight-400" />
              </div>
              <div className="space-y-1">
                <p className="text-midnight-600 font-medium">
                  Upload images to see comparison
                </p>
                <p className="text-sm text-midnight-500">
                  Process your transformation to view before & after
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Position Indicator */}
      {originalImage && processedImage && (
        <div className="px-6 py-3 bg-cloud-50 border-t border-cloud-300">
          <div className="flex items-center justify-center space-x-2 text-xs text-midnight-600">
            <span>Drag the divider to compare</span>
            <ApperIcon name="Move" className="w-3 h-3" />
            <span>{Math.round(dividerPosition)}% transformed</span>
          </div>
        </div>
      )}
    </Card>
  )
}

export default SplitPreview
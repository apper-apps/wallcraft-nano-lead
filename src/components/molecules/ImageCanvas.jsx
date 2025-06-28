import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import IconButton from '@/components/atoms/IconButton'
import Card from '@/components/atoms/Card'

const ImageCanvas = ({ 
  image, 
  title,
  overlay = null,
  controls = true,
  className = '',
  onImageLoad,
  ...props 
}) => {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true)
      setLastPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      const deltaX = e.clientX - lastPos.x
      const deltaY = e.clientY - lastPos.y
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      setLastPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, lastPos])

  return (
    <Card 
      className={`relative overflow-hidden ${className}`}
      padding="none"
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-cloud-300 bg-gradient-to-r from-white to-cloud-50">
          <h3 className="text-lg font-semibold text-midnight-700 font-display">
            {title}
          </h3>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="relative w-full h-96 bg-cloud-100 overflow-hidden canvas-container"
        onMouseDown={handleMouseDown}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {image ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            <img 
              ref={canvasRef}
              src={image} 
              alt="Canvas content" 
              className="max-w-full max-h-full object-contain"
              onLoad={onImageLoad}
              draggable={false}
            />
            {overlay && (
              <div className="absolute inset-0 flex items-center justify-center">
                {overlay}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-cloud-300 rounded-full flex items-center justify-center">
                <ApperIcon name="Image" className="w-6 h-6 text-midnight-400" />
              </div>
              <p className="text-midnight-500 text-sm">No image loaded</p>
            </div>
          </div>
        )}
      </div>
      
      {controls && image && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-panel"
        >
          <IconButton 
            icon="ZoomOut" 
            size="sm" 
            variant="ghost"
            onClick={handleZoomOut}
            tooltip="Zoom Out"
            disabled={zoom <= 0.5}
          />
          <span className="text-xs text-midnight-600 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <IconButton 
            icon="ZoomIn" 
            size="sm" 
            variant="ghost"
            onClick={handleZoomIn}
            tooltip="Zoom In"
            disabled={zoom >= 3}
          />
          <div className="w-px h-4 bg-cloud-300" />
          <IconButton 
            icon="RotateCcw" 
            size="sm" 
            variant="ghost"
            onClick={handleReset}
            tooltip="Reset View"
          />
        </motion.div>
      )}
    </Card>
  )
}

export default ImageCanvas
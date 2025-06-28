import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fabric } from 'fabric'
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
  selectionMode = false,
  wallSelection = [],
  onWallSelectionChange,
  onSelectionModeChange,
  ...props 
}) => {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const [currentSelection, setCurrentSelection] = useState(null)
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

  // Initialize Fabric.js canvas for wall selection
  useEffect(() => {
    if (selectionMode && canvasRef.current && image) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        selection: false,
        backgroundColor: 'transparent'
      })
      
      fabricCanvasRef.current = canvas
      
      // Load background image
      fabric.Image.fromURL(image, (img) => {
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        )
        img.scale(scale)
        img.set({
          left: (canvas.width - img.width * scale) / 2,
          top: (canvas.height - img.height * scale) / 2,
          selectable: false,
          evented: false
        })
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
      })
      
      // Enable polygon drawing for wall selection
      let isDrawing = false
      let currentPolygon = null
      let points = []
      
      canvas.on('mouse:down', (e) => {
        if (!selectionMode) return
        
        const pointer = canvas.getPointer(e.e)
        
        if (!isDrawing) {
          isDrawing = true
          points = [pointer]
          
          // Create temporary polygon
          currentPolygon = new fabric.Polygon(points, {
            fill: 'rgba(255, 0, 0, 0.3)',
            stroke: 'red',
            strokeWidth: 2,
            selectable: false
          })
          canvas.add(currentPolygon)
        } else {
          points.push(pointer)
          canvas.remove(currentPolygon)
          
          currentPolygon = new fabric.Polygon(points, {
            fill: 'rgba(255, 0, 0, 0.3)',
            stroke: 'red',
            strokeWidth: 2,
            selectable: false
          })
          canvas.add(currentPolygon)
        }
      })
      
      canvas.on('mouse:dblclick', () => {
        if (isDrawing && points.length >= 3) {
          isDrawing = false
          
          // Add to wall selection
          const newSelection = {
            type: 'polygon',
            points: points.map(p => ({ x: p.x, y: p.y }))
          }
          
          onWallSelectionChange?.([...wallSelection, newSelection])
          setCurrentSelection(newSelection)
          
          points = []
          currentPolygon = null
        }
      })
      
      return () => {
        canvas.dispose()
        fabricCanvasRef.current = null
      }
    }
  }, [selectionMode, image])

  const handleToggleSelectionMode = () => {
    onSelectionModeChange?.(!selectionMode)
  }

  const handleClearSelection = () => {
    onWallSelectionChange?.([])
    setCurrentSelection(null)
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear()
    }
  }

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
            className="w-full h-full flex items-center justify-center relative"
            style={{
              transform: selectionMode ? 'none' : `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            {selectionMode ? (
              <canvas 
                ref={canvasRef}
                width={400}
                height={300}
                className="max-w-full max-h-full border-2 border-dashed border-red-400"
              />
            ) : (
              <img 
                ref={canvasRef}
                src={image} 
                alt="Canvas content" 
                className="max-w-full max-h-full object-contain"
                onLoad={onImageLoad}
                draggable={false}
              />
            )}
            {overlay && (
              <div className="absolute inset-0 flex items-center justify-center">
                {overlay}
              </div>
            )}
            
            {/* Wall Selection Indicator */}
            {wallSelection.length > 0 && !selectionMode && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                {wallSelection.length} wall area{wallSelection.length > 1 ? 's' : ''} selected
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
          {/* Wall Selection Controls */}
          {onWallSelectionChange && (
            <>
              <IconButton 
                icon={selectionMode ? "Square" : "Edit"} 
                size="sm" 
                variant={selectionMode ? "primary" : "ghost"}
                onClick={handleToggleSelectionMode}
                tooltip={selectionMode ? "Exit Selection Mode" : "Select Wall Areas"}
              />
              {wallSelection.length > 0 && (
                <IconButton 
                  icon="Trash2" 
                  size="sm" 
                  variant="ghost"
                  onClick={handleClearSelection}
                  tooltip="Clear Selection"
                />
              )}
              <div className="w-px h-4 bg-cloud-300" />
            </>
          )}
          
          {/* Standard Zoom Controls */}
          {!selectionMode && (
            <>
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
            </>
          )}
        </motion.div>
      )}
    </Card>
  )
}

export default ImageCanvas
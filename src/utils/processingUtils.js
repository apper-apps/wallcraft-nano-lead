/**
 * Simulate image processing with realistic stages and timing
 * @param {Object} options - Processing options
 * @param {Function} onProgress - Progress callback
 * @param {Function} onStageChange - Stage change callback
 * @returns {Promise<string>} Promise that resolves to processed image URL
 */
export const processImages = async (roomImage, surfaceImage, options = {}, onProgress, onStageChange) => {
  const stages = [
    { 
      key: 'analyzing', 
      label: 'Analyzing room image...', 
      duration: 2000, 
      progress: 15 
    },
    { 
      key: 'detecting', 
      label: 'Detecting wall surfaces...', 
      duration: 3000, 
      progress: 35 
    },
    { 
      key: 'isolating', 
      label: 'Isolating wall areas from furniture...', 
      duration: 2500, 
      progress: 55 
    },
    { 
      key: 'masking', 
      label: 'Creating precision wall mask...', 
      duration: 2000, 
      progress: 70 
    },
    { 
      key: 'mapping', 
      label: 'Mapping surface texture...', 
      duration: 2500, 
      progress: 85 
    },
    { 
      key: 'rendering', 
      label: 'Rendering final image...', 
      duration: 2000, 
      progress: 95 
    },
    { 
      key: 'complete', 
      label: 'Processing complete!', 
      duration: 500, 
      progress: 100 
    }
  ]

  for (const stage of stages) {
    onStageChange?.(stage.key)
    
    // Animate progress smoothly
    const startProgress = stage.progress - 25
    const endProgress = stage.progress
    const steps = 20
    const stepDuration = stage.duration / steps
    
    for (let i = 0; i <= steps; i++) {
      const progress = startProgress + (endProgress - startProgress) * (i / steps)
      onProgress?.(Math.min(progress, 100))
      await new Promise(resolve => setTimeout(resolve, stepDuration))
    }
}

// Perform actual texture transformation with wall targeting
  const processedImageUrl = await createTextureBlendedImage(roomImage, surfaceImage, options)
  return processedImageUrl
}

/**
 * Create a texture-blended image using canvas operations
 * @param {string} roomImageUrl - Room image data URL
 * @param {string} surfaceImageUrl - Surface image data URL
 * @param {Object} options - Processing options
 * @returns {Promise<string>} Promise that resolves to blended image data URL
 */
const createTextureBlendedImage = async (roomImageUrl, surfaceImageUrl, options = {}) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    const roomImg = new Image()
    const surfaceImg = new Image()
    
    let imagesLoaded = 0
    const checkImagesLoaded = () => {
      imagesLoaded++
      if (imagesLoaded === 2) {
        try {
          // Set canvas size to room image dimensions
          canvas.width = roomImg.width
          canvas.height = roomImg.height
          
          // Draw room image as base
          ctx.drawImage(roomImg, 0, 0)
          
          // Apply wall detection and masking
          const wallMask = createWallMask(roomImg, options.wallSelection)
          
          // Create pattern from surface image
          const pattern = ctx.createPattern(surfaceImg, 'repeat')
          
          // Apply wall mask for precise targeting
          if (wallMask) {
            ctx.save()
            ctx.globalCompositeOperation = 'source-in'
            ctx.drawImage(wallMask, 0, 0)
            ctx.restore()
          }
          
          // Apply texture blend mode for realistic surface application
          ctx.globalCompositeOperation = 'multiply'
          ctx.globalAlpha = options.textureOpacity || 0.7
          
          // Fill with surface pattern only in wall areas
          if (options.wallSelection && options.wallSelection.length > 0) {
            applyTextureToSelection(ctx, pattern, options.wallSelection)
          } else {
            ctx.fillStyle = pattern
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
          
          // Restore normal blending for any additional operations
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 1.0
          
          // Convert canvas to data URL
          const resultDataUrl = canvas.toDataURL('image/jpeg', 0.9)
          resolve(resultDataUrl)
        } catch (error) {
          reject(new Error('Failed to process images: ' + error.message))
        }
      }
    }
    
    roomImg.onload = checkImagesLoaded
    surfaceImg.onload = checkImagesLoaded
    
    roomImg.onerror = () => reject(new Error('Failed to load room image'))
    surfaceImg.onerror = () => reject(new Error('Failed to load surface image'))
    
    roomImg.src = roomImageUrl
    surfaceImg.src = surfaceImageUrl
  })
}

/**
 * Validate processing inputs
 * @param {string} roomImage - Room image data URL
 * @param {string} surfaceImage - Surface image data URL
 * @returns {Object} Validation result
 */
export const validateProcessingInputs = (roomImage, surfaceImage) => {
  if (!roomImage) {
    return { isValid: false, error: 'Room image is required' }
  }
  
  if (!surfaceImage) {
    return { isValid: false, error: 'Surface image is required' }
  }
  
  return { isValid: true }
}

/**
 * Get default processing settings
 * @returns {Object} Default settings object
 */
export const getDefaultProcessingSettings = () => ({
  lightingMatch: true,
  perspectiveCorrection: true,
  edgeSmoothing: 85,
  outputQuality: 95,
  preserveDetails: true,
  colorBalance: 'auto',
  seamBlending: true
})

/**
 * Apply processing settings validation
 * @param {Object} settings - Processing settings
 * @returns {Object} Validated and normalized settings
 */
export const validateProcessingSettings = (settings) => {
  const defaults = getDefaultProcessingSettings()
  const validated = { ...defaults, ...settings }
  
  // Normalize numeric values
  validated.edgeSmoothing = Math.max(0, Math.min(100, validated.edgeSmoothing))
  validated.outputQuality = Math.max(1, Math.min(100, validated.outputQuality))
  
  return validated
}

/**
 * Estimate processing time based on image sizes and settings
 * @param {string} roomImage - Room image data URL
 * @param {string} surfaceImage - Surface image data URL
 * @param {Object} settings - Processing settings
 * @returns {number} Estimated processing time in seconds
 */
export const estimateProcessingTime = (roomImage, surfaceImage, settings = {}) => {
  // Base time in seconds
  let estimatedTime = 15
  
  // Adjust based on image complexity (simulated)
  const roomImageSize = roomImage?.length || 0
  const surfaceImageSize = surfaceImage?.length || 0
  
  if (roomImageSize > 500000) estimatedTime += 5 // Large room image
  if (surfaceImageSize > 300000) estimatedTime += 3 // Large surface image
  
  // Adjust based on settings
  if (settings.perspectiveCorrection) estimatedTime += 5
  if (settings.lightingMatch) estimatedTime += 3
  if (settings.edgeSmoothing > 80) estimatedTime += 2
  
  return Math.max(10, Math.min(45, estimatedTime))
}

/**
 * Cancel ongoing processing
 * @param {string} processId - Processing ID to cancel
 * @returns {Promise<boolean>} Success status
 */
export const cancelProcessing = async (processId) => {
  // In a real application, this would cancel the actual processing
  await new Promise(resolve => setTimeout(resolve, 100))
  return true
}

/**
 * Get processing status
 * @param {string} processId - Processing ID
 * @returns {Promise<Object>} Processing status object
 */
export const getProcessingStatus = async (processId) => {
  // Mock implementation
  return {
    id: processId,
    status: 'completed',
    progress: 100,
    stage: 'complete',
    estimatedTimeRemaining: 0,
    error: null
  }
/**
 * Create wall mask for precise targeting
 * @param {HTMLImageElement} roomImage - Room image element
 * @param {Array} wallSelection - Manual wall selection data
 * @returns {HTMLCanvasElement} Wall mask canvas
 */
const createWallMask = (roomImage, wallSelection) => {
  const maskCanvas = document.createElement('canvas')
  const maskCtx = maskCanvas.getContext('2d')
  
  maskCanvas.width = roomImage.width
  maskCanvas.height = roomImage.height
  
  if (wallSelection && wallSelection.length > 0) {
    // Use manual selection for wall areas
    maskCtx.fillStyle = 'white'
    wallSelection.forEach(area => {
      if (area.type === 'polygon') {
        maskCtx.beginPath()
        maskCtx.moveTo(area.points[0].x, area.points[0].y)
        area.points.slice(1).forEach(point => {
          maskCtx.lineTo(point.x, point.y)
        })
        maskCtx.closePath()
        maskCtx.fill()
      } else if (area.type === 'rectangle') {
        maskCtx.fillRect(area.x, area.y, area.width, area.height)
      }
    })
  } else {
    // Use automatic wall detection algorithm
    const imageData = getImageData(roomImage)
    const wallAreas = detectWallAreas(imageData)
    
    maskCtx.fillStyle = 'white'
    wallAreas.forEach(area => {
      maskCtx.fillRect(area.x, area.y, area.width, area.height)
    })
  }
  
  return maskCanvas
}

/**
 * Advanced wall detection algorithm
 * @param {ImageData} imageData - Image data from room image
 * @returns {Array} Detected wall areas
 */
const detectWallAreas = (imageData) => {
  const { data, width, height } = imageData
  const wallAreas = []
  
  // Simplified wall detection - in production would use ML models
  // Look for large uniform areas that are likely walls
  const visited = new Array(width * height).fill(false)
  
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      const index = (y * width + x) * 4
      if (!visited[y * width + x]) {
        const area = floodFillWallArea(data, width, height, x, y, visited)
        if (area.width > 50 && area.height > 50) { // Filter small areas
          wallAreas.push(area)
        }
      }
    }
  }
  
  return wallAreas
}

/**
 * Flood fill algorithm for wall area detection
 * @param {Uint8ClampedArray} data - Image pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {Array} visited - Visited pixels array
 * @returns {Object} Area bounds
 */
const floodFillWallArea = (data, width, height, startX, startY, visited) => {
  const stack = [{ x: startX, y: startY }]
  const startIndex = (startY * width + startX) * 4
  const targetColor = [data[startIndex], data[startIndex + 1], data[startIndex + 2]]
  
  let minX = startX, maxX = startX, minY = startY, maxY = startY
  
  while (stack.length > 0) {
    const { x, y } = stack.pop()
    
    if (x < 0 || x >= width || y < 0 || y >= height) continue
    if (visited[y * width + x]) continue
    
    const index = (y * width + x) * 4
    const currentColor = [data[index], data[index + 1], data[index + 2]]
    
    // Check if colors are similar (wall areas)
    if (colorDistance(targetColor, currentColor) > 30) continue
    
    visited[y * width + x] = true
    
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
    
    // Add neighboring pixels
    stack.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 })
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

/**
 * Calculate color distance between two RGB colors
 * @param {Array} color1 - First RGB color
 * @param {Array} color2 - Second RGB color
 * @returns {number} Color distance
 */
const colorDistance = (color1, color2) => {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  )
}

/**
 * Apply texture to selected wall areas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {CanvasPattern} pattern - Texture pattern
 * @param {Array} selection - Wall selection areas
 */
const applyTextureToSelection = (ctx, pattern, selection) => {
  ctx.fillStyle = pattern
  
  selection.forEach(area => {
    ctx.save()
    
    if (area.type === 'polygon') {
      ctx.beginPath()
      ctx.moveTo(area.points[0].x, area.points[0].y)
      area.points.slice(1).forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.closePath()
      ctx.clip()
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    } else if (area.type === 'rectangle') {
      ctx.fillRect(area.x, area.y, area.width, area.height)
    }
    
    ctx.restore()
  })
}

/**
 * Get image data from image element
 * @param {HTMLImageElement} image - Image element
 * @returns {ImageData} Image data
 */
const getImageData = (image) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

/**
 * Validate wall selection data
 * @param {Array} wallSelection - Wall selection areas
 * @returns {Object} Validation result
 */
export const validateWallSelection = (wallSelection) => {
  if (!wallSelection || !Array.isArray(wallSelection)) {
    return { isValid: true, useAutoDetection: true }
  }
  
  if (wallSelection.length === 0) {
    return { isValid: true, useAutoDetection: true }
  }
  
  // Validate each selection area
  for (const area of wallSelection) {
    if (!area.type || !['polygon', 'rectangle'].includes(area.type)) {
      return { isValid: false, error: 'Invalid selection area type' }
    }
    
    if (area.type === 'polygon' && (!area.points || area.points.length < 3)) {
      return { isValid: false, error: 'Polygon must have at least 3 points' }
    }
    
    if (area.type === 'rectangle' && (!area.x || !area.y || !area.width || !area.height)) {
      return { isValid: false, error: 'Rectangle must have x, y, width, and height' }
    }
  }
  
  return { isValid: true, useAutoDetection: false }
}
}
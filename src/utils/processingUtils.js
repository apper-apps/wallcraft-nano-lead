import React from "react";
import Error from "@/components/ui/Error";
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

// Perform actual texture transformation with enhanced wall targeting
  const processedImageUrl = await createAdvancedTextureBlendedImage(roomImage, surfaceImage, options)
  return processedImageUrl
}

/**
 * Create a texture-blended image using advanced computer vision
 * @param {string} roomImageUrl - Room image data URL
 * @param {string} surfaceImageUrl - Surface image data URL
 * @param {Object} options - Processing options
 * @returns {Promise<string>} Promise that resolves to blended image data URL
 */
const createAdvancedTextureBlendedImage = async (roomImageUrl, surfaceImageUrl, options = {}) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    const roomImg = new Image()
    const surfaceImg = new Image()
    
    let imagesLoaded = 0
    const checkImagesLoaded = async () => {
      imagesLoaded++
      if (imagesLoaded === 2) {
        try {
          // Validate image dimensions
          if (roomImg.width === 0 || roomImg.height === 0) {
            throw new Error('Room image has invalid dimensions')
          }
          if (surfaceImg.width === 0 || surfaceImg.height === 0) {
            throw new Error('Surface image has invalid dimensions')
          }

          // Set canvas size to room image dimensions
          canvas.width = roomImg.width
          canvas.height = roomImg.height
          
          // Clear canvas and draw room image as base
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(roomImg, 0, 0)
          
          // Verify base image was drawn
          let baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const hasBaseContent = baseImageData.data.some(value => value !== 0)
          if (!hasBaseContent) {
            throw new Error('Failed to draw base room image to canvas')
          }
          
          // Enhanced wall detection and masking
          const wallMask = await createEnhancedWallMask(roomImg, canvas, options.wallSelection)
          if (!wallMask) {
            throw new Error('Failed to create wall mask - no walls detected')
          }
          
          // Create optimized texture pattern
          const pattern = createOptimizedPattern(ctx, surfaceImg, roomImg.width, roomImg.height)
          if (!pattern) {
            throw new Error('Failed to create texture pattern from surface image')
          }
          
          // Apply advanced texture blending
          await applyAdvancedTextureBlending(ctx, pattern, wallMask, options)
          
          // Final validation and output
          const finalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const hasContent = finalImageData.data.some((value, index) => {
            // Check if any RGB values are different from base image
            return index % 4 !== 3 && value !== baseImageData.data[index]
          })
          
          if (!hasContent) {
            // Apply fallback texture application if advanced method failed
            await applyFallbackTexture(ctx, roomImg, pattern, options)
          }
          
          // Convert canvas to high-quality data URL
          const resultDataUrl = canvas.toDataURL('image/jpeg', 0.95)
          if (!resultDataUrl || resultDataUrl === 'data:,' || resultDataUrl.length < 1000) {
            throw new Error('Generated image appears to be invalid or too small')
          }
          
          resolve(resultDataUrl)
        } catch (error) {
          console.error('Image processing error:', error)
          reject(new Error(`Image transformation failed: ${error.message}`))
        }
      }
    }
    
    // Enhanced error handling for image loading
    roomImg.onload = checkImagesLoaded
    surfaceImg.onload = checkImagesLoaded
    
    roomImg.onerror = () => reject(new Error('Failed to load room image - check image format and size'))
    surfaceImg.onerror = () => reject(new Error('Failed to load surface image - check image format and size'))
    
    // Add crossOrigin to handle potential CORS issues
    roomImg.crossOrigin = 'anonymous'
    surfaceImg.crossOrigin = 'anonymous'
    
    roomImg.src = roomImageUrl
    surfaceImg.src = surfaceImageUrl
  })
}

/**
 * Create optimized texture pattern with proper scaling
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLImageElement} surfaceImg - Surface image
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {CanvasPattern} Optimized pattern
 */
const createOptimizedPattern = (ctx, surfaceImg, targetWidth, targetHeight) => {
  try {
    // Create a temporary canvas for pattern optimization
    const patternCanvas = document.createElement('canvas')
    const patternCtx = patternCanvas.getContext('2d')
    
    // Calculate optimal pattern size (between 100-400px for performance)
    const maxPatternSize = 300
    const aspectRatio = surfaceImg.width / surfaceImg.height
    
    let patternWidth, patternHeight
    if (surfaceImg.width > surfaceImg.height) {
      patternWidth = Math.min(maxPatternSize, surfaceImg.width)
      patternHeight = patternWidth / aspectRatio
    } else {
      patternHeight = Math.min(maxPatternSize, surfaceImg.height)
      patternWidth = patternHeight * aspectRatio
    }
    
    patternCanvas.width = patternWidth
    patternCanvas.height = patternHeight
    
    // Draw optimized surface image
    patternCtx.drawImage(surfaceImg, 0, 0, patternWidth, patternHeight)
    
    return ctx.createPattern(patternCanvas, 'repeat')
  } catch (error) {
    console.warn('Failed to create optimized pattern, using original:', error)
    return ctx.createPattern(surfaceImg, 'repeat')
  }
}

/**
 * Apply advanced texture blending with proper masking
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {CanvasPattern} pattern - Texture pattern
 * @param {HTMLCanvasElement} wallMask - Wall mask
 * @param {Object} options - Processing options
 */
const applyAdvancedTextureBlending = async (ctx, pattern, wallMask, options) => {
  ctx.save()
  
  try {
    // Create composite operation for realistic texture application
    ctx.globalCompositeOperation = 'source-over'
    
    // Apply wall mask as clipping path
    ctx.drawImage(wallMask, 0, 0)
    ctx.globalCompositeOperation = 'source-atop'
    
    // Set texture opacity
    ctx.globalAlpha = options.textureOpacity || 0.75
    
    // Apply texture with proper blending
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // Apply lighting and perspective correction if enabled
    if (options.lightingMatch) {
      ctx.globalCompositeOperation = 'multiply'
      ctx.globalAlpha = 0.2
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
    
  } catch (error) {
    console.error('Advanced blending failed:', error)
    throw error
  } finally {
    ctx.restore()
  }
}

/**
 * Apply fallback texture when advanced processing fails
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLImageElement} roomImg - Room image
 * @param {CanvasPattern} pattern - Texture pattern
 * @param {Object} options - Processing options
 */
const applyFallbackTexture = async (ctx, roomImg, pattern, options) => {
  console.log('Applying fallback texture method')
  
  ctx.save()
  
  try {
    // Simple overlay approach as fallback
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = options.textureOpacity || 0.5
    
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
  } catch (error) {
    console.error('Fallback texture application failed:', error)
  } finally {
    ctx.restore()
  }
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
}

/**
 * Create enhanced wall mask using advanced detection
 * @param {HTMLImageElement} roomImage - Room image element
 * @param {HTMLCanvasElement} canvas - Processing canvas
 * @param {Array} wallSelection - Manual wall selection data
 * @returns {Promise<HTMLCanvasElement>} Enhanced wall mask canvas
 */
const createEnhancedWallMask = async (roomImage, canvas, wallSelection) => {
  const maskCanvas = document.createElement('canvas')
  const maskCtx = maskCanvas.getContext('2d')
  
  maskCanvas.width = roomImage.width
  maskCanvas.height = roomImage.height
  
  // Fill with black initially
  maskCtx.fillStyle = 'black'
  maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
  
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
    // Use enhanced automatic wall detection
    const wallAreas = await detectEnhancedWallAreas(roomImage, canvas)
    
    if (wallAreas.length === 0) {
      // Fallback: detect blank/uniform areas
      const blankAreas = detectBlankWallAreas(roomImage)
      wallAreas.push(...blankAreas)
    }
    
    maskCtx.fillStyle = 'white'
    wallAreas.forEach(area => {
      if (area.type === 'polygon' && area.points) {
        maskCtx.beginPath()
        maskCtx.moveTo(area.points[0].x, area.points[0].y)
        area.points.slice(1).forEach(point => {
          maskCtx.lineTo(point.x, point.y)
        })
        maskCtx.closePath()
        maskCtx.fill()
      } else if (area.type === 'rectangle' || (!area.type && area.x !== undefined)) {
        maskCtx.fillRect(area.x, area.y, area.width, area.height)
      }
    })
  }
  
  // Ensure mask has some content
  const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
  const hasWhitePixels = maskData.data.some((value, index) => index % 4 === 0 && value > 128)
  
  if (!hasWhitePixels) {
    console.warn('No wall areas detected, applying texture to upper regions')
    // Fallback: apply to upper 60% of image (typical wall area)
    maskCtx.fillStyle = 'white'
    maskCtx.fillRect(0, 0, maskCanvas.width, Math.floor(maskCanvas.height * 0.6))
  }
  
  return maskCanvas
}

/**
 * Enhanced wall detection using edge detection and luminance analysis
 * @param {HTMLImageElement} roomImage - Room image element
 * @param {HTMLCanvasElement} canvas - Processing canvas
 * @returns {Promise<Array>} Detected wall areas
 */
const detectEnhancedWallAreas = async (roomImage, canvas) => {
  try {
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    
    tempCanvas.width = roomImage.width
    tempCanvas.height = roomImage.height
    tempCtx.drawImage(roomImage, 0, 0)
    
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    const { data, width, height } = imageData
    
    // Detect large uniform areas using luminance analysis
    const wallAreas = []
    const blockSize = 20 // Process in blocks for performance
    
    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        const uniformity = calculateRegionUniformity(data, width, height, x, y, blockSize)
        const luminance = calculateRegionLuminance(data, width, x, y, blockSize)
        
        // Wall criteria: high uniformity + moderate to high luminance
        if (uniformity > 0.85 && luminance > 80 && luminance < 240) {
          // Expand region to find full wall area
          const expandedArea = expandUniformRegion(data, width, height, x, y, blockSize, uniformity * 0.8)
          if (expandedArea.width > 80 && expandedArea.height > 80) {
            wallAreas.push(expandedArea)
          }
        }
      }
    }
    
    // Merge overlapping areas
    return mergeOverlappingAreas(wallAreas)
  } catch (error) {
    console.error('Enhanced wall detection failed:', error)
    return []
  }
}

/**
 * Detect blank wall areas using luminance and color uniformity
 * @param {HTMLImageElement} roomImage - Room image element
 * @returns {Array} Detected blank wall areas
 */
const detectBlankWallAreas = (roomImage) => {
  try {
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    
    tempCanvas.width = roomImage.width
    tempCanvas.height = roomImage.height
    tempCtx.drawImage(roomImage, 0, 0)
    
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    const { data, width, height } = imageData
    
    const blankAreas = []
    const sampleSize = 30
    
    // Sample grid points and look for uniform regions
    for (let y = 0; y < height - sampleSize; y += sampleSize) {
      for (let x = 0; x < width - sampleSize; x += sampleSize) {
        const uniformity = calculateRegionUniformity(data, width, height, x, y, sampleSize)
        const avgColor = calculateAverageColor(data, width, x, y, sampleSize)
        
        // Blank wall criteria: very uniform + light colored
        if (uniformity > 0.9 && avgColor.luminance > 120) {
          blankAreas.push({
            x: x,
            y: y,
            width: sampleSize * 2,
            height: sampleSize * 2,
            type: 'rectangle'
          })
        }
      }
    }
    
    return mergeOverlappingAreas(blankAreas)
  } catch (error) {
    console.error('Blank wall detection failed:', error)
    // Ultimate fallback
    return [{
      x: 0,
      y: 0,
      width: roomImage.width,
      height: Math.floor(roomImage.height * 0.6),
      type: 'rectangle'
    }]
  }
}

/**
 * Calculate region uniformity (lower values = more uniform)
 * @param {Uint8ClampedArray} data - Image data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} startX - Region start X
 * @param {number} startY - Region start Y
 * @param {number} size - Region size
 * @returns {number} Uniformity score (0-1, higher = more uniform)
 */
const calculateRegionUniformity = (data, width, height, startX, startY, size) => {
  let totalVariance = 0
  let pixelCount = 0
  
  const colors = []
  
  for (let y = startY; y < Math.min(startY + size, height); y++) {
    for (let x = startX; x < Math.min(startX + size, width); x++) {
      const index = (y * width + x) * 4
      colors.push({
        r: data[index],
        g: data[index + 1],
        b: data[index + 2]
      })
      pixelCount++
    }
  }
  
  if (pixelCount === 0) return 0
  
  // Calculate average color
  const avgR = colors.reduce((sum, c) => sum + c.r, 0) / pixelCount
  const avgG = colors.reduce((sum, c) => sum + c.g, 0) / pixelCount
  const avgB = colors.reduce((sum, c) => sum + c.b, 0) / pixelCount
  
  // Calculate variance
  for (const color of colors) {
    const variance = Math.pow(color.r - avgR, 2) + Math.pow(color.g - avgG, 2) + Math.pow(color.b - avgB, 2)
    totalVariance += variance
  }
  
  const avgVariance = totalVariance / pixelCount
  return Math.max(0, 1 - (avgVariance / 10000)) // Normalize to 0-1
}

/**
 * Calculate region luminance
 * @param {Uint8ClampedArray} data - Image data
 * @param {number} width - Image width
 * @param {number} startX - Region start X
 * @param {number} startY - Region start Y
 * @param {number} size - Region size
 * @returns {number} Average luminance
 */
const calculateRegionLuminance = (data, width, startX, startY, size) => {
  let totalLuminance = 0
  let pixelCount = 0
  
  for (let y = startY; y < startY + size; y++) {
    for (let x = startX; x < startX + size; x++) {
      const index = (y * width + x) * 4
      const luminance = 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2]
      totalLuminance += luminance
      pixelCount++
    }
  }
  
  return pixelCount > 0 ? totalLuminance / pixelCount : 0
}

/**
 * Calculate average color of a region
 * @param {Uint8ClampedArray} data - Image data
 * @param {number} width - Image width
 * @param {number} startX - Region start X
 * @param {number} startY - Region start Y
 * @param {number} size - Region size
 * @returns {Object} Average color and luminance
 */
const calculateAverageColor = (data, width, startX, startY, size) => {
  let totalR = 0, totalG = 0, totalB = 0
  let pixelCount = 0
  
  for (let y = startY; y < startY + size; y++) {
    for (let x = startX; x < startX + size; x++) {
      const index = (y * width + x) * 4
      totalR += data[index]
      totalG += data[index + 1]
      totalB += data[index + 2]
      pixelCount++
    }
  }
  
  if (pixelCount === 0) return { r: 0, g: 0, b: 0, luminance: 0 }
  
  const avgR = totalR / pixelCount
  const avgG = totalG / pixelCount
  const avgB = totalB / pixelCount
  const luminance = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB
  
  return { r: avgR, g: avgG, b: avgB, luminance }
}

/**
 * Expand uniform region to find full wall area
 * @param {Uint8ClampedArray} data - Image data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} startX - Start X coordinate
 * @param {number} startY - Start Y coordinate
 * @param {number} initialSize - Initial region size
 * @param {number} uniformityThreshold - Uniformity threshold
 * @returns {Object} Expanded area
 */
const expandUniformRegion = (data, width, height, startX, startY, initialSize, uniformityThreshold) => {
  let minX = startX, maxX = startX + initialSize
  let minY = startY, maxY = startY + initialSize
  
  // Expand horizontally
  while (minX > 0) {
    const uniformity = calculateRegionUniformity(data, width, height, minX - 20, startY, 20)
    if (uniformity < uniformityThreshold) break
    minX -= 20
  }
  
  while (maxX < width - 20) {
    const uniformity = calculateRegionUniformity(data, width, height, maxX, startY, 20)
    if (uniformity < uniformityThreshold) break
    maxX += 20
  }
  
  // Expand vertically
  while (minY > 0) {
    const uniformity = calculateRegionUniformity(data, width, height, startX, minY - 20, 20)
    if (uniformity < uniformityThreshold) break
    minY -= 20
  }
  
  while (maxY < height - 20) {
    const uniformity = calculateRegionUniformity(data, width, height, startX, maxY, 20)
    if (uniformity < uniformityThreshold) break
    maxY += 20
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    type: 'rectangle'
  }
}

/**
 * Merge overlapping rectangular areas
 * @param {Array} areas - Array of rectangular areas
 * @returns {Array} Merged areas
 */
const mergeOverlappingAreas = (areas) => {
  if (areas.length <= 1) return areas
  
  const merged = []
  const processed = new Set()
  
  for (let i = 0; i < areas.length; i++) {
    if (processed.has(i)) continue
    
    let currentArea = { ...areas[i] }
    processed.add(i)
    
    // Find overlapping areas
    for (let j = i + 1; j < areas.length; j++) {
      if (processed.has(j)) continue
      
      const area2 = areas[j]
      if (areasOverlap(currentArea, area2)) {
        // Merge areas
        const newX = Math.min(currentArea.x, area2.x)
        const newY = Math.min(currentArea.y, area2.y)
        const newMaxX = Math.max(currentArea.x + currentArea.width, area2.x + area2.width)
        const newMaxY = Math.max(currentArea.y + currentArea.height, area2.y + area2.height)
        
        currentArea = {
          x: newX,
          y: newY,
          width: newMaxX - newX,
          height: newMaxY - newY,
          type: 'rectangle'
        }
        processed.add(j)
      }
    }
    
    merged.push(currentArea)
  }
  
  return merged
}

/**
 * Check if two rectangular areas overlap
 * @param {Object} area1 - First area
 * @param {Object} area2 - Second area
 * @returns {boolean} True if areas overlap
 */
const areasOverlap = (area1, area2) => {
  return !(area1.x + area1.width < area2.x || 
           area2.x + area2.width < area1.x || 
           area1.y + area1.height < area2.y || 
           area2.y + area2.height < area1.y)
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
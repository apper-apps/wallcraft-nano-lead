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
      progress: 25 
    },
    { 
      key: 'detecting', 
      label: 'Detecting wall surfaces...', 
      duration: 3000, 
      progress: 50 
    },
    { 
      key: 'mapping', 
      label: 'Mapping surface texture...', 
      duration: 2500, 
      progress: 75 
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

  // Perform actual texture transformation
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
          
          // Create pattern from surface image
          const pattern = ctx.createPattern(surfaceImg, 'repeat')
          
          // Apply texture blend mode for realistic surface application
          ctx.globalCompositeOperation = 'multiply'
          ctx.globalAlpha = 0.7 // Adjustable opacity for texture blend
          
          // Fill with surface pattern
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
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
}
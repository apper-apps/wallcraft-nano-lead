/**
 * Convert a File object to a data URL
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Promise that resolves to the data URL
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Validate if a file is a valid image
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default: 10MB)
 * @returns {Object} Validation result with isValid and error message
 */
export const validateImageFile = (file, maxSize = 10 * 1024 * 1024) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)' 
    }
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / 1024 / 1024)
    return { 
      isValid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    }
  }

  return { isValid: true }
}

/**
 * Get estimated file size for different formats and quality settings
 * @param {number} baseSize - Base file size in MB
 * @param {string} format - File format (png, jpeg, webp)
 * @param {number} quality - Quality percentage (1-100)
 * @returns {string} Formatted file size string
 */
export const getEstimatedFileSize = (baseSize = 2.5, format = 'png', quality = 100) => {
  const formatMultipliers = {
    png: 1.0,
    jpeg: 0.3,
    webp: 0.25
  }
  
  const qualityMultiplier = quality / 100
  const estimatedSize = baseSize * formatMultipliers[format] * qualityMultiplier
  
  return estimatedSize > 1 
    ? `${estimatedSize.toFixed(1)} MB` 
    : `${(estimatedSize * 1024).toFixed(0)} KB`
}

/**
 * Download a blob or data URL as a file
 * @param {string|Blob} data - Data URL or Blob to download
 * @param {string} filename - Name for the downloaded file
 */
export const downloadFile = (data, filename) => {
  const link = document.createElement('a')
  
  if (typeof data === 'string') {
    link.href = data
  } else {
    link.href = URL.createObjectURL(data)
  }
  
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  if (typeof data !== 'string') {
    URL.revokeObjectURL(link.href)
  }
}

/**
 * Create a thumbnail from an image file
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum thumbnail width
 * @param {number} maxHeight - Maximum thumbnail height
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<string>} Promise that resolves to thumbnail data URL
 */
export const createThumbnail = (file, maxWidth = 300, maxHeight = 300, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and convert to data URL
      ctx.drawImage(img, 0, 0, width, height)
      const dataURL = canvas.toDataURL('image/jpeg', quality)
      resolve(dataURL)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Get image dimensions from a file
 * @param {File} file - Image file
 * @returns {Promise<Object>} Promise that resolves to {width, height}
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
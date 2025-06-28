import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const ExportPanel = ({ 
  processedImage, 
  onExport,
  className = '',
  ...props 
}) => {
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState(95)
  const [isExporting, setIsExporting] = useState(false)

  const formats = [
    { value: 'png', label: 'PNG', description: 'Best quality, larger file' },
    { value: 'jpeg', label: 'JPEG', description: 'Smaller file, good quality' },
    { value: 'webp', label: 'WebP', description: 'Modern format, best compression' }
  ]

  const handleExport = async () => {
    if (!processedImage) {
      toast.error('No processed image to export')
      return
    }

    setIsExporting(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create download link
      const link = document.createElement('a')
      link.href = processedImage
      link.download = `wallcraft-transformation.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Image exported successfully!')
      onExport?.({ format, quality })
    } catch (error) {
      toast.error('Failed to export image')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    if (!processedImage) {
      toast.error('No processed image to share')
      return
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'WallCraft Transformation',
          text: 'Check out my room transformation!',
          url: processedImage
        })
        toast.success('Shared successfully!')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      toast.error('Failed to share')
    }
  }

  const getEstimatedSize = () => {
    if (!processedImage) return '0 KB'
    
    const baseSize = 2.5 // MB
    const formatMultiplier = {
      png: 1.0,
      jpeg: 0.3,
      webp: 0.25
    }
    const qualityMultiplier = quality / 100
    
    const estimatedSize = baseSize * formatMultiplier[format] * qualityMultiplier
    return estimatedSize > 1 ? `${estimatedSize.toFixed(1)} MB` : `${(estimatedSize * 1024).toFixed(0)} KB`
  }

  return (
    <Card 
      className={className}
      padding="lg"
      gradient={true}
      {...props}
    >
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-midnight-700 font-display mb-2">
            Export Your Transformation
          </h3>
          <p className="text-midnight-600">
            Download or share your transformed space
          </p>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-midnight-700">
            Export Format
          </label>
          <div className="grid grid-cols-1 gap-2">
            {formats.map((fmt) => (
              <motion.div
                key={fmt.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${format === fmt.value 
                    ? 'border-bright-500 bg-bright-50' 
                    : 'border-cloud-300 hover:border-bright-300'
                  }
                `}
                onClick={() => setFormat(fmt.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-midnight-700">{fmt.label}</div>
                    <div className="text-sm text-midnight-500">{fmt.description}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-midnight-600">
                      ~{getEstimatedSize()}
                    </span>
                    {format === fmt.value && (
                      <ApperIcon name="Check" className="w-5 h-5 text-bright-600" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quality Slider */}
        {(format === 'jpeg' || format === 'webp') && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-midnight-700">
              Quality: {quality}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="50"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-cloud-300 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3498DB 0%, #3498DB ${quality}%, #ECF0F1 ${quality}%, #ECF0F1 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-midnight-500">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleExport}
            disabled={!processedImage || isExporting}
            loading={isExporting}
            size="lg"
            icon="Download"
            className="w-full"
          >
            Download Image
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              disabled={!processedImage}
              variant="outline"
              icon="Share2"
              className="w-full"
            >
              Share
            </Button>
            <Button
              onClick={() => window.print()}
              disabled={!processedImage}
              variant="ghost"
              icon="Printer"
              className="w-full"
            >
              Print
            </Button>
          </div>
        </div>

        {/* File Info */}
        {processedImage && (
          <div className="border-t border-cloud-300 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-midnight-600">Estimated file size:</span>
              <span className="font-medium text-midnight-700">{getEstimatedSize()}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ExportPanel
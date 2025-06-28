import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import UploadZone from '@/components/molecules/UploadZone'
import ImageCanvas from '@/components/molecules/ImageCanvas'
import SplitPreview from '@/components/molecules/SplitPreview'
import ProcessingPanel from '@/components/molecules/ProcessingPanel'
import ExportPanel from '@/components/molecules/ExportPanel'
import Card from '@/components/atoms/Card'
import { processImages } from '@/utils/processingUtils'

const MainWorkspace = () => {
  const [roomImage, setRoomImage] = useState(null)
  const [surfaceImage, setSurfaceImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
const [processingStage, setProcessingStage] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [wallSelection, setWallSelection] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)

  const handleFileToDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }

  const handleRoomImageSelect = useCallback(async (file) => {
    const dataURL = await handleFileToDataURL(file)
    setRoomImage(dataURL)
    // Reset processed image when new room image is uploaded
    setProcessedImage(null)
  }, [])

  const handleSurfaceImageSelect = useCallback(async (file) => {
    const dataURL = await handleFileToDataURL(file)
    setSurfaceImage(dataURL)
    // Reset processed image when new surface image is uploaded
    setProcessedImage(null)
  }, [])

const handleProcess = async () => {
    if (!roomImage || !surfaceImage) {
      toast.error('Please upload both room and surface images')
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    
    try {
      // Use actual image processing with wall selection data
      const processingOptions = {
        wallSelection: wallSelection.length > 0 ? wallSelection : null,
        textureOpacity: 0.7,
        lightingMatch: true,
        perspectiveCorrection: true
      }
      
      const result = await processImages(
        roomImage, 
        surfaceImage, 
        processingOptions, 
        setProcessingProgress, 
        setProcessingStage
      )
      
      setProcessedImage(result)
      toast.success('Transformation completed successfully!')
    } catch (error) {
      console.error('Processing error:', error)
      toast.error('Processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
      setProcessingStage('')
      setProcessingProgress(0)
    }
  }

  const handleCancelProcessing = () => {
    setIsProcessing(false)
    setProcessingStage('')
    setProcessingProgress(0)
    toast.info('Processing cancelled')
  }

  const canProcess = roomImage && surfaceImage && !isProcessing

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
      {/* Left Panel - Inputs and Controls */}
      <div className="w-full lg:w-80 xl:w-96 space-y-6 overflow-y-auto">
        {/* Upload Section */}
        <div className="space-y-4">
          <UploadZone
            title="Room Image"
            description="Upload your interior space photo"
            icon="Home"
            onFileSelect={handleRoomImageSelect}
            preview={roomImage}
          />
          
          <UploadZone
            title="Surface Sample"
            description="Upload your desired wall texture or pattern"
            icon="Palette"
            onFileSelect={handleSurfaceImageSelect}
            preview={surfaceImage}
          />
        </div>

        {/* Processing Controls */}
        <ProcessingPanel
          isProcessing={isProcessing}
          progress={processingProgress}
          stage={processingStage}
          onProcess={handleProcess}
          onCancel={handleCancelProcessing}
          disabled={!canProcess}
        />

        {/* Export Panel */}
        {processedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExportPanel
              processedImage={processedImage}
              onExport={(options) => {
                console.log('Export options:', options)
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Right Panel - Preview Area */}
      <div className="flex-1 space-y-6 overflow-hidden">
        {/* Main Preview */}
        {processedImage ? (
          <SplitPreview
            originalImage={roomImage}
            processedImage={processedImage}
            className="flex-1"
          />
        ) : (
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
            <ImageCanvas
              image={roomImage}
              title="Room Preview"
              className="h-full min-h-[400px]"
              selectionMode={selectionMode}
              wallSelection={wallSelection}
              onWallSelectionChange={setWallSelection}
              onSelectionModeChange={setSelectionMode}
            />
            <ImageCanvas
              image={surfaceImage}
              title="Surface Preview"
              className="h-full min-h-[400px]"
            />
          </div>
        )}

        {/* Instructions Card */}
        {!roomImage && !surfaceImage && (
          <Card className="text-center py-12" gradient={true}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-bright-100 to-carrot-100 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-bright-500 to-carrot-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-midnight-700 font-display">
                  Welcome to <span className="gradient-text">WallCraft</span>
                </h3>
                <p className="text-midnight-600">
                  Transform your interior spaces with AI-powered wall surface replacement. 
                  Upload your room photo and desired surface pattern to get started.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-bright-100 rounded-full flex items-center justify-center">
                    <span className="text-bright-600 font-bold">1</span>
                  </div>
                  <p className="text-sm text-midnight-600">Upload room image</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-carrot-100 rounded-full flex items-center justify-center">
                    <span className="text-carrot-600 font-bold">2</span>
                  </div>
                  <p className="text-sm text-midnight-600">Choose surface pattern</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <p className="text-sm text-midnight-600">Transform & export</p>
                </div>
              </div>
            </motion.div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default MainWorkspace
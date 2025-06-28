import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ProgressBar from '@/components/atoms/ProgressBar'
import Card from '@/components/atoms/Card'

const ProcessingPanel = ({ 
  isProcessing = false,
  progress = 0,
  stage = '',
  onProcess,
  onCancel,
  disabled = false,
  className = '',
  ...props 
}) => {
  const stages = [
    { key: 'analyzing', label: 'Analyzing room image...', icon: 'Search' },
    { key: 'detecting', label: 'Detecting wall surfaces...', icon: 'Scan' },
    { key: 'mapping', label: 'Mapping surface texture...', icon: 'Map' },
    { key: 'rendering', label: 'Rendering final image...', icon: 'Palette' },
    { key: 'complete', label: 'Processing complete!', icon: 'CheckCircle' }
  ]

  const currentStage = stages.find(s => s.key === stage) || stages[0]

  return (
    <Card 
      className={`${className}`}
      padding="lg"
      gradient={true}
      {...props}
    >
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-midnight-700 font-display mb-2">
            Transform Your Space
          </h3>
          <p className="text-midnight-600">
            Apply your chosen surface to the detected walls
          </p>
        </div>

        {!isProcessing ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Button
              onClick={onProcess}
              disabled={disabled}
              size="lg"
              icon="Wand2"
              className="w-full"
            >
              Start Transformation
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-midnight-500">
                Processing typically takes 10-30 seconds
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-gradient-to-r from-bright-500 to-carrot-500 rounded-full flex items-center justify-center"
              >
                <ApperIcon 
                  name={currentStage.icon} 
                  className="w-4 h-4 text-white" 
                />
              </motion.div>
              <span className="text-lg font-medium text-midnight-700">
                {currentStage.label}
              </span>
            </div>

            <ProgressBar
              value={progress}
              variant="primary"
              size="lg"
              showValue={true}
              className="w-full"
            />

            <div className="flex justify-center">
              <Button
                onClick={onCancel}
                variant="ghost"
                size="sm"
                icon="X"
              >
                Cancel Processing
              </Button>
            </div>
          </motion.div>
        )}

        <div className="border-t border-cloud-300 pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-bright-600 font-display">
                AI-Powered
              </div>
              <div className="text-sm text-midnight-600">
                Wall Detection
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-carrot-600 font-display">
                Realistic
              </div>
              <div className="text-sm text-midnight-600">
                Lighting Match
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProcessingPanel
import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import IconButton from '@/components/atoms/IconButton'

const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-lg border-b border-cloud-300 shadow-sm sticky top-0 z-50"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-bright-500 to-carrot-500 rounded-xl flex items-center justify-center shadow-card">
              <ApperIcon name="Palette" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-midnight-700 font-display">
                Wall<span className="gradient-text">Craft</span>
              </h1>
              <p className="text-sm text-midnight-500">
                AI-Powered Interior Transformation
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            <IconButton
              icon="HelpCircle"
              variant="ghost"
              tooltip="Help & Tutorial"
              onClick={() => {
                // Could open a help modal or tutorial
                console.log('Help clicked')
              }}
            />
            <IconButton
              icon="Settings"
              variant="ghost"
              tooltip="Settings"
              onClick={() => {
                // Could open settings panel
                console.log('Settings clicked')
              }}
            />
            <div className="hidden sm:flex items-center space-x-2 ml-4 pl-4 border-l border-cloud-300">
              <div className="text-right">
                <p className="text-sm font-medium text-midnight-700">Pro Version</p>
                <p className="text-xs text-midnight-500">Unlimited transformations</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Crown" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar for Processing */}
      <div className="h-1 bg-cloud-200">
        <motion.div
          className="h-full bg-gradient-to-r from-bright-500 to-carrot-500"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </motion.header>
  )
}

export default Header
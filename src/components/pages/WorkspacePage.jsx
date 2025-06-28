import React from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import MainWorkspace from '@/components/organisms/MainWorkspace'

const WorkspacePage = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-cloud-100">
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 overflow-hidden"
      >
        <MainWorkspace />
      </motion.main>
    </div>
  )
}

export default WorkspacePage
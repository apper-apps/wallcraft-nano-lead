import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import WorkspacePage from '@/components/pages/WorkspacePage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cloud-200">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-screen overflow-hidden"
      >
        <Routes>
          <Route path="/" element={<WorkspacePage />} />
        </Routes>
      </motion.div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import projectService from '@/services/api/projectService'

export const useProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData) => {
    setError(null)
    try {
      const newProject = await projectService.create(projectData)
      setProjects(prev => [...prev, newProject])
      return newProject
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateProject = async (id, projectData) => {
    setError(null)
    try {
      const updatedProject = await projectService.update(id, projectData)
      setProjects(prev => prev.map(p => p.Id === parseInt(id) ? updatedProject : p))
      return updatedProject
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteProject = async (id) => {
    setError(null)
    try {
      await projectService.delete(id)
      setProjects(prev => prev.filter(p => p.Id !== parseInt(id)))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject
  }
}
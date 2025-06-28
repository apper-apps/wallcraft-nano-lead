import mockProjects from '@/services/mockData/projects.json'

class ProjectService {
  constructor() {
    this.projects = [...mockProjects]
    this.delay = 300 // Realistic loading delay
  }

  async getAll() {
    await this.simulateDelay()
    return [...this.projects]
  }

  async getById(id) {
    await this.simulateDelay()
    const project = this.projects.find(p => p.Id === parseInt(id))
    if (!project) {
      throw new Error(`Project with Id ${id} not found`)
    }
    return { ...project }
  }

  async create(projectData) {
    await this.simulateDelay()
    const newId = this.getNextId()
    const newProject = {
      Id: newId,
      timestamp: new Date().toISOString(),
      ...projectData
    }
    this.projects.push(newProject)
    return { ...newProject }
  }

  async update(id, projectData) {
    await this.simulateDelay()
    const index = this.projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Project with Id ${id} not found`)
    }
    this.projects[index] = { ...this.projects[index], ...projectData }
    return { ...this.projects[index] }
  }

  async delete(id) {
    await this.simulateDelay()
    const index = this.projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Project with Id ${id} not found`)
    }
    const deletedProject = this.projects.splice(index, 1)[0]
    return { ...deletedProject }
  }

  getNextId() {
    return this.projects.length > 0 
      ? Math.max(...this.projects.map(p => p.Id)) + 1 
      : 1
  }

  async simulateDelay() {
    await new Promise(resolve => setTimeout(resolve, this.delay))
  }
}

export default new ProjectService()
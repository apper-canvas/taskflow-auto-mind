import projectData from '../mockData/projects.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let projects = [...projectData]

export const getAll = async () => {
  await delay(250)
  return [...projects]
}

export const getById = async (id) => {
  await delay(200)
  const project = projects.find(p => p.id === id)
  if (!project) throw new Error('Project not found')
  return { ...project }
}

export const create = async (projectData) => {
  await delay(350)
  const newProject = {
    ...projectData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  projects.unshift(newProject)
  return { ...newProject }
}

export const update = async (id, updates) => {
  await delay(300)
  const index = projects.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Project not found')
  
  projects[index] = { ...projects[index], ...updates }
  return { ...projects[index] }
}

export const delete_ = async (id) => {
  await delay(250)
  const index = projects.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Project not found')
  
  projects.splice(index, 1)
  return true
}

export { delete_ as delete }
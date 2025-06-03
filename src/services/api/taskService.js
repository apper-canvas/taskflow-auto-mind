import taskData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...taskData]

export const getAll = async () => {
  await delay(300)
  return [...tasks]
}

export const getById = async (id) => {
  await delay(200)
  const task = tasks.find(t => t.id === id)
  if (!task) throw new Error('Task not found')
  return { ...task }
}

export const create = async (taskData) => {
  await delay(400)
  const newTask = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  tasks.unshift(newTask)
  return { ...newTask }
}

export const update = async (id, updates) => {
  await delay(350)
  const index = tasks.findIndex(t => t.id === id)
  if (index === -1) throw new Error('Task not found')
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  return { ...tasks[index] }
}

export const delete_ = async (id) => {
  await delay(250)
  const index = tasks.findIndex(t => t.id === id)
  if (index === -1) throw new Error('Task not found')
  
  tasks.splice(index, 1)
  return true
}

// Use named export to avoid reserved keyword issue
export { delete_ as delete }
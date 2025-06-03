import categoryData from '../mockData/categories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let categories = [...categoryData]

export const getAll = async () => {
  await delay(200)
  return [...categories]
}

export const getById = async (id) => {
  await delay(150)
  const category = categories.find(c => c.id === id)
  if (!category) throw new Error('Category not found')
  return { ...category }
}

export const create = async (categoryData) => {
  await delay(300)
  const newCategory = {
    ...categoryData,
    id: Date.now().toString()
  }
  categories.unshift(newCategory)
  return { ...newCategory }
}

export const update = async (id, updates) => {
  await delay(250)
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Category not found')
  
  categories[index] = { ...categories[index], ...updates }
  return { ...categories[index] }
}

export const delete_ = async (id) => {
  await delay(200)
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Category not found')
  
  categories.splice(index, 1)
  return true
}

export { delete_ as delete }
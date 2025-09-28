export class MenuItem {
  id!: string
  name!: string
  parentId?: string | null
  menuId!: string
  order!: number
  depth!: number
  path!: string
  hasChildren!: boolean
  isActive!: boolean
  createdAt!: Date
  updatedAt!: Date
  
  // Relations (optional for response mapping)
  children?: MenuItem[]
  parent?: MenuItem | null
}
export class MenuItemResponseDto {
  id!: string
  name!: string
  parentId?: string
  menuId!: string
  order!: number
  depth!: number
  path!: string
  hasChildren!: boolean
  isActive!: boolean
  createdAt!: Date
  updatedAt!: Date
  children?: MenuItemResponseDto[]
}
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateMenuItemDto, UpdateMenuItemDto, MoveMenuItemDto } from './dto'
import { MenuItem } from './entities/menu-item.entity'

@Injectable()
export class MenuItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const { name, parentId, menuId, isActive = true } = createMenuItemDto

    // Verify menu exists
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId }
    })
    if (!menu) {
      throw new NotFoundException('Menu not found')
    }

    // Verify parent exists if parentId is provided
    let parent = null
    let depth = 0
    let path = ''
    
    if (parentId) {
      parent = await this.prisma.menuItem.findUnique({
        where: { id: parentId }
      })
      if (!parent) {
        throw new NotFoundException('Parent menu item not found')
      }
      if (parent.menuId !== menuId) {
        throw new BadRequestException('Parent item must belong to the same menu')
      }
      depth = parent.depth + 1
      path = parent.path ? `${parent.path}.${parent.order}` : `${parent.order}`
    }

    // Check for duplicate names at the same level
    const existingItem = await this.prisma.menuItem.findFirst({
      where: {
        name,
        menuId,
        parentId: parentId || null
      }
    })
    if (existingItem) {
      throw new ConflictException('Menu item with this name already exists at this level')
    }

    // Get next order number for this level
    const maxOrder = await this.prisma.menuItem.aggregate({
      where: {
        menuId,
        parentId: parentId || null
      },
      _max: {
        order: true
      }
    })
    const order = (maxOrder._max?.order || 0) + 1

    // Update path with current order
    if (parentId && parent) {
      path = parent.path ? `${parent.path}.${order}` : `${order}`
    } else {
      path = `${order}`
    }

    // Create the menu item
    const menuItem = await this.prisma.menuItem.create({
      data: {
        name,
        parentId,
        menuId,
        order,
        depth,
        path,
        isActive,
        hasChildren: false
      }
    })

    // Update parent's hasChildren flag if this is a child item
    if (parentId) {
      await this.prisma.menuItem.update({
        where: { id: parentId },
        data: { hasChildren: true }
      })
    }

    return menuItem
  }

  async findAll(menuId: string, includeChildren = false): Promise<MenuItem[]> {
    const whereClause = {
      menuId,
      isActive: true
    }

    if (includeChildren) {
      return this.prisma.menuItem.findMany({
        where: whereClause,
        include: {
          children: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      })
    }

    return this.prisma.menuItem.findMany({
      where: whereClause,
      orderBy: { order: 'asc' }
    })
  }

  async findRootItems(menuId: string): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: {
        menuId,
        parentId: null,
        isActive: true
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })
  }

  async findByDepth(menuId: string, depth: number): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: {
        menuId,
        depth,
        isActive: true
      },
      orderBy: { order: 'asc' }
    })
  }

  async findOne(id: string, includeChildren = false): Promise<MenuItem> {
    const includeClause = includeChildren ? {
      children: {
        where: { isActive: true },
        orderBy: { order: 'asc' as const }
      },
      parent: true
    } : {}

    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: includeClause
    })

    if (!menuItem) {
      throw new NotFoundException('Menu item not found')
    }

    return menuItem
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    const existingItem = await this.findOne(id)
    const { name, parentId, isActive } = updateMenuItemDto

    // Check for duplicate names at the same level (excluding current item)
    if (name) {
      const duplicateItem = await this.prisma.menuItem.findFirst({
        where: {
          name,
          menuId: existingItem.menuId,
          parentId: parentId !== undefined ? parentId : existingItem.parentId,
          id: { not: id }
        }
      })
      if (duplicateItem) {
        throw new ConflictException('Menu item with this name already exists at this level')
      }
    }

    // If parentId is being changed, handle hierarchy updates
    if (parentId !== undefined && parentId !== existingItem.parentId) {
      return this.moveItem(id, { targetParentId: parentId })
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(isActive !== undefined && { isActive })
      }
    })
  }

  async moveItem(id: string, moveDto: MoveMenuItemDto): Promise<MenuItem> {
    const { targetParentId, newOrder } = moveDto
    const item = await this.findOne(id)

    // Prevent moving item to be its own child
    if (targetParentId === id) {
      throw new BadRequestException('Cannot move item to be its own child')
    }

    // Verify target parent exists and belongs to same menu
    let targetParent = null
    let newDepth = 0
    let newPath = ''

    if (targetParentId) {
      targetParent = await this.prisma.menuItem.findUnique({
        where: { id: targetParentId }
      })
      if (!targetParent) {
        throw new NotFoundException('Target parent not found')
      }
      if (targetParent.menuId !== item.menuId) {
        throw new BadRequestException('Target parent must belong to the same menu')
      }
      
      // Prevent circular references
      if (targetParent.path.startsWith(item.path)) {
        throw new BadRequestException('Cannot move item to its own descendant')
      }

      newDepth = targetParent.depth + 1
    }

    // Calculate new order if not provided
    let finalOrder = newOrder
    if (finalOrder === undefined) {
      const maxOrder = await this.prisma.menuItem.aggregate({
        where: {
          menuId: item.menuId,
          parentId: targetParentId || null
        },
        _max: { order: true }
      })
      finalOrder = (maxOrder._max?.order || 0) + 1
    }

    // Calculate new path
    if (targetParentId && targetParent) {
      newPath = targetParent.path ? `${targetParent.path}.${finalOrder}` : `${finalOrder}`
    } else {
      newPath = `${finalOrder}`
    }

    // Update the item and all its descendants
    await this.updateItemHierarchy(id, targetParentId ?? null, finalOrder, newDepth, newPath)

    // Update old parent's hasChildren flag
    if (item.parentId) {
      await this.updateParentHasChildren(item.parentId)
    }

    // Update new parent's hasChildren flag
    if (targetParentId) {
      await this.prisma.menuItem.update({
        where: { id: targetParentId },
        data: { hasChildren: true }
      })
    }

    return this.findOne(id)
  }

  private async updateItemHierarchy(
    itemId: string,
    newParentId: string | null,
    newOrder: number,
    newDepth: number,
    newPath: string
  ): Promise<void> {
    // Get all descendants
    const descendants = await this.prisma.menuItem.findMany({
      where: {
        path: { startsWith: newPath }
      }
    })

    // Update the main item
    await this.prisma.menuItem.update({
      where: { id: itemId },
      data: {
        parentId: newParentId,
        order: newOrder,
        depth: newDepth,
        path: newPath
      }
    })

    // Update all descendants' depth and path
    for (const descendant of descendants) {
      if (descendant.id !== itemId) {
        const depthDiff = newDepth - descendant.depth
        const newDescendantDepth = descendant.depth + depthDiff
        const newDescendantPath = descendant.path.replace(
          descendant.path.split('.')[0],
          newPath
        )

        await this.prisma.menuItem.update({
          where: { id: descendant.id },
          data: {
            depth: newDescendantDepth,
            path: newDescendantPath
          }
        })
      }
    }
  }

  private async updateParentHasChildren(parentId: string): Promise<void> {
    const childrenCount = await this.prisma.menuItem.count({
      where: {
        parentId,
        isActive: true
      }
    })

    await this.prisma.menuItem.update({
      where: { id: parentId },
      data: { hasChildren: childrenCount > 0 }
    })
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id)

    // Get all descendants for cascade delete
    const descendants = await this.prisma.menuItem.findMany({
      where: {
        path: { startsWith: item.path },
        id: { not: id }
      }
    })

    // Delete all descendants first
    if (descendants.length > 0) {
      await this.prisma.menuItem.deleteMany({
        where: {
          id: { in: descendants.map(d => d.id) }
        }
      })
    }

    // Delete the main item
    await this.prisma.menuItem.delete({
      where: { id }
    })

    // Update parent's hasChildren flag
    if (item.parentId) {
      await this.updateParentHasChildren(item.parentId)
    }
  }

  async getAncestors(id: string): Promise<MenuItem[]> {
    const item = await this.findOne(id)
    const pathParts = item.path.split('.')
    const ancestors: MenuItem[] = []

    let currentPath = ''
    for (let i = 0; i < pathParts.length - 1; i++) {
      currentPath = currentPath ? `${currentPath}.${pathParts[i]}` : pathParts[i]
      const ancestor = await this.prisma.menuItem.findFirst({
        where: {
          path: currentPath,
          menuId: item.menuId
        }
      })
      if (ancestor) {
        ancestors.push(ancestor)
      }
    }

    return ancestors
  }

  async getDescendants(id: string): Promise<MenuItem[]> {
    const item = await this.findOne(id)
    
    return this.prisma.menuItem.findMany({
      where: {
        path: { startsWith: `${item.path}.` },
        isActive: true
      },
      orderBy: { path: 'asc' }
    })
  }

  async getSiblings(id: string): Promise<MenuItem[]> {
    const item = await this.findOne(id)
    
    return this.prisma.menuItem.findMany({
      where: {
        parentId: item.parentId,
        menuId: item.menuId,
        id: { not: id },
        isActive: true
      },
      orderBy: { order: 'asc' }
    })
  }
}
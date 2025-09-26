import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateMenuDto, UpdateMenuDto, MenuResponseDto } from './dto'
import { Menu } from './entities/menu.entity'

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    try {
      // Check if menu with same name already exists
      const existingMenu = await this.prisma.menu.findFirst({
        where: { name: createMenuDto.name }
      })

      if (existingMenu) {
        throw new ConflictException(`Menu with name '${createMenuDto.name}' already exists`)
      }

      const menu = await this.prisma.menu.create({
        data: {
          name: createMenuDto.name,
          isActive: createMenuDto.isActive ?? true
        }
      })

      return this.mapToResponseDto(menu)
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new BadRequestException('Failed to create menu')
    }
  }

  async findAll(isActive?: boolean): Promise<MenuResponseDto[]> {
    try {
      const menus = await this.prisma.menu.findMany({
        where: isActive !== undefined ? { isActive } : undefined,
        orderBy: { createdAt: 'desc' }
      })

      return menus.map(menu => this.mapToResponseDto(menu))
    } catch (error) {
      throw new BadRequestException('Failed to fetch menus')
    }
  }

  async findOne(id: string): Promise<MenuResponseDto> {
    try {
      const menu = await this.prisma.menu.findUnique({
        where: { id }
      })

      if (!menu) {
        throw new NotFoundException(`Menu with ID '${id}' not found`)
      }

      return this.mapToResponseDto(menu)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('Failed to fetch menu')
    }
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<MenuResponseDto> {
    try {
      // Check if menu exists
      const existingMenu = await this.prisma.menu.findUnique({
        where: { id }
      })

      if (!existingMenu) {
        throw new NotFoundException(`Menu with ID '${id}' not found`)
      }

      // Check if name is being updated and if it conflicts with another menu
      if (updateMenuDto.name && updateMenuDto.name !== existingMenu.name) {
        const nameConflict = await this.prisma.menu.findFirst({
          where: { 
            name: updateMenuDto.name,
            id: { not: id }
          }
        })

        if (nameConflict) {
          throw new ConflictException(`Menu with name '${updateMenuDto.name}' already exists`)
        }
      }

      const updatedMenu = await this.prisma.menu.update({
        where: { id },
        data: {
          ...(updateMenuDto.name && { name: updateMenuDto.name }),
          ...(updateMenuDto.isActive !== undefined && { isActive: updateMenuDto.isActive })
        }
      })

      return this.mapToResponseDto(updatedMenu)
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new BadRequestException('Failed to update menu')
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const existingMenu = await this.prisma.menu.findUnique({
        where: { id },
        include: { menuItems: true }
      })

      if (!existingMenu) {
        throw new NotFoundException(`Menu with ID '${id}' not found`)
      }

      // Check if menu has associated menu items
      if (existingMenu.menuItems.length > 0) {
        throw new ConflictException('Cannot delete menu that contains menu items. Delete menu items first.')
      }

      await this.prisma.menu.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new BadRequestException('Failed to delete menu')
    }
  }

  async toggleActive(id: string): Promise<MenuResponseDto> {
    try {
      const existingMenu = await this.prisma.menu.findUnique({
        where: { id }
      })

      if (!existingMenu) {
        throw new NotFoundException(`Menu with ID '${id}' not found`)
      }

      const updatedMenu = await this.prisma.menu.update({
        where: { id },
        data: { isActive: !existingMenu.isActive }
      })

      return this.mapToResponseDto(updatedMenu)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('Failed to toggle menu status')
    }
  }

  private mapToResponseDto(menu: any): MenuResponseDto {
    const responseDto = new MenuResponseDto()
    responseDto.id = menu.id
    responseDto.name = menu.name
    responseDto.isActive = menu.isActive
    responseDto.createdAt = menu.createdAt
    responseDto.updatedAt = menu.updatedAt
    return responseDto
  }
}
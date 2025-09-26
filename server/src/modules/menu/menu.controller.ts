import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto, UpdateMenuDto, MenuResponseDto } from './dto'

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMenuDto: CreateMenuDto): Promise<{
    data: MenuResponseDto
    message: string
    error: null
  }> {
    const menu = await this.menuService.create(createMenuDto)
    return {
      data: menu,
      message: 'Menu created successfully',
      error: null
    }
  }

  @Get()
  async findAll(@Query('isActive') isActive?: string): Promise<{
    data: MenuResponseDto[]
    message: string
    error: null
  }> {
    const isActiveFilter = isActive !== undefined ? isActive === 'true' : undefined
    const menus = await this.menuService.findAll(isActiveFilter)
    return {
      data: menus,
      message: 'Menus retrieved successfully',
      error: null
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{
    data: MenuResponseDto
    message: string
    error: null
  }> {
    const menu = await this.menuService.findOne(id)
    return {
      data: menu,
      message: 'Menu retrieved successfully',
      error: null
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto
  ): Promise<{
    data: MenuResponseDto
    message: string
    error: null
  }> {
    const menu = await this.menuService.update(id, updateMenuDto)
    return {
      data: menu,
      message: 'Menu updated successfully',
      error: null
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.menuService.remove(id)
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string): Promise<{
    data: MenuResponseDto
    message: string
    error: null
  }> {
    const menu = await this.menuService.toggleActive(id)
    return {
      data: menu,
      message: 'Menu status toggled successfully',
      error: null
    }
  }
}
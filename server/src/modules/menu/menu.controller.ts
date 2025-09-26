import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpCode, 
  HttpStatus
} from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto, UpdateMenuDto, MenuResponseDto } from './dto'

@Controller('api/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    return await this.menuService.create(createMenuDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('isActive') isActive?: string): Promise<MenuResponseDto[]> {
    const isActiveBoolean = isActive === 'true' ? true : isActive === 'false' ? false : undefined
    return await this.menuService.findAll(isActiveBoolean)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<MenuResponseDto> {
    return await this.menuService.findOne(id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string, 
    @Body() updateMenuDto: UpdateMenuDto
  ): Promise<MenuResponseDto> {
    return await this.menuService.update(id, updateMenuDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.menuService.remove(id)
    return { message: 'Menu deleted successfully' }
  }

  @Patch(':id/toggle-active')
  @HttpCode(HttpStatus.OK)
  async toggleActive(@Param('id') id: string): Promise<MenuResponseDto> {
    return await this.menuService.toggleActive(id)
  }
}
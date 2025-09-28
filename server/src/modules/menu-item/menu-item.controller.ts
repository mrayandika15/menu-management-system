import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { MenuItemService } from './menu-item.service'
import { CreateMenuItemDto, UpdateMenuItemDto, MoveMenuItemDto } from './dto'

@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto)
  }

  @Get('menu/:menuId')
  async findAllByMenu(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Query('includeChildren') includeChildren?: string
  ) {
    const includeChildrenBool = includeChildren === 'true'
    return this.menuItemService.findAll(menuId, includeChildrenBool)
  }

  @Get('menu/:menuId/root')
  async findRootItems(@Param('menuId', ParseUUIDPipe) menuId: string) {
    return this.menuItemService.findRootItems(menuId)
  }

  @Get('menu/:menuId/depth/:depth')
  async findByDepth(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Param('depth') depth: string
  ) {
    const depthNumber = parseInt(depth, 10)
    if (isNaN(depthNumber) || depthNumber < 0) {
      throw new Error('Depth must be a non-negative number')
    }
    return this.menuItemService.findByDepth(menuId, depthNumber)
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeChildren') includeChildren?: string
  ) {
    const includeChildrenBool = includeChildren === 'true'
    return this.menuItemService.findOne(id, includeChildrenBool)
  }

  @Get(':id/ancestors')
  async getAncestors(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuItemService.getAncestors(id)
  }

  @Get(':id/descendants')
  async getDescendants(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuItemService.getDescendants(id)
  }

  @Get(':id/siblings')
  async getSiblings(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuItemService.getSiblings(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto
  ) {
    return this.menuItemService.update(id, updateMenuItemDto)
  }

  @Patch(':id/move')
  async moveItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() moveMenuItemDto: MoveMenuItemDto
  ) {
    return this.menuItemService.moveItem(id, moveMenuItemDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.menuItemService.remove(id)
  }
}
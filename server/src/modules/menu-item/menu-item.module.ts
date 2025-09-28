import { Module } from '@nestjs/common'
import { MenuItemService } from './menu-item.service'
import { MenuItemController } from './menu-item.controller'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [MenuItemController],
  providers: [MenuItemService],
  exports: [MenuItemService],
})
export class MenuItemModule {}

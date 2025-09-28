import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { MenuModule } from './modules/menu/menu.module'
import { MenuItemModule } from './modules/menu-item/menu-item.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MenuModule,
    MenuItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

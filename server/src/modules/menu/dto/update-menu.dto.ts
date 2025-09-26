import { PartialType } from '@nestjs/mapped-types'
import { IsString, IsOptional, IsBoolean, Length } from 'class-validator'
import { CreateMenuDto } from './create-menu.dto'

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Menu name must be between 1 and 100 characters' })
  name?: string

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean
}
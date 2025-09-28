import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
  IsBoolean,
} from 'class-validator'

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name!: string

  @IsOptional()
  @IsUUID()
  parentId?: string

  @IsUUID()
  @IsNotEmpty()
  menuId!: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true
}
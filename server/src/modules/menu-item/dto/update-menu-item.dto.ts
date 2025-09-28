import { IsString, IsOptional, IsUUID, Length, IsBoolean } from 'class-validator'

export class UpdateMenuItemDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string

  @IsOptional()
  @IsUUID()
  parentId?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
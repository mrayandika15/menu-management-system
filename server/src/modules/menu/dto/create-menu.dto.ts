import { IsString, IsNotEmpty, IsOptional, IsBoolean, Length } from 'class-validator'

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty({ message: 'Menu name is required' })
  @Length(1, 100, { message: 'Menu name must be between 1 and 100 characters' })
  name!: string

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean
}
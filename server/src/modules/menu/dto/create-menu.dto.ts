import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  name!: string

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  description?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true
}
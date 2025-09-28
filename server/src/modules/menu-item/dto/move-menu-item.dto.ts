import { IsUUID, IsOptional, IsInt, Min } from 'class-validator'

export class MoveMenuItemDto {
  @IsOptional()
  @IsUUID()
  targetParentId?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  newOrder?: number
}
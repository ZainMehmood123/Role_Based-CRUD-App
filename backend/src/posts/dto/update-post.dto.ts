// import { IsOptional, IsString } from 'class-validator';

// export class UpdatePostDto {
//   @IsOptional()
//   @IsString()
//   title?: string;

//   @IsOptional()
//   @IsString()
//   content?: string;
// }


import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string; // ✅ Optional update for image field
}

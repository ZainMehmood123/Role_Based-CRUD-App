// import { IsNotEmpty } from 'class-validator';

// export class CreatePostDto {
//   @IsNotEmpty()
//   title: string;

//   @IsNotEmpty()
//   content: string;
// }



import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  image?: string | null; 
}

import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';


export class LoginDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsEmail()
  @IsString()
  email: string;
}

export interface AuthPayload {
  username: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  image: string;

  @IsOptional()
  bio: string;
}
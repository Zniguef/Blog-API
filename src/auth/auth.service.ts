import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { LoginDto, RegisterDto } from 'src/models/user.models';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async register(credentials: RegisterDto) {
    try {
      const user = this.userRepo.create(credentials);
      await user.save();
      const payload = {username: user.username};
      const token = this.jwtService.sign(payload);
      return {user: {...user.toJSON(), token}};
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username has already taken');
      }
      throw new InternalServerErrorException();
    }
  }

  async login({ username, password }: LoginDto) {
    try {
      const user = await this.userRepo.findOne({where: { username }});
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new InternalServerErrorException('Invalid user');
      }
      const payload = {username: user.username};
      const token = this.jwtService.sign(payload);
      return {user: {...user.toJSON(), token}};
    } catch (err) {
      throw new UnauthorizedException('Username or password is incorrect!');
    }
  }
}

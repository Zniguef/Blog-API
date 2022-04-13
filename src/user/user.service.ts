import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/models/user.models';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {}

  async findByUsername(username: string, user?: UserEntity): Promise<UserEntity> {
    return (await this.userRepo.findOne({ where: {username} })).toProfile(user);
  }

  async updateUser(username: string, data: UpdateUserDto) {
    await this.userRepo.update({username}, data);
    return this.findByUsername(username);
  }

  async followUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: {username},
      relations: ['followers'],
    });
    user.followers.push(currentUser)
    await user.save();
    return user.toProfile(currentUser);
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: {username},
      relations: ['followers'],
    });
    user.followers = user.followers.filter(follower => follower !== currentUser)
    await user.save();
    return user.toProfile(currentUser);
  }

}

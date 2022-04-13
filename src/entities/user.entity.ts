import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { AbstractEntity } from './abstract-entity';
import * as bcryptjs from 'bcryptjs';

@Entity('users')
export class UserEntity extends AbstractEntity {
  push(currentUser: UserEntity) {
    throw new Error('Method not implemented.');
  }
  filter(arg0: (follower: any) => boolean): UserEntity {
    throw new Error('Method not implemented.');
  }
  @Column()
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: '' })
  bio: string;

  @ManyToMany((type) => UserEntity, (user) => user.followee, {cascade: true})
  @JoinTable()
  followers: UserEntity;

  @ManyToMany((type) => UserEntity, (user) => user.followers)
  followee: UserEntity;

  @Column({ default: null, nullable: true })
  image: string | null;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcryptjs.hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return await bcryptjs.compare(password, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

  toProfile(user?: UserEntity) {
    let following= null;
    if(user) {
    const following = this.followers.includes(user);
    }
    const profile: any = this.toJSON();
    delete profile.followers;
    return {...profile, following}
  }
  includes(user: UserEntity) {
    throw new Error('Method not implemented.');
  }
}

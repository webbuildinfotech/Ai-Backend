//users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
     
    ) { }

    async getAll(): Promise<Partial<UserEntity>[]> {
        const users = await this.userRepository.find({
            where: { isDeleted: false }
        });
        return users.map(({ password,isDeleted, ...rest }) => rest);
    }
    async getById(id: string): Promise<Partial<UserEntity>> {
        const user = await this.userRepository.findOne({ where: { id, isDeleted: false } });
        if (!user) {
            throw new NotFoundException("User not found or has been deleted");
        }

        const { password,isDeleted, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async delete(id: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id } }); // Correct way to find by ID
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isDeleted = true;
        await this.userRepository.save(user);
        return { message: 'User deleted successfully' };
    }
}

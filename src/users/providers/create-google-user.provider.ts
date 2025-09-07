import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import GoogleUser from '../interfaces/google-user.interface';

@Injectable()
export class CreateGoogleUserProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepeository: Repository<User>, // Assume UsersService is imported and available
    ) { }

    public async createGoogleUser(googleUser: GoogleUser) {
        try {
            const newUser = this.userRepeository.create(googleUser);
            return await this.userRepeository.save(newUser);
        } catch (error) {
            throw new ConflictException(error,
                { description: "Could not create user with Google credentials" }
            );
        }
    }
}

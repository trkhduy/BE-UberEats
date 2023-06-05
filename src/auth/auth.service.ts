import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt"
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async login(dataLogin: LoginDto) {
        const user = await this.userRepository.findOne({ where: [{ 'email': dataLogin.email }] });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const isMatched = bcrypt.compareSync(dataLogin.password, user.password);
        if (!isMatched) {
            throw new UnauthorizedException('Incorrect password or email');
        }
        delete user.password;
        const access_token = await this.createAccessToken(user.id, user.role);
        const refresh_token = await this.createRefeshToken(user.id, user.role);
        await this.updateRefreshToken(user.id, refresh_token)
        return {
            access_token: access_token,
            refresh_token: refresh_token
        }
    }

    async createAccessToken(userId: number, role: number): Promise<string> {
        const payload = {
            sub: userId,
            role: role
        };
        return this.jwtService.signAsync(payload, { expiresIn: '10m' });
    }

    async createRefeshToken(userId: number, role: number): Promise<string> {
        const payload = {
            sub: userId,
            role: role
        };
        return this.jwtService.signAsync(payload, { expiresIn: '7d' });
    }

    async updateRefreshToken(user_id: number, refresh_token: string) {
        const hashedRefreshToken = bcrypt.hashSync(refresh_token, 10);
        await this.userRepository.update(user_id, { refresh_token: hashedRefreshToken })
    }

    async getUserById(id: number): Promise<User> {
        try {
            const userById = await this.userRepository.findOne({ where: [{ 'id': id }] })
            return userById
        } catch (error) {
            return error
        }
    }

    async reGenerateRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepository.findOne({ where: [{ 'id': userId }] });

        if (!user || !user.refresh_token) {
            throw new ForbiddenException('access denied')
        }

        const checkRefreshToken = bcrypt.hashSync(refreshToken, user.refresh_token)

        if (!checkRefreshToken) {
            throw new ForbiddenException('access denied')
        }

        const newRefreshToken = await this.createRefeshToken(userId, user.role);
        const newAccessToken = await this.createAccessToken(userId, user.role);

        await this.updateRefreshToken(userId, newRefreshToken);

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken
        }
    }

    async logOut(id: number) {
        await this.userRepository.update(id, { refresh_token: null })
    }
    public async getUserFromAuthenticationToken(token: string) {
        const payload: any = this.jwtService.verify(token, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET')
        });
        if (payload.sub) {
            // console.log('pay', payload);
            return payload.sub;
        }
    }
}
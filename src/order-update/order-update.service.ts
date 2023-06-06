import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { ConfigService } from "@nestjs/config";


@Injectable()
export class OrderUpdateService {
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }
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
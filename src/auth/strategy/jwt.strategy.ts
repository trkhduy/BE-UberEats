import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { jwtConstants } from "../constants";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authServive: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.access_token;
            }]),
            secretOrKey: jwtConstants.secret,
        })
    }
    async validate(payload: any) {
        const user = await this.authServive.getUserById(payload.sub);
        delete user.password;
        return { user };
    }
}
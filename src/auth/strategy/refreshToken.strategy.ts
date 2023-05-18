import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from "../constants";

export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.refresh_token
            }]),
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true
        })
    }

    validate(request: Request, payload: any) {
        const refresh_token = request?.cookies?.refresh_token
        return { ...payload, refresh_token }
    }
}
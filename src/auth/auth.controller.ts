import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";


@Controller('api/auth')

export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() dataLogin: LoginDto, @Res({ passthrough: true }) res: Response) {
        const token = await this.authService.login(dataLogin);
        token && res.cookie('access_token', token.access_token);
        token && res.cookie('refresh_token', token.refresh_token);
        return {
            status: 200,
            message: 'Đăng nhập thành công',
            token: token
        }
    }
}
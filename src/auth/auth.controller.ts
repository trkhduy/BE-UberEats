import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";


@Controller('api')

export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('user/login')
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

    @UseGuards(AuthGuard('jwt-refresh'))
    @Get('refresh')
    async refreshToken(@Req() req: Request & { user: any }, @Res({ passthrough: true }) res: Response) {
        const userId = req.user['sub'];
        const curRefreshToken = req.user['refresh_token'];
        const tokens = await this.authService.reGenerateRefreshToken(userId, curRefreshToken);
        tokens && res.cookie('access_token', tokens.access_token)
        tokens && res.cookie('refresh_token', tokens.refresh_token)
        return {
            message: 'successfully',
            token: tokens
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user/logout')
    async logOut(@Req() req: Request & { user: any }, @Res({ passthrough: true }) res: Response) {
        const id = req.user.user.id;
        this.authService.logOut(id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return {
            status: 200,
            message: 'Đăng xuất thành công'
        }
    }
}
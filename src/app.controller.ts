import { Controller, Get, Post, Body, BadRequestException, Res, Req, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, Express } from 'express';

@Controller('api')
export class AppController {
        constructor(
           private readonly appService: AppService,
           private jwtService: JwtService
        ) {}

      @Post('register')
      async register(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
      ){
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.appService.create({
          name,
          email,
          password: hashedPassword
        });

        delete user.password;

        return user;
      }

      @Post('login')
      async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response
      ) {
        const user = await this.appService.findOne({ email });

        if(!user) {
          throw new BadRequestException('Bunday user ro`yxatdan o`tmagan!!!')
        }

        if( !await bcrypt.compare(password, user.password) ) {
          throw new BadRequestException('Password xato kiritildi!!!')
        }

        const jwt = await this.jwtService.signAsync({ id: user.id });

        response.cookie('jwt', jwt, { httpOnly: true })


        return {
          msg: 'Success'
        };
      }


      @Get('user')
      async user(@Req() request: Request) {
       try{
          const cookie = request.cookies['jwt'];
          const data = await this.jwtService.verifyAsync(cookie);

          if(!data){
            throw new UnauthorizedException();            
          }

          const user = await this.appService.findOne({ id: data['id'] });

          const { password, ...rest } = user;
          return rest;
       }catch(e){
         throw new UnauthorizedException()
       }
      }


      // @Post('upload')
      // @UseInterceptors(
      //     FileInterceptor('photo', {
      //         dest: './uploads',
      //     })
      // )
      // uploadFile(@UploadedFile() files: Array<Express.Multer.File>) {
      //    console.log(files)
      // }


      @Post('logout')
      async logout( @Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');

        return {
          msg: 'Logout successfully'
        }
      }

}

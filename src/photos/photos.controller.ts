import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('')
export class PhotosController {
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('photo', {
            dest: './uploads',
        })
    )
    uploadSingle(@UploadedFile() file) {
        console.log(file)
    }
}

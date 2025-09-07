import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GCSServiceDiscVersion } from './providers/gcs.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ApiBody, ApiConsumes, ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage, memoryStorage } from 'multer';
import { Express } from "express";
import path from 'path';
import fs from 'fs';
import { StorageService } from './storage.service';

@ApiTags('Storage')
@Controller('upload')
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Post()
    @Auth(AuthType.None)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage()
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiHeaders([
        {
            name: 'content-type',
            description: 'multipart/form-data',
        },
        {
            name: 'Authorization',
            description: 'Bearer token',
        }
    ])
    @ApiOperation({ summary: 'Upload a file' })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const url = await this.storageService.uploadFile(file);
        return { url };
    }
}

// Defines a controller with route prefix '/upload'
@Controller('dont use')
export class DiscStorageVersion {

    // Inject GCSService for uploading files
    constructor(private readonly gcsService: GCSServiceDiscVersion) { }

    // Handle POST requests at /upload
    @Post()

    // No authentication required for this endpoint
    @Auth(AuthType.None)

    // Use Multer interceptor to handle file upload
    @UseInterceptors(FileInterceptor('file', {

        // Use disk storage (files are saved temporarily on server)
        storage: diskStorage({

            // Temporary folder for storing uploaded files
            destination: './uploads',

            // Rename file to ensure unique, safe filenames
            filename: (req, file, cb) => {
                // Extract the base name without extension
                const name = file.originalname.split('.')[0].replace(/\s+/g, '-');

                // Extract the file extension
                const ext = path.extname(file.originalname);

                // Combine name, timestamp, and extension for unique filename
                cb(null, `${name}-${Date.now()}${ext}`);
            },
        }),
    }))

    // Declare content type accepted by Swagger
    @ApiConsumes('multipart/form-data')

    // Define request body schema for Swagger
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })

    // Add required headers for Swagger documentation
    @ApiHeaders([
        { name: 'content-type', description: 'multipart/form-data' },
        { name: 'Authorization', description: 'Bearer token' },
    ])

    // Summary for Swagger documentation
    @ApiOperation({ summary: 'Upload a file' })

    // Controller method to handle the uploaded file
    async uploadFile(@UploadedFile() file: Express.Multer.File) {

        // Upload file to Google Cloud Storage using the GCSService
        const url = await this.gcsService.uploadFile(file);

        // Delete the temporary file from disk to avoid clutter
        fs.unlink(file.path, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });

        // Return the public URL of the uploaded file
        return { url };
    }
}

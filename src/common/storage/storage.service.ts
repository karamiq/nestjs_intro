import { Injectable, Inject, RequestTimeoutException, BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import googleCloudConfig from 'src/config/google-cloud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './upload.entity';
import { GCSService } from './providers/gcs.service';
import { UploadFile } from './interfaces/storage-file.interface';
import { FileTypes } from './enums/file-types.enum';

@Injectable()
export class StorageService {
    constructor(
        /**
         * Inject uploadToAwsProvider
         */
        private readonly gcsService: GCSService,
        /**
         * inject uploadsRepository
         */
        @InjectRepository(Upload)
        private uploadsRepository: Repository<Upload>,
    ) { }

    public async uploadFile(file: Express.Multer.File): Promise<Upload> {
        if (!['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            throw new BadRequestException('MIME type not supported');
        }
        try {
            const url = await this.gcsService.uploadFile(file);
            const uploadFile: Partial<Upload> = {
                name: file.originalname,
                path: url,
                type: FileTypes.IMAGE as FileTypes,
                mime: file.mimetype,
                size: file.size,
            };
            const upload = this.uploadsRepository.create(uploadFile);
            return await this.uploadsRepository.save(upload);
        } catch (error) {
            throw new ConflictException(error);
        }
    }

}
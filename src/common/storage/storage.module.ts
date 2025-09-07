import { Module } from '@nestjs/common';
import { GCSService } from './providers/gcs.service';
import { StorageController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { StorageService } from './storage.service';

@Module({
    providers: [GCSService, StorageService],
    exports: [GCSService],
    controllers: [StorageController],
    imports: [TypeOrmModule.forFeature([Upload])],
})
export class StorageModule { }

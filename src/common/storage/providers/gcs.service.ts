import { Injectable, Inject, RequestTimeoutException, BadRequestException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import googleCloudConfig from 'src/config/google-cloud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';

@Injectable()
export class GCSService {
    // Google Cloud Storage client instance
    public storage: Storage;

    // Bucket name where files are uploaded
    private bucketName: string;

    constructor(
        @Inject(googleCloudConfig.KEY)
        private readonly googleConfig: ConfigType<typeof googleCloudConfig>,

        @InjectRepository(Upload)
        private readonly uploadRepository: Repository<Upload>, // Replace 'any' with the actual repository type if needed
    ) {
        // Initialize Google Cloud Storage client with project ID and credentials
        this.storage = new Storage({
            projectId: googleConfig.projectId,
            keyFilename: googleConfig.credentials,
        });

        // Set bucket name from configuration
        this.bucketName = googleConfig.bucketName;
    }

    // Upload file directly from memory buffer
    async uploadFile(file: Express.Multer.File) {

        try {
            // Generate unique file name using original file info
            const newFileName = this.generateFileName(file);

            // Get a reference to the file in GCS bucket
            const blob = this.storage.bucket(this.bucketName).file(newFileName);

            // Create a write stream to upload the file buffer
            const blobStream = blob.createWriteStream({
                // the resumable is false cuz we are uploading small files
                // for large files it should be true
                // becuase it allows to resume the upload if it fails
                resumable: false, // Disable resumable uploads for simplicity
                metadata: {
                    contentType: file.mimetype, // Set correct MIME type
                },
            });

            // End the stream and upload the buffer to GCS
            blobStream.end(file.buffer);

            // Wait for the stream to finish or throw an error
            await new Promise((resolve, reject) => {
                blobStream.on('finish', resolve); // Upload complete
                blobStream.on('error', reject);   // Upload failed
            });

            // Construct public URL for the uploaded file
            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${newFileName}`;

            // Return the URL
            return publicUrl;

        } catch (error) {
            // Throw a timeout exception if upload fails
            throw new RequestTimeoutException(
                error instanceof Error ? error.message : 'File upload timed out',
                { description: error },
            );
        }
    }

    // Generate a unique file name
    private generateFileName(file: Express.Multer.File): string {
        // Extract base name without extension
        let name = file.originalname.split('.')[0];

        // Replace spaces with dashes and convert to lowercase
        name = name.replace(/\s+/g, '-').toLowerCase();

        // Extract file extension
        const extension = path.extname(file.originalname);

        // Generate timestamp
        const timestamp = Date.now();

        // Generate random UUID
        const randomUuid = uuidv4();

        // Combine all parts to create a unique file name
        return `${name}-${timestamp}-${randomUuid}${extension}`;
    }
}




@Injectable()
export class GCSServiceDiscVersion {
    // Google Cloud Storage client instance
    private storage: Storage;

    // Bucket name where files are uploaded
    private bucketName: string;

    constructor(
        @Inject(googleCloudConfig.KEY)
        private readonly googleConfig: ConfigType<typeof googleCloudConfig>,
    ) {
        // Initialize Google Cloud Storage client
        this.storage = new Storage({
            projectId: googleConfig.projectId,
            keyFilename: googleConfig.credentials,
        });

        // Set bucket name
        this.bucketName = googleConfig.bucketName;
    }

    // Upload file method
    async uploadFile(file: Express.Multer.File) {
        try {
            // Get reference to bucket
            const bucket = this.storage.bucket(this.bucketName);

            // Generate unique file name
            const newFileName = this.generateFileName(file);

            // Upload file from disk to GCS
            const [uploadedFile] = await bucket.upload(file.path, {
                destination: newFileName,  // Store with new file name
                resumable: false,          // Single-shot upload
                metadata: {
                    contentType: file.mimetype, // Set correct MIME type
                    metadata: {
                        firebaseStorageDownloadTokens: uuidv4(), // Optional token
                    },
                },
            });

            // Generate public URL for uploaded file
            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${uploadedFile.name}`;
            return publicUrl;

        } catch (error) {
            // Handle upload errors and throw timeout exception
            throw new RequestTimeoutException(
                error instanceof Error ? error.message : 'File upload timed out',
                { description: error },
            );
        }
    }

    // Generate unique file name
    private generateFileName(file: Express.Multer.File): string {
        // Extract base name without extension
        let name = file.originalname.split('.')[0];

        // Replace spaces with dashes and convert to lowercase
        name = name.replace(/\s+/g, '-').toLowerCase();

        // Get original file extension
        const extension = path.extname(file.originalname);

        // Generate timestamp
        const timestamp = Date.now();

        // Generate random UUID
        const randomUuid = uuidv4();

        // Combine all parts to form final file name
        return `${name}-${timestamp}-${randomUuid}${extension}`;
    }
}

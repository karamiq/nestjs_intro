
import { registerAs } from '@nestjs/config';

export default registerAs('googleCloud', () => ({
    projectId: process.env.GCS_PROJECT_ID,
    bucketName: process.env.GCS_BUCKET_NAME,
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
}));

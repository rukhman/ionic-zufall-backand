import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
  s3 = new AWS.S3({
    endpoint: process.env.AWS_S3_URL,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async delete(key: string) {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.AWS_S3_BUCKET,
          Key: key,
        })
        .promise();

      return true;
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      return false;
    }
  }

  async deleteMultipleFiles(keys: string[]): Promise<boolean> {
    try {
      await this.s3
        .deleteObjects({
          Bucket: this.AWS_S3_BUCKET,
          Delete: {
            Objects: keys.map((key) => ({ Key: key })),
            Quiet: false,
          },
        })
        .promise();

      return true;
    } catch (error) {
      console.error('Error deleting files from S3:', error);
      return false;
    }
  }

  async uploadFile(file) {
    const { originalname } = file;

    return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.error(e);
    }
  }
}

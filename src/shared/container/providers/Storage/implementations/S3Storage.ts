import { EnvironmentCredentials, S3 } from 'aws-sdk'
import { IStorageProvider } from "../IStorage"
import { resolve } from 'path'
import upload from '../../../../../config/upload'
import fs from 'fs'
import mime from 'mime'

export class S3Storage implements IStorageProvider{
  private client!: S3
  constructor () {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,

    })
  }

  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file)

    const fileContent = await fs.promises.readFile(originalName)

    const ContentType = mime.getType(originalName) as string

    await this.client.putObject({
      Bucket: `${process.env.AWS_BUCKET}/${folder}`,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    }).promise()
    await fs.promises.unlink(originalName)

    return file
  }

  async delete(file: string, folder: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: `${process.env.AWS_BUCKET}/${folder}`,
      Key: file,
    }). promise()
  }

}

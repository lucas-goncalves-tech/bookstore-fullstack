export abstract class StorageProvider {
    abstract uploadCover(file: Express.Multer.File): Promise<{fullUrl: string, thumbUrl: string}>;
    abstract deleteFile(path: string): Promise<void>;
}
import { StorageProvider } from "./contracts/storage.contract";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../core/config/env";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryUploadService implements StorageProvider {
  private readonly folder = "bookstore/covers";
  private async uploadStream(
    buffer: Buffer,
    publicId: string,
    width: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: "image",
          transformation: {
            width,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error("Cloudinary Error ao processar imagem"));

          return resolve(result.secure_url);
        },
      );

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 100);
  }

  async uploadCover(
    file: Express.Multer.File,
  ): Promise<{ fullUrl: string; thumbUrl: string }> {
    const baseName = file.originalname.replace(/\.[^/.]+$/, "");
    const sanitizedName = this.sanitizeFilename(baseName);

    const publicId = `${this.folder}/${Date.now()}_${sanitizedName}`;
    const [fullUrl, thumbUrl] = await Promise.all([
      this.uploadStream(file.buffer, publicId + "_full", 1200),
      this.uploadStream(file.buffer, publicId + "_thumb", 400),
    ]);

    return {
      fullUrl,
      thumbUrl,
    };
  }

  async deleteFile(path: string): Promise<void> {
    const filename = path.split("/").pop()?.split(".")[0];

    if (!filename) {
      throw new Error(`[Cloudinary] Could not extract filename from: ${path}`);
    }

    const publicId = `${this.folder}/${filename}`;

    const deleted = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "image",
    });

    if (deleted.result !== "ok" && deleted.result !== "not found") {
      throw new Error(`Cloudinary Error ao deletar imagem: ${deleted.result}`);
    }
  }
}

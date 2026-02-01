import { container } from "tsyringe";
import { CloudinaryUploadService } from "../../services/cloudinary-upload.service";

container.register("StorageProvider", { useClass: CloudinaryUploadService });
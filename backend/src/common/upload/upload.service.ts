// src/common/upload/upload.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class UploadService {
  private uploadPath = join(__dirname, '..', '..', '..', 'uploads');

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getStorage(folder = '') {
    const destination = join(this.uploadPath, folder);
    if (!existsSync(destination)) {
      mkdirSync(destination, { recursive: true });
    }

    return diskStorage({
      destination,
      filename: (_req, file, cb) => {
        const uniqueName = `${file.fieldname}-${Date.now()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });
  }

  buildImageUrl(filePath: string | null): string | null {
    if (!filePath) return null;
    return `http://localhost:5000/uploads/${filePath}`;
  }

  getRelativePath(fileName: string, folder = ''): string {
    return folder ? `${folder}/${fileName}` : fileName;
  }
}

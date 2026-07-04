import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ImageCompressionService {
    async compressImageToTargetSize(file: File, targetSizeKb = 400): Promise<File> {
        const attempts = [
            { maxWidth: 1200, maxHeight: 1200, quality: 0.7 },
            { maxWidth: 1000, maxHeight: 1000, quality: 0.65 },
            { maxWidth: 900, maxHeight: 900, quality: 0.6 },
            { maxWidth: 800, maxHeight: 800, quality: 0.55 },
            { maxWidth: 700, maxHeight: 700, quality: 0.5 },
            { maxWidth: 600, maxHeight: 600, quality: 0.45 }
        ];

        let bestFile = file;

        for (const attempt of attempts) {
            const compressed = await this.compressImage(file, {
                maxWidth: attempt.maxWidth,
                maxHeight: attempt.maxHeight,
                quality: attempt.quality,
                outputType: 'image/jpeg'
            });

            bestFile = compressed;

            const sizeKb = compressed.size / 1024;

            if (sizeKb <= targetSizeKb) {
                return compressed;
            }
        }

        return bestFile;
    }

    private compressImage(
        file: File,
        options: {
            maxWidth: number;
            maxHeight: number;
            quality: number;
            outputType: 'image/jpeg' | 'image/webp';
        }
    ): Promise<File> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            const objectUrl = URL.createObjectURL(file);

            image.onload = () => {
                URL.revokeObjectURL(objectUrl);

                const { width, height } = this.calculateImageSize(image.width, image.height, options.maxWidth, options.maxHeight);

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not create canvas context.'));
                    return;
                }

                if (options.outputType === 'image/jpeg') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, width, height);
                }

                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Image compression failed.'));
                            return;
                        }

                        const extension = options.outputType === 'image/webp' ? 'webp' : 'jpg';
                        const fileName = this.replaceFileExtension(file.name, extension);

                        const compressedFile = new File([blob], fileName, {
                            type: options.outputType,
                            lastModified: Date.now()
                        });

                        resolve(compressedFile);
                    },
                    options.outputType,
                    options.quality
                );
            };

            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Could not load image.'));
            };

            image.src = objectUrl;
        });
    }

    private calculateImageSize(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number): { width: number; height: number } {
        let width = originalWidth;
        let height = originalHeight;

        if (width <= maxWidth && height <= maxHeight) {
            return { width, height };
        }

        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        return { width, height };
    }

    private replaceFileExtension(fileName: string, extension: string): string {
        const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');

        return `${nameWithoutExtension}.${extension}`;
    }
}

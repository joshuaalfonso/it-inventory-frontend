


export const compressImage = (
  file: File,
  quality: number = 0.7,   // 0 to 1 (lower = more compression)
  maxWidth: number = 1024
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Canvas not supported');
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject('Compression failed');
        },
        'image/jpeg',
        quality
      );
    };

    reader.readAsDataURL(file);
  });
}

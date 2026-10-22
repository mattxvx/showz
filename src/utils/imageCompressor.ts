/**
 * Client-side image compression utility
 * Compresses camera roll / flyer images down to ~50-80 KB
 * so they can be stored directly in Cloud Firestore documents without needing
 * Firebase Storage or any paid billing plan.
 */
export function compressImageFile(file: File, maxWidth = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, return error
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while capping width at maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from device'));
    reader.readAsDataURL(file);
  });
}

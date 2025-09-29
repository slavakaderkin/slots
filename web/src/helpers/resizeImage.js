export default (file, size, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
  
        const dimension = Math.min(img.width, img.height);
        const startX = (img.width - dimension) / 2;
        const startY = (img.height - dimension) / 2;
  
        ctx.drawImage(img, startX, startY, dimension, dimension, 0, 0, size, size);
  
        ctx.canvas.toBlob(
          (blob) => {
            callback(blob);
          },
          'image/jpeg', 0.95
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
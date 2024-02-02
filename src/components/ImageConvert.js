import React, { useState } from 'react';

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [convertedImg, setConvertedImg] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL('image/png');
        setConvertedImg(pngDataUrl);
      };
      img.src = event.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2>Image Uploader</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <div>
          <h3>Original Image</h3>
          <img src={image} alt="Original" style={{ maxWidth: '100%' }} />
        </div>
      )}
      {convertedImg && (
        <div>
          <h3>Converted Image (PNG)</h3>
          <img src={convertedImg} alt="PNG" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;

import { useState } from "react";

function ImageUploader({ setImage }) {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      {preview && <img src={preview} alt="Preview" width="100" />}
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
}

export default ImageUploader;

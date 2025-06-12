import { useRef, useState, type ChangeEvent, type FC } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

interface ProfilePicSelectorProps {
  image: File | null;
  setImage: (file: File | null) => void;
  preview?: string | null;
  setPreview?: (url: string | null) => void;
}

const ProfilePicSelector: FC<ProfilePicSelectorProps> = ({
  image,
  setImage,
  preview,
  setPreview,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);

      if (setPreview) {
        setPreview(preview);
      }

      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) {
      setPreview(null);
    }
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="mb-6 flex justify-center">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <div className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-orange-50">
          <LuUser className="text-4xl text-orange-500" />
          <button
            type="button"
            className="absolute right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-linear-to-r from-orange-500/85 to-orange-600 text-white"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || previewUrl || ""}
            alt="profile"
            className="h-20 w-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicSelector;

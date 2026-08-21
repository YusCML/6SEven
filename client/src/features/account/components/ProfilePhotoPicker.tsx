import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { CameraIcon } from '@/components/icons';
import { errorMessage } from '@/lib/http';
import * as accountApi from '@/services/account.service';
import useSession from '@/hooks/useSession';

const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const OUTPUT_SIZE = 256;
const OUTPUT_QUALITY = 0.85;

/*
 * Photos are downscaled and re-encoded in the browser before upload. Whatever
 * the user picks, the server only ever receives a square 256px JPEG, which
 * keeps the request well inside the body limit and the column small.
 */
function toSquareJpeg(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;

      const context = canvas.getContext('2d');
      if (!context) return reject(new Error('Your browser could not process that image.'));

      const side = Math.min(image.width, image.height);
      const sx = (image.width - side) / 2;
      const sy = (image.height - side) / 2;

      context.drawImage(image, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      resolve(canvas.toDataURL('image/jpeg', OUTPUT_QUALITY));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That file could not be read as an image.'));
    };

    image.src = url;
  });
}

type ProfilePhotoPickerProps = {
  children: ReactNode;
  onStatus?: (status: { tone: 'error' | 'success'; message: string } | null) => void;
};

export default function ProfilePhotoPicker({ children, onStatus }: ProfilePhotoPickerProps) {
  const { applySession } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    onStatus?.(null);

    if (!file.type.startsWith('image/')) {
      return onStatus?.({ tone: 'error', message: 'Choose an image file.' });
    }

    if (file.size > MAX_INPUT_BYTES) {
      return onStatus?.({ tone: 'error', message: 'That image is too large. Keep it under 8MB.' });
    }

    setUploading(true);

    try {
      const dataUrl = await toSquareJpeg(file);
      applySession(await accountApi.updateProfilePhoto(dataUrl));
      onStatus?.({ tone: 'success', message: 'Profile picture updated.' });
    } catch (error) {
      onStatus?.({ tone: 'error', message: errorMessage(error, 'Could not update your profile picture.') });
    } finally {
      setUploading(false);
    }
  };

  return (
    <span className="relative inline-flex">
      {children}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Change profile picture"
        className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-900 text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {uploading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <CameraIcon className="h-4 w-4" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </span>
  );
}

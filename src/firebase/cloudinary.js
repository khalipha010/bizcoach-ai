// Centralized Cloudinary environment variables

export const CLOUDINARY_CLOUD_NAME = 'dtxxvwnqv';
export const CLOUDINARY_API_KEY = '379552942984115'; // replace with your real API key
export const CLOUDINARY_API_SECRET = 'OkTz4G0o2Ln6844Q53jL3ilw5Dk'; // replace with your real API secret
export const CLOUDINARY_UPLOAD_PRESET = 'biscoach-profile';
export const CLOUDINARY_UPLOAD_ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// (Optional) If you need the config object elsewhere
export const CLOUDINARY_CONFIG = {
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
};
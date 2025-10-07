import cloudinary from "../config/cloudinary.config.js";
import logger from "./logger.utils.js";
import fs from "fs";
/**
 * Uploads an image to Cloudinary
 * @param {string} filePath - Local path or base64 string of the image
 * @param {object} options - Optional settings like folder, format
 * @returns {Promise<object>} - Cloudinary response
 */
export const uploadImage = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || "parasparivaar",
      format: options.format || "jpg",
      ...options,
    });
    await fs.promises.unlink(filePath).catch((err) => {
      logger.warn(`Failed to delete local file ${filePath}:`, err);
    });

    return result;
  } catch (error) {
    logger.error("Cloudinary upload error:", error);
    await fs.promises.unlink(filePath).catch((err) => {
      logger.warn(`Failed to delete local file after error ${filePath}:`, err);
    });
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Cloudinary image deleted: ${publicId}`);
    return result;
  } catch (error) {
    logger.error("Cloudinary delete error:", error);
    throw error;
  }
};

import { writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary from "cloudinary";
import { env } from "~/infra/env.server";

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudnaryResponse {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: any[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  original_filename: string
  api_key: string
}


async function uploadImage(data: AsyncIterable<Uint8Array>): Promise<CloudnaryResponse> {
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: env.CLOUDFLARE_BUCKET,
      },
      (error, result) => {
        if (error) {
          console.error("uploadImage::error:", error);
          reject(error);
          return;
        }
        resolve(result);
      },
    );
    await writeAsyncIterableToWritable(data, uploadStream);
  }) as Promise<CloudnaryResponse>;

  return uploadPromise;
}

// console.log("configs", cloudinary.v2.config());
export { uploadImage };

import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "~~/server/trpc/init";

const s3Settings = useRuntimeConfig().s3;
const s3Client = new S3Client({
  region: s3Settings.region,
  endpoint: s3Settings.endpoint,
  credentials: {
    accessKeyId: s3Settings.token,
    secretAccessKey: s3Settings.secret,
  },
});

export const s3Router = createTRPCRouter({
  listFiles: baseProcedure
    .input(
      z.object({
        path: z.string(),
      }),
    )
    .query(async (opts) => {
      try {
        const bucketName = s3Settings.bucket;
        const prefix = opts.input.path.startsWith("/") ? opts.input.path.slice(1) : opts.input.path;

        const command = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: prefix,
          Delimiter: "/",
        });

        const response = await s3Client.send(command);

        return {
          files:
            response.Contents?.filter((item) => item.Key !== prefix).map((item) => ({
              key: item.Key,
              size: item.Size,
              lastModified: item.LastModified,
              etag: item.ETag,
            })) || [],
          folders: response.CommonPrefixes?.map((prefix) => prefix.Prefix) || [],
        };
      } catch (error) {
        console.error("Error listing S3 objects:", error);
        throw new Error(`Failed to list files: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});

// export type definition of API
export type AppRouter = typeof s3Router;

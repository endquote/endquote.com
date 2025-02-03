import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import fs from "fs/promises";
import path from "path";

export const http = axios.create();
http.interceptors.request.use((config) => {
  if (!process.env.COOLIFY_FQDN) {
    console.log(config.url, config.data, config.params);
  }
  return config;
});

export const db = new PrismaClient({
  log: process.env.COOLIFY_FQDN ? [] : ["query", "info", "warn", "error"],
});

export const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: { accessKeyId: process.env.S3_TOKEN!, secretAccessKey: process.env.S3_SECRET! },
  endpoint: process.env.S3_ENDPOINT,
});

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFKD") // Normalize Unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/['"''""]/g, "") // Remove various quote types
    .replace(/[^a-z0-9\s]/g, "") // Remove all other punctuation
    .trim();
};

export const getMichelinToken = async (): Promise<string> => {
  const url = "https://api.prod.r53.tablethotels.com/account/v1/token/";
  const { data } = await axios.post(url, {
    username: process.env.MICHELIN_USER,
    password: process.env.MICHELIN_PASS,
  });
  return data.token;
};

export const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

// distance in km
export const haversine = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

export async function cacheFile(url: string, cachePath: string): Promise<string> {
  const cacheDir = path.dirname(cachePath);

  try {
    // Create cache directory if it doesn't exist
    await fs.mkdir(cacheDir, { recursive: true });

    // Check if file exists
    await fs.access(cachePath);
  } catch {
    // Download and save if file doesn't exist
    const response = await http.get(url);
    await fs.writeFile(cachePath, response.data);
  }

  return cachePath;
}

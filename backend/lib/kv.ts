import { kv } from '@vercel/kv';

export const getKVClient = () => {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN must be set');
  }
  return kv;
};


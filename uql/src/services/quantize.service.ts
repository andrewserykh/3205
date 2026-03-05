import { AppDataSource } from '../data-source';
import { Link } from '../entity/Link';
import { parseSitePayload } from './parser';

// Custom random ID generator (works with both CommonJS and ESM)
const generateRandomId = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const nanoid = (length: number) => generateRandomId(length);

const linkRepo = () => AppDataSource.getRepository(Link);

export const quantizeUrl = async (originalUrl: string) => {
  try {
    new URL(originalUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  const existing = await linkRepo().findOne({ where: { url: originalUrl } });
   if (existing) 
    return existing;
  
  const meta = await parseSitePayload(originalUrl);

  const link = linkRepo().create({
    uql:         nanoid(4),
    url:         originalUrl,
    title:       meta.title,
    description: meta.description,
    image:       meta.image,
  });

  await linkRepo().save(link);
  return link;
};

export const findByShortId = async (uql: string) => {
  return linkRepo().findOne({ where: { uql } });
};

export const findAll = async () => {
  return linkRepo().find();
};


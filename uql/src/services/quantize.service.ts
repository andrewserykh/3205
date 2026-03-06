import { prisma } from '../data-source';
import { parseSitePayload } from './parser';

const generateRandomId = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const quantizeUrl = async (originalUrl: string) => {
  try {
    new URL(originalUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  const existing = await prisma.link.findUnique({ 
    where: { url: originalUrl } 
  });
  if (existing) 
    return existing;
  
  const meta = await parseSitePayload(originalUrl);

  const link = await prisma.link.create({
    data: {
      uql:         generateRandomId(4),
      url:         originalUrl,
      title:       meta.title,
      description: meta.description,
      image:       meta.image,
    },
  });

  return link;
};

export const findByUql = async (uql: string) => {
  return prisma.link.findUnique({ where: { uql } });
};

export const findAll = async () => {
  return prisma.link.findMany();
};

export const findLastN = async (limit: number) => {
  return prisma.link.findMany({
    orderBy: { created: 'desc' },
    take: limit,
  });
};


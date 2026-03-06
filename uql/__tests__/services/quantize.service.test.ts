jest.mock('../../src/data-source', () => ({
  prisma: {
    link: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));
jest.mock('../../src/services/parser');

import { prisma } from '../../src/data-source';
import { quantizeUrl, findByUql, findAll } from '../../src/services/quantize.service';
import * as parser from '../../src/services/parser';

describe('Quantize Service', () => {
  const mockParser = parser as jest.Mocked<typeof parser>;
  let mathRandomSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Math.random to generate predictable ID 'abc12'
    // For the custom alphabet 'abcdefghijklmnopqrstuvwxyz0123456789':
    // 'a' is at index 0, 'b' at 1, 'c' at 2, '1' at 27, '2' at 28
    const values = [
      0.01,   // Math.floor(0.01 * 36) = 0 => 'a'
      0.04,   // Math.floor(0.04 * 36) = 1 => 'b'
      0.07,   // Math.floor(0.07 * 36) = 2 => 'c'
      0.76,   // Math.floor(0.76 * 36) = 27 => '1'
      0.78,   // Math.floor(0.78 * 36) = 28 => '2'
    ];
    let callCount = 0;
    mathRandomSpy = jest.spyOn(Math, 'random').mockImplementation(() => {
      const val = values[callCount % values.length];
      callCount++;
      return val;
    });

    (prisma.link.findUnique as jest.Mock) = jest.fn();
    (prisma.link.create as jest.Mock) = jest.fn();
    (prisma.link.findMany as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
  });

  describe('quantizeUrl', () => {
    it('should create a new short URL for a valid URL', async () => {
      const originalUrl = 'http://example.com/very/long/url';
      const mockMeta = {
        title: 'Example Title',
        description: 'Example Description',
        image: 'http://example.com/image.jpg',
      };

      mockParser.parseSitePayload.mockResolvedValue(mockMeta);
      (prisma.link.findUnique as jest.Mock).mockResolvedValue(null);

      const mockLink = {
        id: 1,
        uql: 'abc12',
        url: originalUrl,
        title: mockMeta.title,
        description: mockMeta.description,
        image: mockMeta.image,
        created: new Date(),
      };

      (prisma.link.create as jest.Mock).mockResolvedValue(mockLink);

      const result = await quantizeUrl(originalUrl);

      expect(result.uql).toBeDefined();
      expect(result.url).toBe(originalUrl);
      expect(result.title).toBe(mockMeta.title);
      expect(mockParser.parseSitePayload).toHaveBeenCalledWith(originalUrl);
    });

    it('should return existing link if URL already quantized', async () => {
      const originalUrl = 'http://example.com/long/url';
      const existingLink = {
        id: 1,
        uql: 'abc12',
        url: originalUrl,
        title: 'Existing Title',
        description: 'Existing Description',
        image: null,
        created: new Date(),
      };

      (prisma.link.findUnique as jest.Mock).mockResolvedValue(existingLink);

      const result = await quantizeUrl(originalUrl);

      expect(result).toEqual(existingLink);
      expect(prisma.link.create).not.toHaveBeenCalled();
      expect(mockParser.parseSitePayload).not.toHaveBeenCalled();
    });

    it('should throw error for invalid URL format', async () => {
      const invalidUrl = 'not a valid url';

      await expect(quantizeUrl(invalidUrl)).rejects.toThrow('Invalid URL format');
    });

    it('should throw error for malformed URLs', async () => {
      const malformedUrl = '://invalid.com';

      await expect(quantizeUrl(malformedUrl)).rejects.toThrow('Invalid URL format');
    });

    it('should handle metadata parsing errors gracefully', async () => {
      const originalUrl = 'http://example.com';

      (prisma.link.findUnique as jest.Mock).mockResolvedValue(null);
      mockParser.parseSitePayload.mockResolvedValue({
        title: null,
        description: null,
        image: null,
      });

      const mockLink = {
        id: 2,
        uql: 'def45',
        url: originalUrl,
        title: null,
        description: null,
        image: null,
        created: new Date(),
      };

      (prisma.link.create as jest.Mock).mockResolvedValue(mockLink);

      const result = await quantizeUrl(originalUrl);

      expect(result.url).toBe(originalUrl);
      expect(result.title).toBeNull();
    });

    it('should validate various URL formats', async () => {
      const validUrls = [
        'http://example.com',
        'https://example.com/path',
        'https://example.com:8080/path?query=1',
        'http://sub.example.co.uk',
      ];

      for (const url of validUrls) {
        (prisma.link.findUnique as jest.Mock).mockResolvedValue(null);
        mockParser.parseSitePayload.mockResolvedValue({
          title: null,
          description: null,
          image: null,
        });

        const mockLink = {
          id: 1,
          uql: 'test1',
          url,
          title: null,
          description: null,
          image: null,
          created: new Date(),
        };

        (prisma.link.create as jest.Mock).mockResolvedValue(mockLink);

        await expect(quantizeUrl(url)).resolves.toBeDefined();
      }
    });
  });

  describe('findByUql', () => {
    it('should find a link by short ID', async () => {
      const uql = 'abc12';
      const mockLink = {
        id: 1,
        uql,
        url: 'http://example.com/long/url',
        title: 'Example',
        description: 'Example Description',
        image: null,
        created: new Date(),
      };

      (prisma.link.findUnique as jest.Mock).mockResolvedValue(mockLink);

      const result = await findByUql(uql);

      expect(result).toEqual(mockLink);
      expect(prisma.link.findUnique).toHaveBeenCalledWith({ where: { uql } });
    });

    it('should return undefined if short ID not found', async () => {
      const uql = 'notfound';

      (prisma.link.findUnique as jest.Mock).mockResolvedValue(undefined);

      const result = await findByUql(uql);

      expect(result).toBeUndefined();
    });

    it('should handle database errors', async () => {
      const uql = 'abc12';
      (prisma.link.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(findByUql(uql)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all links', async () => {
      const mockLinks = [
        {
          id: 1,
          uql: 'abc12',
          url: 'http://example.com/1',
          title: 'Example 1',
          description: 'Description 1',
          image: null,
          created: new Date(),
        },
        {
          id: 2,
          uql: 'def45',
          url: 'http://example.com/2',
          title: 'Example 2',
          description: 'Description 2',
          image: null,
          created: new Date(),
        },
      ];

      (prisma.link.findMany as jest.Mock).mockResolvedValue(mockLinks);

      const result = await findAll();

      expect(result).toEqual(mockLinks);
      expect(prisma.link.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no links exist', async () => {
      (prisma.link.findMany as jest.Mock).mockResolvedValue([]);

      const result = await findAll();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      (prisma.link.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(findAll()).rejects.toThrow('Database error');
    });
  });
});

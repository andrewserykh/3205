import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseSitePayload } from '../../src/services/parser';

jest.mock('axios');
jest.mock('cheerio', () => ({
  load: jest.fn(),
}));

describe('Parser Service', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseSitePayload', () => {
    it('should extract metadata from a valid URL', async () => {
      const mockHtml = `
        <html>
          <head>
            <meta property="og:title" content="Test Title" />
            <meta property="og:description" content="Test Description" />
            <meta property="og:image" content="http://example.com/image.jpg" />
          </head>
        </html>
      `;

      mockAxios.get.mockResolvedValue({ data: mockHtml });

      const mockLoadFn = (html: string) => {
        return ((selector: string) => {
          const selectors: Record<string, any> = {
            'meta[property="og:title"]': {
              attr: jest.fn().mockReturnValue('Test Title'),
            },
            'meta[property="og:description"]': {
              attr: jest.fn().mockReturnValue('Test Description'),
            },
            'meta[name="description"]': {
              attr: jest.fn().mockReturnValue(null),
            },
            'meta[property="og:image"]': {
              attr: jest.fn().mockReturnValue('http://example.com/image.jpg'),
            },
            title: {
              text: jest.fn().mockReturnValue('Test Title'),
            },
          };
          return selectors[selector] || { attr: jest.fn().mockReturnValue(null), text: jest.fn().mockReturnValue(null) };
        }) as any;
      };

      const mockLoad = cheerio.load as jest.MockedFunction<typeof cheerio.load>;
      mockLoad.mockReturnValue(mockLoadFn(mockHtml));

      const result = await parseSitePayload('http://example.com');

      expect(mockAxios.get).toHaveBeenCalledWith('http://example.com', {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        timeout: 5000,
      });
    });

    it('should return null values when metadata is not found', async () => {
      const mockHtml = '<html><head></head></html>';

      mockAxios.get.mockResolvedValue({ data: mockHtml });

      const mockLoadFn = (html: string) => {
        return ((selector: string) => {
          return { attr: jest.fn().mockReturnValue(null), text: jest.fn().mockReturnValue('') };
        }) as any;
      };

      const mockLoad = cheerio.load as jest.MockedFunction<typeof cheerio.load>;
      mockLoad.mockReturnValue(mockLoadFn(mockHtml));

      const result = await parseSitePayload('http://example.com');

      expect(result).toEqual({
        title: null,
        description: null,
        image: null,
      });
    });

    it('should fallback to standard meta tags when og tags are not available', async () => {
      const mockHtml = `
        <html>
          <head>
            <meta name="description" content="Standard Description" />
            <title>Standard Title</title>
          </head>
        </html>
      `;

      mockAxios.get.mockResolvedValue({ data: mockHtml });

      const mockLoadFn = (html: string) => {
        return ((selector: string) => {
          const selectors: Record<string, any> = {
            'meta[property="og:title"]': {
              attr: jest.fn().mockReturnValue(null),
            },
            'meta[property="og:description"]': {
              attr: jest.fn().mockReturnValue(null),
            },
            'meta[name="description"]': {
              attr: jest.fn().mockReturnValue('Standard Description'),
            },
            'meta[property="og:image"]': {
              attr: jest.fn().mockReturnValue(null),
            },
            title: {
              text: jest.fn().mockReturnValue('Standard Title'),
            },
          };
          return selectors[selector] || { attr: jest.fn().mockReturnValue(null), text: jest.fn().mockReturnValue(null) };
        }) as any;
      };

      const mockLoad = cheerio.load as jest.MockedFunction<typeof cheerio.load>;
      mockLoad.mockReturnValue(mockLoadFn(mockHtml));

      const result = await parseSitePayload('http://example.com');

      expect(result.title).toBe('Standard Title');
      expect(result.description).toBe('Standard Description');
    });

    it('should handle network errors gracefully and return null values', async () => {
      mockAxios.get.mockRejectedValue(new Error('Network error'));

      const mockLoadFn = (html: string = '') => {
        return ((selector: string) => {
          return { attr: jest.fn().mockReturnValue(null), text: jest.fn().mockReturnValue(null) };
        }) as any;
      };

      const mockLoad = cheerio.load as jest.MockedFunction<typeof cheerio.load>;
      mockLoad.mockReturnValue(mockLoadFn());

      const result = await parseSitePayload('http://invalid-url.com');

      expect(result).toEqual({
        title: null,
        description: null,
        image: null,
      });
    });

    it('should handle timeout errors gracefully', async () => {
      const timeoutError = new Error('Timeout');
      mockAxios.get.mockRejectedValue(timeoutError);

      const mockLoadFn = (html: string = '') => {
        return ((selector: string) => {
          return { attr: jest.fn().mockReturnValue(null), text: jest.fn().mockReturnValue(null) };
        }) as any;
      };

      const mockLoad = cheerio.load as jest.MockedFunction<typeof cheerio.load>;
      mockLoad.mockReturnValue(mockLoadFn());

      const result = await parseSitePayload('http://slow-url.com');

      expect(result).toEqual({
        title: null,
        description: null,
        image: null,
      });
    });

    it('should set correct User-Agent header', async () => {
      mockAxios.get.mockResolvedValue({ data: '' });

      const mockLoadFn = (html: string = '') => {
        return ((selector: string) => {
          return { attr: jest.fn().mockReturnValue(null), text: jest.fn().mockReturnValue('') };
        }) as any;
      };

      const mockLoad = cheerio.load as jest.MockedFunction<typeof cheerio.load>;
      mockLoad.mockReturnValue(mockLoadFn());

      await parseSitePayload('http://example.com');

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'Mozilla/5.0',
          }),
        })
      );
    });
  });
});

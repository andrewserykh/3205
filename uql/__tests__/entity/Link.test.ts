import type { Link } from '../../src/entity/Link';

describe('Link Type', () => {
  describe('Link object creation', () => {
    it('should create a valid Link object', () => {
      const link: Link = {
        id: 1,
        uql: 'abc12',
        url: 'http://example.com',
        title: 'Example Title',
        description: 'Example Description',
        image: 'http://example.com/image.jpg',
        created: new Date(),
      };

      expect(link.id).toBe(1);
      expect(link.uql).toBe('abc12');
      expect(link.url).toBe('http://example.com');
      expect(link.title).toBe('Example Title');
      expect(link.description).toBe('Example Description');
      expect(link.image).toBe('http://example.com/image.jpg');
      expect(link.created).toBeInstanceOf(Date);
    });

    it('should have required properties', () => {
      const link: Link = {
        id: 1,
        uql: 'abc12',
        url: 'http://example.com',
        title: 'Example Title',
        description: 'Example Description',
        image: 'http://example.com/image.jpg',
        created: new Date(),
      };

      expect(link.id).toBeDefined();
      expect(link.uql).toBeDefined();
      expect(link.url).toBeDefined();
      expect(link.created).toBeDefined();
    });

    it('should allow nullable metadata fields', () => {
      const link: Link = {
        id: 1,
        uql: 'abc12',
        url: 'http://example.com',
        title: null,
        description: null,
        image: null,
        created: new Date(),
      };

      expect(link.title).toBeNull();
      expect(link.description).toBeNull();
      expect(link.image).toBeNull();
    });

    it('should handle long descriptions', () => {
      const longDescription = 'A'.repeat(1000);
      const link: Link = {
        id: 1,
        uql: 'abc12',
        url: 'http://example.com',
        title: 'Test',
        description: longDescription,
        image: null,
        created: new Date(),
      };

      expect(link.description).toBe(longDescription);
      expect(link.description!.length).toBe(1000);
    });

    it('should allow setting all properties', () => {
      const testDate = new Date('2024-01-01');
      const link: Link = {
        id: 42,
        uql: 'test1',
        url: 'https://test.example.com',
        title: 'Test Title',
        description: 'Test Description',
        image: 'https://example.com/test.jpg',
        created: testDate,
      };

      expect(link.id).toBe(42);
      expect(link.uql).toBe('test1');
      expect(link.url).toBe('https://test.example.com');
      expect(link.title).toBe('Test Title');
      expect(link.description).toBe('Test Description');
      expect(link.image).toBe('https://example.com/test.jpg');
      expect(link.created).toEqual(testDate);
    });
  });

  describe('Link validation', () => {
    it('should have valid uql values', () => {
      const validUqlValues = ['abc', 'abc123', 'a', '0123456789'];

      for (const uql of validUqlValues) {
        const link: Link = {
          id: 1,
          uql,
          url: 'http://example.com',
          title: null,
          description: null,
          image: null,
          created: new Date(),
        };
        expect(link.uql).toBe(uql);
      }
    });

    it('should have valid URL formats', () => {
      const validUrls = [
        'http://example.com',
        'https://example.com',
        'http://example.com/path',
        'https://example.com:8080/path?query=1',
        'http://sub.example.co.uk',
      ];

      for (const url of validUrls) {
        const link: Link = {
          id: 1,
          uql: 'test',
          url,
          title: null,
          description: null,
          image: null,
          created: new Date(),
        };
        expect(link.url).toBe(url);
      }
    });
  });
});

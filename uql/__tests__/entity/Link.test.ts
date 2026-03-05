import { Link } from '../../src/entity/Link';

describe('Link Entity', () => {
  describe('Link instantiation', () => {
    it('should create a new Link instance', () => {
      const link = new Link();
      expect(link).toBeInstanceOf(Link);
    });

    it('should have required properties', () => {
      const link = new Link();
      link.id = 1;
      link.uql = 'abc12';
      link.url = 'http://example.com';
      link.title = 'Example Title';
      link.description = 'Example Description';
      link.image = 'http://example.com/image.jpg';
      link.created = new Date();

      expect(link.id).toBe(1);
      expect(link.uql).toBe('abc12');
      expect(link.url).toBe('http://example.com');
      expect(link.title).toBe('Example Title');
      expect(link.description).toBe('Example Description');
      expect(link.image).toBe('http://example.com/image.jpg');
      expect(link.created).toBeInstanceOf(Date);
    });

    it('should allow nullable metadata fields', () => {
      const link = new Link();
      link.id = 1;
      link.uql = 'abc12';
      link.url = 'http://example.com';
      link.title = null;
      link.description = null;
      link.image = null;

      expect(link.title).toBeNull();
      expect(link.description).toBeNull();
      expect(link.image).toBeNull();
    });

    it('should handle long descriptions', () => {
      const link = new Link();
      const longDescription = 'A'.repeat(1000);
      link.description = longDescription;

      expect(link.description).toBe(longDescription);
      expect(link.description.length).toBe(1000);
    });

    it('should allow setting all properties', () => {
      const link = new Link();
      const testDate = new Date('2024-01-01');

      link.id = 42;
      link.uql = 'test1';
      link.url = 'https://test.example.com';
      link.title = 'Test Title';
      link.description = 'Test Description';
      link.image = 'https://example.com/test.jpg';
      link.created = testDate;

      expect(link.id).toBe(42);
      expect(link.uql).toBe('test1');
      expect(link.url).toBe('https://test.example.com');
      expect(link.title).toBe('Test Title');
      expect(link.description).toBe('Test Description');
      expect(link.image).toBe('https://example.com/test.jpg');
      expect(link.created).toEqual(testDate);
    });

    it('should handle empty string values', () => {
      const link = new Link();
      link.title = '';
      link.description = '';
      link.image = '';

      expect(link.title).toBe('');
      expect(link.description).toBe('');
      expect(link.image).toBe('');
    });

    it('should handle undefined metadata', () => {
      const link = new Link();
      link.id = 1;
      link.uql = 'abc12';
      link.url = 'http://example.com';

      // These should be undefined initially
      expect(link.title).toBeUndefined();
      expect(link.description).toBeUndefined();
      expect(link.image).toBeUndefined();
    });
  });

  describe('Link validation', () => {
    it('should have valid uql values', () => {
      const validUqlValues = ['abc', 'abc123', 'a', '0123456789'];

      for (const uql of validUqlValues) {
        const link = new Link();
        link.uql = uql;
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
        const link = new Link();
        link.url = url;
        expect(link.url).toBe(url);
      }
    });
  });
});

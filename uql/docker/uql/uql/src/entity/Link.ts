// Link type for use with Prisma
// The actual schema is defined in prisma/schema.prisma
export type Link = {
  id: number;
  uql: string;
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  created: Date;
};

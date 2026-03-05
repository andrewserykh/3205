import { AppDataSource } from "../data-source";
import { Link } from "../entity/Link";
import { parseSitePayload } from "./parser";
import { nanoid } from "nanoid";

const linkRepository = AppDataSource.getRepository(Link);

export async function createShortLink(url: string): Promise<Link> {
  const sitePayload = await parseSitePayload(url);

  const uql = nanoid(6);

  const link = new Link();
  link.uql = uql;
  link.url = url;
  link.title = sitePayload.title;
  link.description = sitePayload.description;
  link.image = sitePayload.image;

  await linkRepository.save(link);

  return link;
}

export async function findByShortId(uql: string): Promise<Link | null> {
  const link = await linkRepository.findOne({
    where: { uql },
  });
  return link || null;
}

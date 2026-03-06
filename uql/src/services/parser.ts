import axios from "axios";
import * as cheerio from "cheerio";

export interface SitePayload {
  title: string | null;
  description: string | null;
  image: string | null;
}

/**
 * Parses website and extracts meta (title, description, image)
 * @param {string} url - URL
 * @returns {Promise<SitePayload>} Some Open Graph meta tags
 */
export async function parseSitePayload(url: string): Promise<SitePayload> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 5000,
    });

    const $ = cheerio.load(response.data);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      null;

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      null;

    const image = $('meta[property="og:image"]').attr("content") || null;

    return {
      title,
      description,
      image,
    };
  } catch (error) {
    throw new Error(`Failed to fetch site data: ${error.message}`);
  }
}

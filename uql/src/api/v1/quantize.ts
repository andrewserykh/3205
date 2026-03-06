import { Router } from 'express';
import logger from '../../services/logger';
import { quantizeUrl, findByUql, findAll } from '../../services/quantize.service';

const router = Router();

router.post('',
  async (req, res) => {
    
      if (!req.body || Object.keys(req.body).length === 0){
        logger.error('Empty request body');
        return res.status(400).json({
          error: 'Empty request body',
          message: 'Request body cannot be empty'
        });
      }


      if (!req.body.hasOwnProperty('url')){
        logger.error('Missing "url" field in request body');
        return res.status(400).json({
          error: 'Invalid request format',
          message: 'Missing required field: url'
        });
      }

      if (typeof req.body.url !== 'string' || req.body.url.trim() === ''){
        logger.error('Invalid "url" field: must be a non-empty string');
        return res.status(400).json({
          error: 'Invalid request format',
          message: 'Field "url" must be a non-empty string'
        });

      }

    try {
      const result = await quantizeUrl(req.body.url);
      logger.info(`URL quantized successfully: ${result.uql} for original URL: ${req.body.url}`);
      res.status(201).json({
        uql: result.uql,
        shortUrl: `http://${global.host}:${global.port}/${result.uql}`,
        meta: {
          title: result.title,
          description: result.description,
          image: result.image,
        }
      });


    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid URL format') {
        logger.error(`Invalid URL format: ${req.body.url}`);
        return res.status(400).json({
          error: 'Invalid URL format',
          message: 'The provided URL is not valid'
        });
      }
      logger.error(error, 'Error during URL quantization');
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

router.get('', async (req, res) => {
  try {
    const links = await findAll();
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve links' });
  }
});

router.get("/:uql", async (req, res) => {
  try {
    const { uql } = req.params;
    const link = await findByUql(uql);

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.status(200).json({
      uql: link.uql,
      url: link.url,
      meta: {
        title: link.title,
        description: link.description,
        image: link.image,
      }
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve link" });
  }
});

export default router;
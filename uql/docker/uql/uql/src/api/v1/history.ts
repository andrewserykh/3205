import { Router } from 'express';
import logger from '../../services/logger';
import { findAll, findLastN } from '../../services/quantize.service';

const router = Router();

router.get('', async (req, res) => {
  try {
    const links = await findAll();
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve links' });
  }
});

router.get("/:limit", async (req, res) => {
  try {
    const { limit } = req.params;
    const limitNumber = parseInt(limit, 10);

    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ error: 'Limit must be a positive number' });
    }

    const links = await findLastN(limitNumber);
    res.status(200).json(links);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve links" });
  }
});

export default router;
import { Router } from 'express';
import logger from '../services/logger';
import { quantizeUrl, findByShortId } from '../services/quantize.service';

const router = Router();

router.get("/:uql", async (req, res) => {
  try {
    const { uql } = req.params;
    const link = await findByShortId(uql);

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.redirect(301, link.url);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to redirect" });
  }
});

export default router;
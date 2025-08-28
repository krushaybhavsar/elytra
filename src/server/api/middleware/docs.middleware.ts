import { Request, Response, Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const docsRouter = Router();

docsRouter.use('/docs', swaggerUi.serve, (req: Request, res: Response) => {
  import('../docs/swagger.json').then((swaggerDoc) => {
    res.send(swaggerUi.generateHTML(swaggerDoc));
  });
});

export { docsRouter as docs };

import type { Request, Response } from 'express';
import { NotFoundError } from '@/errors';
import { serverError } from '@/http/respond';
import { getRoute, listRoutes } from '@/repositories/routeStore';

export async function listRoutesController(_req: Request, res: Response) {
  try {
    return res.status(200).json(await listRoutes());
  } catch (error) {
    return serverError(res, error, 'routes/list');
  }
}

export async function getRouteController(req: Request, res: Response) {
  const id = typeof req.params.id === 'string' ? req.params.id : '';

  try {
    return res.status(200).json(await getRoute(id));
  } catch (error) {
    if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
    return serverError(res, error, 'routes/get');
  }
}

import type { Request, Response } from 'express';
import { handleError, readString } from '@/http/respond';
import { getRoute, listRoutes } from '@/repositories/routeStore';

export async function listRoutesController(_req: Request, res: Response) {
  try {
    return res.status(200).json(await listRoutes());
  } catch (error) {
    return handleError(res, error, 'routes/list');
  }
}

export async function getRouteController(req: Request, res: Response) {
  try {
    return res.status(200).json(await getRoute(readString(req.params.id)));
  } catch (error) {
    return handleError(res, error, 'routes/get');
  }
}

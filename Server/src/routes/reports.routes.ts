import { Router, RequestHandler } from "express";
import {
  getAverageCloseTime,
  getTopClosers,
  getCallsByCategory,
  getStatusPie,
} from "../controllers/reports.controller";
import { verifyJWT } from "../middlewares/JTW.middleware";

export const reportsRouter: Router = Router();

reportsRouter.get("/calls/avg-close-time", verifyJWT as RequestHandler, getAverageCloseTime);
reportsRouter.get("/calls/top-closers", verifyJWT as RequestHandler, getTopClosers);
reportsRouter.get("/calls/by-category", verifyJWT as RequestHandler, getCallsByCategory);
reportsRouter.get("/calls/status-pie", verifyJWT as RequestHandler, getStatusPie);

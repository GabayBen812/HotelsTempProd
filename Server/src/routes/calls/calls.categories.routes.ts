import { Router, RequestHandler } from "express";
import { Action } from "@prisma/client";

import { verifyJWT } from "../../middlewares/JTW.middleware";
import { attachPermissionScopes } from "../../middlewares/permission.middleware";
import {
  createNewCallCategory,
  getCallCategories,
  deleteCategory,
  updateCategory,
  upsertCallCategories,
} from "../../controllers/calls/calls.categories.controller";

const router = Router();
const withPermission = (resource: string, action: Action): RequestHandler[] => [
  verifyJWT as RequestHandler,
  attachPermissionScopes(resource, action) as RequestHandler,
];

router.post(
  "/",
  withPermission("callCategories", "create"),
  createNewCallCategory
);
router.get("/", withPermission("callCategories", "view"), getCallCategories);
router.delete(
  "/:id",
  withPermission("callCategories", "delete"),
  deleteCategory
);
router.put("/:id", withPermission("callCategories", "update"), updateCategory);
router.post(
  "/upsert",
  withPermission("callCategories", "update"),
  upsertCallCategories
);

export default router;

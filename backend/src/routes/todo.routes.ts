import { Router } from "express";
import * as todoController from "../controllers/todo.controller";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../middlewares/auth.middleware";
import { createTodoSchema, updateTodoSchema } from "shared";

const router = Router();

router.use(requireAuth)

router.get(
  "/",
  asyncHandler(todoController.getAll)
);

router.get(
  "/:id",
  asyncHandler(todoController.getById)
);

router.post(
  "/",
  validate(createTodoSchema),
  asyncHandler(todoController.create)
);

router.patch(
  "/:id",
  validate(updateTodoSchema),
  asyncHandler(todoController.update)
);

router.delete(
  "/:id",
  asyncHandler(todoController.remove)
);

export default router;

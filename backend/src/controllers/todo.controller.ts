import type { Request, Response } from "express";
import type { CreateTodoInput, UpdateTodoInput } from "shared";
import * as todoService from "../services/todo.service.js";

// TODO: убрать после реализации авторизации
const TEMP_USER_ID = 1

export const getAll = async (_req: Request, res: Response) => {
  const todos = await todoService.getAll(TEMP_USER_ID);
  res.json(todos);
}

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = await todoService.getById(id, TEMP_USER_ID);
  res.json(todo);
}

export const create = async (req: Request, res: Response) => {
  const input = req.body as CreateTodoInput;
  const todo = await todoService.create(TEMP_USER_ID, input);
  res.status(201).json(todo);
}

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const input = req.body as UpdateTodoInput;
  const todo = await todoService.update(id, TEMP_USER_ID, input);
  res.json(todo);
}

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await todoService.remove(id, TEMP_USER_ID);
  res.status(204).end();
}

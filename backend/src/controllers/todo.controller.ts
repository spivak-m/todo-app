import type { Request, Response } from "express";
import type { CreateTodoInput, UpdateTodoInput } from "shared";
import * as todoService from "../services/todo.service.js";

export const getAll = async (req: Request, res: Response) => {
  const todos = await todoService.getAll(req.user!.id);
  res.json(todos);
}

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = await todoService.getById(id, req.user!.id);
  res.json(todo);
}

export const create = async (req: Request, res: Response) => {
  const input = req.body as CreateTodoInput;
  const todo = await todoService.create(req.user.id!, input);
  res.status(201).json(todo);
}

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const input = req.body as UpdateTodoInput;
  const todo = await todoService.update(id, req.user!.id, input);
  res.json(todo);
}

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await todoService.remove(id, req.user!.id);
  res.status(204).end();
}

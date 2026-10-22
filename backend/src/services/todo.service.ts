import type { CreateTodoInput, UpdateTodoInput } from "shared";
import * as todoRepository from "../repositories/todo.repository";
import { HttpError } from "../utils/HttpError.js";

export function getAll(userId: number) {
  return todoRepository.findAllByUser(userId);
}

export async function getById(id: number, userId: number) {
  const result = await todoRepository.findById(id, userId);
  if(!result) throw new HttpError(404, 'Todo not found');
  return result;
}

export function create(userId: number, input: CreateTodoInput) {
  return todoRepository.create(userId, input)
}

export async function update(id: number, userId: number, input: UpdateTodoInput) {
  // Проверяем, что запись существует
  const existing = await todoRepository.findById(id, userId);
  if(!existing) throw new HttpError(404, 'Todo not found');

  // Обновляем запись
  const updated = await todoRepository.update(id, userId, input);
  if(!updated) throw new HttpError(500, 'Failed to update todo');
  return updated;
}

export async function remove(id: number, userId: number) {
  const removed = await todoRepository.remove(id, userId);
  if (!removed) throw new HttpError(404, 'Todo not found');
}

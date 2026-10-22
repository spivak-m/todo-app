// Кастомный класс для ошибок с HTTP-статусом
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

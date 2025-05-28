export function generateId(): number {
    return Number(Math.random().toString(36).substring(2, 11));
  }
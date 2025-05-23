export const privacyInterpretation: Record<string, string> = {
    close: "Закрыта",
    open: "Открыта"
  };

export const dateInterpretation = (date: string) => {
  const tempCreatedAt = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(tempCreatedAt.getDate())}.${pad(tempCreatedAt.getMonth() + 1)}.${tempCreatedAt.getFullYear()}`;
};

export const requestWordInterpretation = (requestsCount: number) =>{
    if (requestsCount === 1) {
      return 'заявка'
    }
    else if (requestsCount > 1 && requestsCount < 5) {
      return 'заявки'
    }
    else {
      return 'заявок'
    }
  }
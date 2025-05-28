export const privacyInterpretation: Record<string, string> = {
    close: "Закрыта",
    open: "Открыта"
  };

export const dateInterpretation = (date: string) => {
  const tempCreatedAt = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(tempCreatedAt.getDate())}.${pad(tempCreatedAt.getMonth() + 1)}.${tempCreatedAt.getFullYear()}`;
};

export const sharedDateInterpretation = (date: string) => {
  const tempCreatedAt = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(tempCreatedAt.getDate())}.${pad(tempCreatedAt.getMonth() + 1)}.${tempCreatedAt.getFullYear()} ${pad(tempCreatedAt.getHours())}:${pad(tempCreatedAt.getMinutes())}`;
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

export const requestsCategoryInterpretation = {
  'to-team': 'вступление в команду',
  'create-team': 'создание команды',
  'to-project': 'назначение проекта',
  'create-project': 'создание проекта'
}

export const statusInterpretation = {
  'pending': 'на рассмотрении',
  'approved': 'одобрено',
  'rejected': 'отклонено'
}
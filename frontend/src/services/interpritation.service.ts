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

export const formatSmartDate = (dateString: string): string => {
  // Приводим входную дату к локальному времени
  const date = new Date(dateString);
  const now = new Date();
  
  // Корректируем даты на разницу в часовом поясе
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  const localNow = new Date(now.getTime() - timezoneOffset);

  const pad = (num: number): string => num.toString().padStart(2, '0');

  // Сравниваем даты с учётом локального времени
  const isToday = 
    localDate.getDate() === localNow.getDate() &&
    localDate.getMonth() === localNow.getMonth() &&
    localDate.getFullYear() === localNow.getFullYear();
  
  const isCurrentYear = localDate.getFullYear() === localNow.getFullYear();
  
  if (isToday) {
    return `${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
  } else if (isCurrentYear) {
    return `${pad(localDate.getDate())}.${pad(localDate.getMonth() + 1)}`;
  } else {
    return `${pad(localDate.getDate())}.${pad(localDate.getMonth() + 1)}.${localDate.getFullYear()}`;
  }
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

export const participantsInterpritaion = (count: number) => {
    if (count % 10 === 1 && (count % 100 < 10 || count % 100 > 20)) {
      return 'участник'
    }
    else if (count % 10 > 1 && count % 10 < 5 && (count % 100 < 10 || count % 100 > 20)) {
      return 'участника'
    }
    else {
      return 'участников'
    }
}
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
  const date = new Date(dateString);
  const newHours = date.getHours() + 5
  date.setHours(newHours)
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } else if (isCurrentYear) {
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  } else {
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
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
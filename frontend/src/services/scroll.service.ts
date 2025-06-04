export const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = document.querySelector('.messages-container');
    if (!container) return;
  
    // Проверяем, находится ли пользователь внизу (с небольшим запасом в 100px)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  
    if (isAtBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior
      });
    }
  };

  export const scrollToBottomInstant = () => {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };
export default {
  profile: {
    field: {
      picture: 'Выберите изображение',
      name: 'Имя или название',
      description: 'Описание',
      specialization: 'Специлизация',
      category: 'Сфера деятельности',
      autoConfirm: 'Автоподтверждение брони',
    },
    hint: {
      picture: 'Подойдет фото в формате .jpg или .png',
      name: '',
      description: '',
      specialization: 'Кто вы в двух словах: мастер маникюра, юрист, слесарь, белый маг итд...',
      category: '',
      autoConfirm_y: 'Бронь будет подтверждаться автоматически',
      autoConfirm_n: 'Вы будете подтверждать бронь вручную',
    },
    placeholder: {
      picture: 'Выберите изображение',
      name: 'Пишите тут..',
      description: 'Пишите тут..',
      specialization: 'Пишите тут...',
      category: 'Выберите подходящую...',
      autoConfirm: 'Автоподтверждение брони',
    },
    error: {
      name: 'Без имени  или названия никак',
      description: 'Без описания тоже не очень',
      category: 'Сфера деятельности тоже нужна'
    }
  },
  service: {
    field: {
      name: 'Название',
      description: 'Описание',
      price: 'Цена',
      isOnline: 'Онлайн услуга',
      isVisits: 'Есть выезд',
      duration: 'Длительность',
      allDay: 'Занимает целый день'
    },
    hint: {
      name: '',
      description: '',
      price: '',
      isOnline_y: 'Видеозвонок в Zoom или подобном сервисе',
      isOnline_n: 'Видеозвонок в Zoom или подобном сервисе',
      isVisits_y: 'Не забудте учесть в слотах время на дорогу',
      isVisits_n: '',
      duration: '',
      allDay: 'Будем бронировать доступные слоты на весь день'
    },
    placeholder: {
      name: 'Пишите тут...',
      description: 'Пишите тут...',
      duration: 'Пишите тут...',
      price: 'Пишите тут...',
    },
    error: {
      name: 'Без названия никак',
      duration: 'Надо знать сколько времени займет услуга',
      price: 'Хотя бы один рубль, но не больше миллиона',
    },
  },
  booking: {
    field: {
      comment: 'Комментарий'
    },
    placeholder: {
      comment: 'Комментарий к записи'
    }
  },
  feedback: {
    field: {
      text: 'Напишите пару слов',
      isAnonymous: 'Анонимно',
    },
    hint: {
      text: '',
      isAnonymous: 'Никому не расскажем, что это вы'
    },
    placeholder: {
      text: 'Пишите тут...'
    }
  }
}
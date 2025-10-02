export default {
  profile: {
    field: {
      picture: 'Выберите изображение',
      name: 'Имя или название',
      description: 'Описание',
      specialization: 'Специлизация',
      category: 'Сфера деятельности',
      country: 'Страна',
      mapLink: 'Ссылка на картах Яндекс/Google/Apple',
      address: 'Адрес'
    },
    hint: {
      picture: 'Подойдет фото в формате .jpg или .png',
      name: '',
      description: '',
      country: 'Выбирайте ту страну, в которой находятся ваши клиенты',
      specialization: 'Кто вы в двух словах: мастер маникюра, юрист, слесарь, белый маг итд...',
      category: '',
      mapLink: 'Клиенты найдут вас на карте просто кликнув на ссылку. ',
      mapLink_link: 'Где взять ссылку >',
      address: 'Если есть адрес, напишите его начиная с города. Мы покажем его в профиле.'
    },
    placeholder: {
      picture: 'Выберите изображение',
      name: 'Пишите тут..',
      description: 'Пишите тут..',
      specialization: 'Пишите тут...',
      address: 'Пишите тут...',
      country: 'Выберите страну...',
      category: 'Выберите подходящую...',
      mapLink: 'Вставьте сюда...'
    },
    error: {
      name: 'Без имени  или названия никак',
      description: 'Без описания тоже не очень',
      category: 'Сфера деятельности тоже нужна',
      country: 'Выберите страну оказания услуг',
      mapLink: 'Ссылка должна начинаться с https://'
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
      allDay: 'Занимает целый день',
      autoConfirm: 'Автоподтверждение записи',
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
      allDay: 'Будем бронировать доступные слоты на весь день',
      autoConfirm_y: 'Запись будет подтверждаться автоматически',
      autoConfirm_n: 'Вы будете подтверждать запись вручную',
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
      price: 'Если услуга бесплатная, оставьте 0, иначе нужна цена',
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
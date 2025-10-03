import service from "./service";

export default {
  alert: {
    booking: {
      success_pending: 'Отправили запись, надо подождать подтверждения.',
      success_auto: 'Все ОК, вы успешно записались на услугу.',
      failed: ':( Не получилось отправить запись.'
    },
    payment: {
      status_paid: 'Готово! Мы получили платеж.',
      status_failed: ':( Не удается провести оплату.',
      status_cancelled: ':( Платеж отменен.'
    },
    trial: {
      status_success: 'У вас 14 дней, развлекайтесь на полную.',
      status_failed: ':( Не получилось, напишите в поддержку.',
    },
    profile: {
      save: {
        success_toservices: 'Супер! Теперь у вас есть профиль. Осталось добавить услуги.',
        success_toprofile: 'Готово! Мы поменяли профиль, вот как он теперь выглядит.',
        failed: ':( Не удалось сохранить профиль.',
      },
      sended: 'Отправили профиль в чат, можете закрепить в канале или отправить.'
    },
    service: {
      save: {
        success: 'Готово! Мы сохранили услугу.',
        failed: ':( Не удалось сохранить услугу.',
      }
    },
    feedback: {
      save: {
        success: 'Готово! Мы отправили отзыв.',
        failed: ':( Не удалось отправить отзыв.',
      }
    },
    meetLink_saved: 'Готово! Мы сохранили ссылку.',
    meetLink_copied: 'Ссылка скопирована в буффер.',
  },
  confirm: {
    profile_map: 'Открыть ссылку с картой?',
    booking_confirm: 'Подтвердить запись?',
    booking_cancel: 'Отменить запись?',
    service_remove: 'Точно удалить?',
  }
}
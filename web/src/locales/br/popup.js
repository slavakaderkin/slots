export default {
  alert: {
    booking: {
      success_pending: 'Agendamento enviado, aguardando confirmação.',
      success_auto: 'Tudo OK, você agendou o serviço com sucesso.',
      success_self: 'Pronto! Você agendou um cliente com sucesso',
      failed: ':( Não foi possível enviar o agendamento.',
      haveActiveToday: 'Você já tem um agendamento para hoje.',
      youAreBanned: 'Este profissional bloqueou você',
    },
    payment: {
      status_paid: 'Pronto! Recebemos seu pagamento.',
      status_failed: ':( Não foi possível processar o pagamento.',
      status_cancelled: ':( Pagamento cancelado.'
    },
    client: {
      blocked: 'Cliente bloqueado',
      unblocked: 'Cliente desbloqueado',
    },
    trial: {
      status_success: 'Você tem 14 dias, aproveite ao máximo.',
      status_failed: ':( Não foi possível, entre em contato com o suporte.',
    },
    profile: {
      save: {
        success_toservices: 'Ótimo! Agora você tem um perfil. Só falta adicionar serviços.',
        success_toprofile: 'Pronto! Atualizamos seu perfil, veja como ficou.',
        failed: ':( Não foi possível salvar o perfil.',
      },
      sended: 'Perfil enviado no chat, você pode fixar no canal ou encaminhar.',
      copied: 'Link do perfil copiado para a área de transferência.',
    },
    service: {
      save: {
        success: 'Pronto! Salvamos o serviço.',
        failed: ':( Não foi possível salvar o serviço.',
      }
    },
    feedback: {
      save: {
        success: 'Pronto! Enviamos sua avaliação.',
        failed: ':( Não foi possível enviar a avaliação.',
      }
    },
    subscription: {
      cancelled: 'Renovação da assinatura cancelada'
    },
    meetLink_saved: 'Pronto! Salvamos o link.',
    meetLink_copied: 'Link copiado para a área de transferência.',
  },
  confirm: {
    profile_map: 'Abrir link do mapa?',
    booking_confirm: 'Confirmar agendamento?',
    booking_cancel: 'Cancelar agendamento?',
    service_remove: 'Tem certeza que deseja excluir?',
    subscription_cancel: 'Cancelar assinatura?',
    client_block: 'Bloquear cliente?',
  }
}

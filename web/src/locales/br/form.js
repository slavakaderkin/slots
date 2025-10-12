export default {
  profile: {
    field: {
      picture: 'Escolha uma imagem',
      name: 'Nome ou título',
      description: 'Descrição',
      specialization: 'Especialização',
      category: 'Área de atuação',
      country: 'País',
      mapLink: 'Link no Google Maps/Yandex/etc',
      address: 'Endereço',
      slotDuration: 'Duração do horário',
    },
    hint: {
      picture: 'Formatos JPG ou PNG são aceitos',
      name: '',
      description: '',
      country: 'Escolha o país onde seus clientes estão localizados ou você está.',
      specialization: 'Quem você é em duas palavras: manicure, advogado, encanador, mágico, etc...',
      category: '',
      mapLink: 'Clientes podem encontrar você no mapa clicando no link. ',
      mapLink_link: 'Onde conseguir o link >',
      address: 'Se você tem um endereço, escreva começando pela cidade. Vamos mostrar no perfil.',
      slotDuration: 'Por padrão, um horário é de uma hora, mas pode reduzir para meia hora. Se os serviços forem mais longos - sem problema, o sistema vai considerar.'
    },
    placeholder: {
      picture: 'Escolha uma imagem',
      name: 'Escreva aqui...',
      description: 'Escreva aqui...',
      specialization: 'Escreva aqui...',
      address: 'Escreva aqui...',
      country: 'Selecione o país...',
      category: 'Selecione a área...',
      mapLink: 'Cole aqui...'
    },
    error: {
      name: 'Nome ou título é obrigatório',
      description: 'Descrição também é necessária',
      category: 'Área de atuação também é necessária',
      country: 'Selecione o país de prestação de serviços',
      mapLink: 'O link deve começar com https://'
    }
  },
  service: {
    field: {
      name: 'Nome',
      description: 'Descrição',
      price: 'Preço',
      isOnline: 'Serviço online',
      isVisits: 'Atendimento a domicílio',
      duration: 'Duração',
      allDay: 'Ocupa o dia todo',
      autoConfirm: 'Confirmação automática do agendamento',
    },
    hint: {
      name: '',
      description: '',
      price: '',
      isOnline_y: 'Videchamada no Zoom ou serviço similar.',
      isOnline_n: 'Videchamada no Zoom ou serviço similar.',
      isVisits_y: 'Não esqueça de considerar o tempo de deslocamento nos horários.',
      isVisits_n: '',
      duration: '',
      allDay: 'Vamos reservar horários disponíveis para o dia todo.',
      autoConfirm_y: 'O agendamento será confirmado automaticamente.',
      autoConfirm_n: 'Você confirmará o agendamento manualmente.',
    },
    placeholder: {
      name: 'Escreva aqui...',
      description: 'Escreva aqui...',
      duration: 'Escreva aqui...',
      price: 'Escreva aqui...',
    },
    error: {
      name: 'Nome é obrigatório',
      duration: 'Precisa saber quanto tempo o serviço leva.',
      price: 'Se o serviço for gratuito, deixe 0, caso contrário é necessário o preço.',
    },
  },
  booking: {
    field: {
      comment: 'Comentário'
    },
    placeholder: {
      comment: 'Comentário para o agendamento'
    }
  },
  feedback: {
    field: {
      text: 'Escreva algumas palavras',
      isAnonymous: 'Anônimo',
    },
    hint: {
      text: '',
      isAnonymous: 'Não vamos contar para ninguém que foi você.'
    },
    placeholder: {
      text: 'Escreva aqui...'
    }
  }
}

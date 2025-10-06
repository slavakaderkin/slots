export default {
  profile: {
    field: {
      picture: 'Scegli immagine',
      name: 'Nome o titolo',
      description: 'Descrizione',
      specialization: 'Specializzazione',
      category: 'Settore di attività',
      country: 'Paese',
      mapLink: 'Link su mappe Yandex/Google/ecc',
      address: 'Indirizzo',
      slotDuration: 'Durata slot',
    },
    hint: {
      picture: 'Va bene formato JPG o PNG',
      name: '',
      description: '',
      country: 'Scegli il paese dove si trovano i tuoi clienti o tu.',
      specialization: 'Chi sei in due parole: estetista, avvocato, idraulico, mago, ecc...',
      category: '',
      mapLink: 'I clienti possono trovarti sulla mappa cliccando sul link.',
      mapLink_link: 'Dove trovare il link >',
      address: 'Se hai un indirizzo, scrivilo partendo dalla città. Lo mostreremo nel profilo.',
      slotDuration: 'Per default uno slot è di un\'ora, ma puoi ridurlo a mezz\'ora. Se i servizi sono più lunghi di un\'ora - nessun problema, il sistema lo terrà in considerazione.'
    },
    placeholder: {
      picture: 'Scegli immagine',
      name: 'Scrivi qui...',
      description: 'Scrivi qui...',
      specialization: 'Scrivi qui...',
      address: 'Scrivi qui...',
      country: 'Seleziona paese...',
      category: 'Seleziona settore...',
      mapLink: 'Incolla qui...'
    },
    error: {
      name: 'Nome o titolo obbligatorio',
      description: 'Anche la descrizione è necessaria',
      category: 'Anche il settore di attività è necessario',
      country: 'Seleziona il paese di erogazione servizi',
      mapLink: 'Il link deve iniziare con https://'
    }
  },
  service: {
    field: {
      name: 'Nome',
      description: 'Descrizione',
      price: 'Prezzo',
      isOnline: 'Servizio online',
      isVisits: 'Servizio a domicilio',
      duration: 'Durata',
      allDay: 'Occupa tutta la giornata',
      autoConfirm: 'Conferma automatica prenotazione',
    },
    hint: {
      name: '',
      description: '',
      price: '',
      isOnline_y: 'Videochiamata su Zoom o servizio simile.',
      isOnline_n: 'Videochiamata su Zoom o servizio simile.',
      isVisits_y: 'Non dimenticare di considerare il tempo di viaggio negli slot.',
      isVisits_n: '',
      duration: '',
      allDay: 'Prenoteremo gli slot disponibili per l\'intera giornata.',
      autoConfirm_y: 'La prenotazione sarà confermata automaticamente.',
      autoConfirm_n: 'Confermerai la prenotazione manualmente.',
    },
    placeholder: {
      name: 'Scrivi qui...',
      description: 'Scrivi qui...',
      duration: 'Scrivi qui...',
      price: 'Scrivi qui...',
    },
    error: {
      name: 'Nome obbligatorio',
      duration: 'Devi sapere quanto tempo richiede il servizio.',
      price: 'Se il servizio è gratuito, lascia 0, altrimenti è necessario il prezzo.',
    },
  },
  booking: {
    field: {
      comment: 'Commento'
    },
    placeholder: {
      comment: 'Commento per la prenotazione'
    }
  },
  feedback: {
    field: {
      text: 'Scrivi due parole',
      isAnonymous: 'Anonimo',
    },
    hint: {
      text: '',
      isAnonymous: 'Non diremo a nessuno che sei tu.'
    },
    placeholder: {
      text: 'Scrivi qui...'
    }
  }
}

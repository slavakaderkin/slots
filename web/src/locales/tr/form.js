export default {
  profile: {
    field: {
      picture: 'Resim seçin',
      name: 'İsim veya unvan',
      description: 'Açıklama',
      specialization: 'Uzmanlık',
      category: 'Faaliyet alanı',
      country: 'Ülke',
      mapLink: 'Google/vb haritalarda bağlantı',
      address: 'Adres',
      slotDuration: 'Zaman aralığı adımı',
    },
    hint: {
      picture: 'JPG veya PNG formatı uygundur',
      name: '',
      description: '',
      country: 'Müşterilerinizin bulunduğu veya sizin bulunduğunuz ülkeyi seçin.',
      specialization: 'İki kelimeyle kimsiniz: manikürcü, avukat, tesisatçı, sihirbaz vb...',
      category: '',
      mapLink: 'Müşterileriniz bağlantıya tıklayarak sizi haritada bulabilir. ',
      mapLink_link: 'Bağlantıyı nereden alırım >',
      address: 'Adresiniz varsa, şehirden başlayarak yazın. Profilde göstereceğiz.',
      slotDuration: 'Varsayılan olarak bir aralık bir saattir, ancak yarım saate kadar daraltabilirsiniz. Hizmetler bir saatten uzunsa - sorun değil, sistem bunu hesaba katacaktır.'
    },
    placeholder: {
      picture: 'Resim seçin',
      name: 'Buraya yazın...',
      description: 'Buraya yazın...',
      specialization: 'Buraya yazın...',
      address: 'Buraya yazın...',
      country: 'Ülke seçin...',
      category: 'Alan seçin...',
      mapLink: 'Buraya yapıştırın...'
    },
    error: {
      name: 'İsim veya unvan gerekli',
      description: 'Açıklama da gerekli',
      category: 'Faaliyet alanı da gerekli',
      country: 'Hizmet verilen ülkeyi seçin',
      mapLink: 'Bağlantı https:// ile başlamalı'
    }
  },
  service: {
    field: {
      name: 'İsim',
      description: 'Açıklama',
      price: 'Fiyat',
      isOnline: 'Çevrimiçi hizmet',
      isVisits: 'Evde hizmet var',
      duration: 'Süre',
      allDay: 'Tüm gün sürer',
      autoConfirm: 'Otomatik randevu onayı',
    },
    hint: {
      name: '',
      description: '',
      price: '',
      isOnline_y: 'Zoom veya benzeri serviste video görüşme.',
      isOnline_n: 'Zoom veya benzeri serviste video görüşme.',
      isVisits_y: 'Yol zamanını zaman aralıklarında hesaba katmayı unutmayın.',
      isVisits_n: '',
      duration: '',
      allDay: 'Uygun zaman aralıklarını tüm gün için ayıracağız.',
      autoConfirm_y: 'Randevular otomatik olarak onaylanacak.',
      autoConfirm_n: 'Randevuları manuel olarak onaylayacaksınız.',
    },
    placeholder: {
      name: 'Buraya yazın...',
      description: 'Buraya yazın...',
      duration: 'Buraya yazın...',
      price: 'Buraya yazın...',
    },
    error: {
      name: 'İsim gerekli',
      duration: 'Hizmetin ne kadar süreceğini bilmek gerekiyor.',
      price: 'Hizmet ücretsizse 0 bırakın, aksi takdirde fiyat gerekli.',
    },
  },
  booking: {
    field: {
      comment: 'Yorum'
    },
    placeholder: {
      comment: 'Randevu yorumu'
    }
  },
  feedback: {
    field: {
      text: 'Birkaç kelime yazın',
      isAnonymous: 'Anonim',
    },
    hint: {
      text: '',
      isAnonymous: 'Kimseye sizin olduğunuzu söylemeyiz.'
    },
    placeholder: {
      text: 'Buraya yazın...'
    }
  }
}

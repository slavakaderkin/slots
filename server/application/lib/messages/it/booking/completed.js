async ({ booking, timezone }) => {
  const { serviceId, datetime, bookingId, profileId } = booking;
  const profile = await db.pg.row('Profile', { profileId });
  const service = await db.pg.row('Service', { serviceId });

  const lines = [
    `<b>Abbiamo bisogno del tuo feedback sulla prenotazione.</b>\n`,
    `<b>Professionista:</b> ${profile.name}`,
    `<b>Servizio:</b> ${service.name}`,
    `<b>Ora:</b> <u>${lib.utils.toHumanDate(datetime, timezone, 'it')}</u>\n`,
    'Cosa ne pensi?'
  ];

  const inline_keyboard = [
    [{ text: 'Pagina prenotazione', web_app: { url: `${config.bot.web}/bookings/${bookingId}` } }],
    [
      { text: 'Lascia recensione', web_app: { url: `${config.bot.web}/feedback/${bookingId}` } },
      { text: 'Non ero presente', callback_data: `booking|cancel|bookingId=${bookingId}|dontNotify=true` }
    ]
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  const parse_mode = 'HTML';

  return { text, parse_mode, reply_markup };
};

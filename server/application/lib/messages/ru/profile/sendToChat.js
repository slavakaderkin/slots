async ({ profile }) => {
  const { name, description, profileId } = profile;
  const { url: photo } = await domain.profile.getPhotoUrl({ profileId });
  const lines = [
    `<b>${name}</b>\n`,
    `${description}\n`,
  ];

  const reply_markup = JSON.stringify({
    inline_keyboard: [
      [{  text: 'Записаться', url: `${config.bot.botUrl}/profile?startapp=profile_${profileId}` }]  // ,
    ],
  });

  return { format: 'photo', photo, caption: lines.join('\n'), parse_mode: 'HTML', reply_markup }; // format: 'photo', photo, caption
};
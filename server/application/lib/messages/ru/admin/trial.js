async ({ account }) => {
  const { info, tg, accountId } = account;

  const lines = [
    `<b>Активация пробного периода</b>\n`,
    `<b>ID клиента: </b>${accountId}`,
  ];

  if (info?.username) lines.push(`<b>Аккаунт: </b> @${info.username}`);

  const inline_keyboard = [
    [{ text: 'Клиент', url: `tg://user?id=${tg}` }],
  ];
 
  const reply_markup = JSON.stringify({ inline_keyboard });

  const text = lines.join('\n');
  return { text, parse_mode: 'HTML', reply_markup };
};
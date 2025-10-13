async ({ contact }) => {
  console.info('lib/bot/handlers/contact');
  console.debug({ contact });

  try {
    const { user_id: tg, phone_number: phone } = contact;
    const account = await db.pg.row('Account', { tg });
    if (account) await db.pg.update('Account', { phone }, { tg });
  } catch (e) {
    console.error(e);
  }
};
({
  async byId({ accountId }) {
    console.info('domain/account/byId');
    console.debug({ accountId });

    const account = await db.pg.row('Account', { accountId });
    return account;
  },

  async init({ data, timezone }) {
    console.info('domain/account/init');
    console.debug({ data });

    const { id: tg, ...obj } = data;
    const info = JSON.stringify(obj);
    let account = await db.pg.row('Account', { tg });
    if (!account) {
      [account] = await db.pg.insert('Account', { tg,  info, timezone });
      account['isNew'] = true;
    } else {
      [account] = await db.pg.update('Account', { info, timezone }, { tg });
    }

    const where = { accountId: account.accountId }
    account['trial'] = await db.pg.row('Trial', where)
    account['subscription'] = await db.pg.row('Subscription', where);

    return account;
  }
});
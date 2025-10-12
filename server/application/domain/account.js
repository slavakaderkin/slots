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
    const info = JSON.stringify(data);
    let account = await db.pg.row('Account', { tg });
    if (!account) {
      [account] = await db.pg.insert('Account', { tg,  info, timezone });
      account['isNew'] = true;
    } else {
      [account] = await db.pg.update('Account', { info, timezone }, { tg });
    }

    const { subscription, trial } = await domain.subscription.byAccount({ accountId: account.accountId });
    const unactiveProfile = !(subscription?.isActive || trial?.isActive);
    const profile = await domain.profile.byAccountId({ accountId: account.accountId });

    account['trial'] = trial;
    account['subscription'] = subscription;
    account['unactiveProfile'] = unactiveProfile;
    account['profile'] = profile;

    return account;
  }
});
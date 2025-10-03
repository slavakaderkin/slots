({
  access: 'public',
  
  method: async ({ initData, timezone }) => {
    console.info('api/auth/twa');
    console.debug({ initData });

    const defaultInfo = {
      id: 1795394319,
      first_name: 'Default',
      last_name: 'User',
    };

    let info;
    if (process.env.mode !== 'production') {
      if (initData) {
        const data = lib.bot.utils.validate(initData);
        info = JSON.parse(data.user); 
      } else {
        info = defaultInfo;
      }
     
    } else {
      const data = lib.bot.utils.validate(initData);
      info = JSON.parse(data.user); 
    }

    const account = await domain.account.init({ data: info, timezone });
    const { accountId } = account;
    const { ip } = context.client;
    
    const token = api.auth.provider.generateToken();
    await api.auth.provider.createSession(token, account, { ip, accountId });
    context.client.startSession(token, account);

    return { account, token };
  },
});

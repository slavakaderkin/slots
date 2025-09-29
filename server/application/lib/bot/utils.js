({
  validate(initData) {
    const parsed = node.querystring.parse(initData);
    const { hash, ...data } = parsed;

    const checkString = Object.keys(data)
      .sort()
      .map((k) => `${k}=${data[k]}`)
      .join('\n');

    const secretKey = node.crypto.createHmac('sha256', 'WebAppData').update(config.bot.token).digest();
    const calculatedHash = node.crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

    //console.debug('Check', { hash, calculatedHash });

    if (calculatedHash === hash) return data;
    else throw new Error('Invalid init data');
  },

  isCommand(str) {
    if (!str) return false;
    const [first] = str.slice(1).split(' ');
    const command = first.trim();
    const available = Object.keys(lib.bot.commands).filter((k) => k !== 'parent');
    return command && available.includes(command);
  },


  async isAdmin({ tg }) {
    const shop = await db.pg.row('Shop');
    const admins = [config.bot.adminId]
    if (shop?.adminId) admins.push(shop.adminId);
        
    return admins.map(Number).includes(Number(tg));
  }
})
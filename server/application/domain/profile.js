({
  async create(params) {
    console.info('domain/profile/create');
    console.debug({ params });

    const [profile] = await db.pg.insert('Profile', params);
    const { profileId } = profile;
    const { adminId: tg } = config.bot;
    const { accountId } = await db.pg.row('Account', { tg });
    await api.profile.sendToChat({ profileId, accountId });
    return profile;
  },

  async update({ profileId, photo, ...updates }) {
    console.info('domain/profile/update');
    console.debug({ profileId, updates });

    const [profile] = await db.pg.update('Profile', updates, { profileId });
    return profile;
  },

  async getAccount({ profileId }) {
    console.info('domain/profile/getAccount');
    console.debug({ profileId });

    const { accountId } = await db.pg.row('Profile', { profileId });
    return await db.pg.row('Account', { accountId });
  },

  async byId({ profileId, accountId }) {
    console.info('domain/profile/byId');
    console.debug({ profileId });
    
    const profile = await db.pg.row('Profile', { profileId });
    const { url } = await this.getPhotoUrl({ profileId });
    profile['photo'] = url;
    profile['rating'] = await this.getRating({ profileId });
    profile['feedbacks'] = await this.getFeedbacks({ profileId });
    profile['availableSlots'] = await domain.slot.getAvailableSlots({ profileId });

    const client = await db.pg.row('Client', { profileId, accountId });
    if (client) {
      const { clientId } = client;
      const query = lib.pg.queries.booking.byClientId({ clientId, today: true });
      const [todayBooking] = await lib.pg.builder.query(query);
      if (!todayBooking) profile['todayBooking'] = null;
      else {
        const { serviceId } = todayBooking;
        todayBooking['service'] = await await domain.service.byId({ serviceId });
        profile['todayBooking'] = todayBooking;
      }
    } else {
      profile['todayBooking'] = null;
    }
   
    profile['isClientBanned'] = !!client?.isBanned;

    const reward = await db.pg.row('AffiliateReward', { accountId, profileId });
    if (reward?.balance) profile['clientRewardBalance'] = Number(reward?.balance);
    return profile;
  },

  async getFeedbacks({ profileId }) {
    console.info('domain/profile/getFeedbacks');
    console.debug({ profileId });

    const feedbacks = await db.pg.select('Feedback', { profileId }).desc('date');

    const mapper = async (feedback) => {
      const { serviceId, accountId, isAnonymous } = feedback;
      feedback['service'] = await db.pg.row('Service', { serviceId });
      const { info } = await db.pg.row('Account', { accountId });
      if (!isAnonymous) feedback['user'] = info;
      else feedback['user'] = null;
      return feedback;
    };

    return await Promise.all(feedbacks.filter(({ text }) => text).map(mapper));
  },

  async getRating({ profileId })  {
    console.info('domain/profile/getRating');
    console.debug({ profileId });

    const feedbacks = await db.pg.select('Feedback', { profileId });

    const sum = feedbacks.reduce((sum, { rating }) => sum + rating, 0);
    const rate = sum / feedbacks.length ? (sum / feedbacks.length).toFixed(1) : 0;
    return  rate;
  },

  async byAccountId({ accountId, clean }) {
    console.info('domain/profile/byAccountId');
    console.debug({ accountId });
  
    const profile = await db.pg.row('Profile', { accountId });
    if (!profile) return null;

    const availableSlots = await domain.slot.getAvailableSlots({ profileId: profile.profileId });
    if (!profile) return null;
    const { url } = await this.getPhotoUrl({ profileId: profile.profileId });
    profile['photo'] = url;
    if (!clean) {
      profile['rating'] = await this.getRating({ profileId: profile.profileId });
      profile['feedbacks'] = await this.getFeedbacks({ profileId: profile.profileId });
      profile['slotCount'] = availableSlots.length;
    }
    
    return profile;
  },

  async listByAccount({ accountId }) {
    console.info('domain/profile/listByAccount');
    console.debug({ accountId });
  
    const query = lib.pg.queries.profile.listByAccount({ accountId });
    const profiles = await lib.pg.builder.query(query);
    const mapper = async (profile) => {
      const { profileId } = profile;
      const { url } = await this.getPhotoUrl({ profileId });
      profile['photo'] = url;
      profile['rating'] = await this.getRating({ profileId });
      profile['upcomingSlot'] = await domain.slot.getUpcomingSlot({ profileId });
      return profile;
    }
    
    return await Promise.all(profiles.map(mapper));
  },

  async getPhotoUrl({ profileId }) {
    console.info('domain/profile/getPhotoUrl');
    console.debug({ profileId });

    const accountId = await db.pg.scalar('Profile', ['accountId'], { profileId });
    const dirPath = `./application/static/files/profile/${accountId}`;
    if (!node.fs.existsSync(dirPath)) return { url: null, size: 0 };
    const [name] = (await node.fsp.readdir(dirPath)).reverse();
    if (!name) return { url: null, size: 0 };
    const { size } = await node.fsp.stat(`${dirPath}/${name}`);
    const staticPath = `${config.bot.web}/files/profile/${accountId}`; // `${config.bot.files}/files/profile/${accountId}`;
    const url = `${staticPath}/${name}`;
    return { url, size };
  },

  async isOwner({ profileId, accountId }) {
    console.info('domain/profile/isOwner');
    console.debug({ profileId, accountId });

    const ownerId = await db.pg.scalar('Profile', ['accountId'], { profileId });
    return ownerId === accountId;
  }
});

({
  generateToken() {
    const { characters, secret, length } = config.sessions;
    return metarhia.metautil.generateToken(secret, characters, length);
  },

  async saveSession(token, data) {
    console.log({ saveSession: { token, data } });
    try {
      await db.pg.update('Session', { data: JSON.stringify(data) }, { token });
    } catch (error) {
      console.error(error);
    }
  },

  async createSession(token, data, fields = {}) {
    const record = { token, data: JSON.stringify(data), ...fields };
    console.log({ createSession: record });
    const [session] = await db.pg.insert('Session', record);
    return session;
  },

  async readSession(token) {
    const record = await db.pg.row('Session', ['data'], { token });
    console.log({ readSession: { token, record } });
    if (record && record.data) return record.data;
    return null;
  },

  async deleteSession(token) {
    return db.pg.delete('Session', { token });
  },

  async registerUser(params) {
    console.log({ registerUser: params });
   
  },

  async getUser(params) {
    console.log({ getUser: params });
   
  },
});

({
  getClient: async () => {
    const client = await db.pg.pool.connect();
    return client;
  },

  atomic: async (builders) => {
    const client = await lib.pg.getClient();

    try {
      await client.query('BEGIN');
      for (const builder of builders) {
        const sql = builder.build();
        const params = builder.buildParams();
        await client.query(sql, params);
      }
      await client.query('COMMIT');
    } catch (e) {
      console.error(e);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  },

  build: {
    insert: npm['@metarhia/sql'].pgInsert,
    select: npm['@metarhia/sql'].pgSelect,
    update: npm['@metarhia/sql'].pgUpdate,
  },

  query: async (builder) => {
    const sql = builder.build();
    const params = builder.buildParams();
    const { rows } = await db.pg.query(sql, params);
    return rows && rows[0] && 'count' in rows?.[0] ? Number(rows[0].count) : rows;
  },
});

({ date, profileId }) => {
  const start = new Date(date + 'T00:00:00.000Z').toISOString();
  const end = new Date(date + 'T23:59:59.999Z').toISOString();

  const builder = lib.pg.builder.build.select()
    .from('Slot')
    .where('profileId', '=', profileId)
    .where('datetime', '>=', start)
    .where('datetime', '<=', end);

  return builder;
};
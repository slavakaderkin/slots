({ profileId }) => {
  const builder = lib.pg.builder.build.select().from('Slot');
  builder
    .where('profileId', '=', profileId)
    .where('isAvailable', '=', true)
    .where('isBlocked', '=', false)
    .whereRaw(`"datetime" >= NOW() + INTERVAL '1 hour'`);

  return builder;
};

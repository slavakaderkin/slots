({ profileId }) => {
  const builder = lib.pg.builder.build.select()
    .from('Slot')
    .where('datetime', '>', 'NOW()')
    .where('profileId', '=', profileId)
    .orderBy('datetime', 'ASC')
    .limit(1);

 
  return builder;
};
({ accountId }) => {
  const builder = lib.pg.builder.build.select()
    .from('Profile')
    .whereIn(
      'profileId',
      (b) => b.select('profileId').from('Client').where('accountId', '=', accountId)
    );

  return builder;
};

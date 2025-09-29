(params) => {
  const builder = lib.pg.build.select().from('Account');
  const { state } = params;
  if (state) builder.where('state', '=', state);
  return builder.orderBy('registered', 'DESC');
};

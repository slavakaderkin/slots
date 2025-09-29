({
  access: 'public',

  method: async ({ streamId, path, name }) => {
    const dirPath = `./application/static/files/${path}/`;
    if (!node.fs.existsSync(dirPath)) {
      node.fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = `${dirPath}${name}`;
    const readable = context.client.getStream(streamId);
    const writable = node.fs.createWriteStream(filePath);
    readable.pipe(writable);
    return { result: 'Stream initialized' };
  },
});


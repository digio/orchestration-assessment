module.exports = {
  proxy: 'localhost:4000',
  files: ['**/*.css', '**/*.pug', '**/*.js'],
  ignore: ['node_modules'],
  reloadDelay: 10,
  ui: false,
  notify: false,
  port: 8000,
};

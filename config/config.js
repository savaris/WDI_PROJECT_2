module.exports = {
  port: process.env.PORT || 3000,
  db: 'mongodb://localhost:27017/wdi_project_2_web_cams',
  secret: process.env.SECRET || 'secret'
};

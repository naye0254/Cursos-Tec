module.exports = {
  db: {
    name: 'db',
    connector: 'memory',
    file: './server/local-memory.json',
  },
  MySqlDS_EAW: {
    host: process.env.ERP_DB_HOST_MYSQL,
    port: process.env.ERP_DB_PORT_MYSQL,
    url: '',
    database: process.env.EAW_DB_NAME,
    password: process.env.EAW_DB_PASS,
    user: process.env.EAW_DB_OWNER,
    name: 'MySqlDS_EAW',
    connector: 'mysql',
    charset: 'utf8',
    collation: 'utf8_general_ci',
  },
  MONGO_EAW: {
    host: process.env.EAW_MONGO_DOCKER_NAME,
    port: 27017,
    database: process.env.EAW_MONGO_NAME,
    password: process.env.EAW_MONGO_PASS,
    name: 'MONGO_EAW',
    user: process.env.EAW_MONGO_OWNER,
    connector: 'mongodb',
  },
  files_local: {
    name: 'files_local',
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    root: 'server/local-storage',
    allowedContentTypes: [
      'application/pdf',
      'image/jpg',
      'image/jpeg',
      'image/png',
    ],
  },
  emailDs: {
    name: 'emailDs',
    connector: 'mail',
    transports: [
      {
        type: 'smtp',
        host: process.env.EAW_MAIL_HOST,
        secure: true,
        port: process.env.EAW_MAIL_PORT,
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: process.env.EAW_MAIL_USER,
          pass: process.env.EAW_MAIL_PASS,
        },
      },
    ],
  },
};

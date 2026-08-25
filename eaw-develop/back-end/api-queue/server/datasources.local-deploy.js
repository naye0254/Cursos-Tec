module.exports = {
  db: {
    name: 'db',
    connector: 'memory'
  },
  files_local: {
    name: 'files_local',
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    root: 'server/local-storage'
  }
};

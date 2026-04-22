module.exports = {
  packagerConfig: {
    name: 'CacheTray',
    executableName: 'cachetray',
    icon: './assets/icon', // Electron-forge handles .icns, .ico based on platform
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'CacheTray',
        icon: './assets/icon.png',
      },
    },
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'cachetray',
      },
    },
  ],
};

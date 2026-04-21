module.exports = {
  packagerConfig: {
    name: 'Quick Notes',
    executableName: 'quick-notes',
    icon: './assets/icon', // Will look for icon.icns, icon.ico, icon.png
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'Quick Notes',
        icon: './assets/icon.png',
      },
    },
  ],
};

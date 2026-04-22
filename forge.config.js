module.exports = {
  packagerConfig: {
    name: 'CacheTray',
    executableName: 'cachetray',
    appBundleId: 'com.wenayy.cachetray',
    icon: './assets/icon', // Electron-forge handles .icns / .ico automatically
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
    // Only load squirrel on Windows to avoid module resolution errors on Mac
    process.platform === 'win32' && {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'cachetray',
        authors: 'wenayy',
        description: 'CacheTray: An ephemeral, high-speed asset collector.',
      },
    },
  ].filter(Boolean),
};

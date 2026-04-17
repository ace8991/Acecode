module.exports = {
  appId: 'com.ultracode.studio',
  productName: 'Ultra Code Studio',
  copyright: 'Copyright © 2024 Ultra Code Studio',
  directories: {
    output: 'dist-electron',
  },
  files: [
    'dist/**/*',
    'electron/**/*',
    'mcp/**/*',
  ],
  extraResources: [
    {
      from: 'node_modules/@modelcontextprotocol',
      to: 'node_modules/@modelcontextprotocol',
    },
  ],
  mac: {
    category: 'public.app-category.developer-tools',
    target: ['dmg', 'zip'],
    icon: 'public/icon.icns',
    hardenedRuntime: true,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
  },
  win: {
    target: ['nsis', 'portable'],
    icon: 'public/icon.ico',
  },
  linux: {
    target: ['AppImage', 'deb'],
    icon: 'public/icon.png',
    category: 'Development',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
  },
  publish: {
    provider: 'github',
    releaseType: 'release',
  },
}

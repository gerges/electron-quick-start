const packagerCb = require('electron-packager');
var { signAsync } = require('electron-osx-sign');


const packager = (packagerOpts) => {
  return new Promise((resolve, reject) => {
    packagerCb(packagerOpts, (err, appPaths) => {
      if (err) {
        reject(err);
      } else {
        resolve(appPaths);
      }
    });
  });
};

const options = {
  dir: '.',
  platform: 'mas',
  arch: 'x64',
  overwrite: true,
  prune: true,
  packageManager: false,
  out: './dist',
  appBundleId: 'com.electron.electron',
  appCategoryType: 'public.app-category.business',
  extendInfo: './build/extend.plist'
};

packager(options)
  .then((outputDir) => {
    let app = `${outputDir}/electron-quick-start.app`;
    return signAsync({
      app,
      entitlements: './build/parent.plist',
      'entitlements-inherit': './build/child.plist',
      'pre-auto-entitlements': false
    })
  });
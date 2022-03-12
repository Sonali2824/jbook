import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';
const fileCache = localForage.createInstance({
  name: 'filecache',
});

// (async () => {
//   await fileCache.setItem('color', 'red');
//   const color = await fileCache.getItem('color');
//   console.log(color);
// })();
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      //build-->bundle

      //Handle root entry index.js
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      //Handle relative files
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
        };
      });

      //handle main file of module
      build.onResolve({ filter: /.*/ }, (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      // build.onResolve({ filter: /.*/ }, async (args: any) => {
      //   //add listeners, checks where index.js is
      //   //handles diff types of file, specify using filters and namespace
      //   console.log('onResolve', args);
      //   if (args.path === 'index.js')
      //     return { path: args.path, namespace: 'a' };

      //   // {path: 'https://unpkg.com/nested-test-pkg@1.0.0/src/helpers/utils', namespace: 'a'}
      //   //   namespace: "a"
      //   //   path: "https://unpkg.com/nested-test-pkg@1.0.0/src/helpers/utils"
      //   //   [[Prototype]]: Object

      //   // else if (args.path === 'tiny-test-pkg') {
      //   //   return {
      //   //     path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js',
      //   //     namespace: 'a',
      //   //   };
      //   // }
      // });
    },
  };
};
//bundles are smaller, strips out unused code, streamlined

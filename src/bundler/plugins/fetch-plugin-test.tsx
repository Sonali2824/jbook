import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';
const fileCache = localForage.createInstance({
  name: 'filecache',
});
export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //object, function -->parameters
        //listener->loads
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          //do not load from filesystem, return contents
          return {
            loader: 'jsx',
            //hardcoded
            //medium-test-pkg --> has its own require stmt for utils
            // const toUpperCase = require('./utils'); --> wrong module was accessed -->https://unpkg.com/utils@0.3.1/index.js
            // const message = 'hi there';
            // module.exports = toUpperCase(message);
            //nested-test-pkg -->resturns error because of ./helpers/utils --> https://unpkg.com/nested-test-pkg@1.0.0/src/index.js
            // const toUpperCase = require('./helpers/utils');
            // const message = 'hi there';
            // module.exports = toUpperCase(message);
            contents: inputCode,
          };
        }
        //check to see if we have already fetched the file and it is in cache
        //if it is, return
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }
        const { data, request } = await axios.get(args.path);

        const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents =
          fileType === 'css'
            ? `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `
            : //attach css styling to style tag and attch styling to head -->  style.innerText='body{background-color:"red}';
              //'${data}' , the file may have '', that will terminate the css
              data;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        //store response in cache
        await fileCache.setItem(args.path, result);
        return result;
        // else {
        //   return {
        //     loader: 'jsx',
        //     //contents: 'export default "hi there!"', //hardcoded
        //   };
        // }
      });
    },
  };
};

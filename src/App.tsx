import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin-test';
import CodeEditor from './components/code-editor';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
const App = () => {
  const [input, setInput] = useState('');
  //const [code, setCode] = useState('');
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
    //console.log(service);
    // {build: ƒ, serve: ƒ, transform: ƒ, stop: ƒ}
    // build: S => (g(), $.build(S)) -->bundle
    // serve: ƒ serve(S, k)
    // stop: ƒ stop()
    // transform: ƒ transform(S, k) -->transpilling
    // [[Prototype]]: Object
  };
  //service helps in bundle and traspilling

  useEffect(() => {
    startService();
  }, []);
  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    iframe.current.srcdoc = html; //resetiing html
    //console.log(ref.current); //helps us gain access to transform and build
    //   const result = await ref.current.transform(input, {
    //     loader: 'jsx',
    //     target: 'es2015',
    //   });
    //   console.log(result);
    //   setCode(result.code);
    // };

    //result->js file for js file
    const result = await ref.current.build({
      entryPoints: ['index.js'], //first to be bundled
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"', //replaced node_env
        global: 'window',
      },
    });
    // console.log(result);
    // {warnings: Array(0), outputFiles: Array(1)}outputFiles: Array(1)0: {path: '<stdout>', contents: Uint8Array(118)}length: 1[[Prototype]]: Array(0)warnings: Array(0)length: 0[[Prototype]]: Array(0)[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()
    //setCode(result.outputFiles[0].text);
    // try {
    //   eval(result.outputFiles[0].text); //run some code
    // } catch (err) {
    //   alert(err);
    // }
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');

    // (() => {
    //   // a:./message
    //   var message_default = 'hi there!';

    //   // a:index.js
    //   console.log(message_default);
    // })();
  };
  //listen message, receive event, coming from parent
  const html = `
  <html>
  <head></head>
  <body>
  <div id="root"></div>
  <script>
 window.addEventListener('message',(event)=>{
try{ eval(event.data);}
catch (err){
  const root=document.querySelector("#root");
  root.innerHTML='<div style="color:red;"><h4>Runtime error</h4>'+err+'</div>'
  console.error(err);
}
 
 },false);
  </script>
  </body>
  </html>
  `;
  return (
    <div>
      <CodeEditor
        initialValue="const a=123"
        onChange={(value) => setInput(value)}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <iframe
        title="code-preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      ></iframe>
    </div>
  );
};

export default App;

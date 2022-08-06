"use strict";var c=class{constructor(){this._buffer=[];this._resolve=null,this._promise=null,this._notifyAll()}async _wait(){await this._promise}_notifyAll(){this._resolve&&this._resolve(),this._promise=new Promise(e=>this._resolve=e)}async dequeue(){for(;this._buffer.length===0;)await this._wait();return this._buffer.shift()}enqueue(e){this._buffer.push(e),this._notifyAll()}};function g(s){let e="";for(let r=0;r<s.length;r++)e+=String.fromCharCode(s[r]);return e}async function f(s,e,r,t){let a=t.runPython(`_shiny_app_registry["${e}"].app.call_pyodide`);await x(s,r,a)}async function x(s,e,r){let t=new c;e.addEventListener("message",o=>{o.data.type==="http.request"&&t.enqueue({type:"http.request",body:o.data.body,more_body:o.data.more_body})}),e.start();async function a(){return t.dequeue()}async function i(o){if(o=Object.fromEntries(o.toJs()),o.type==="http.response.start")e.postMessage({type:o.type,status:o.status,headers:w(o.headers)});else if(o.type==="http.response.body")e.postMessage({type:o.type,body:o.body,more_body:o.more_body});else throw new Error(`Unhandled ASGI event: ${o.type}`)}await r(s,a,i)}function w(s){return s=s.map(([e,r])=>[g(e),g(r)]),Object.fromEntries(s)}var u=class extends EventTarget{constructor(r){super();this.readyState=0,this.addEventListener("open",t=>{this.onopen&&this.onopen(t)}),this.addEventListener("message",t=>{this.onmessage&&this.onmessage(t)}),this.addEventListener("error",t=>{this.onerror&&this.onerror(t)}),this.addEventListener("close",t=>{this.onclose&&this.onclose(t)}),this._port=r,r.addEventListener("message",this._onMessage.bind(this)),r.start()}accept(){this.readyState===0&&(this.readyState=1,this._port.postMessage({type:"open"}))}send(r){if(this.readyState===0)throw new DOMException("Can't send messages while WebSocket is in CONNECTING state","InvalidStateError");this.readyState>1||this._port.postMessage({type:"message",value:{data:r}})}close(r,t){this.readyState>1||(this.readyState=2,this._port.postMessage({type:"close",value:{code:r,reason:t}}),this.readyState=3,this.dispatchEvent(new CloseEvent("close",{code:r,reason:t})))}_onMessage(r){let t=r.data;switch(t.type){case"open":if(this.readyState===0){this.readyState=1,this.dispatchEvent(new Event("open"));return}break;case"message":if(this.readyState===1){this.dispatchEvent(new MessageEvent("message",{...t.value}));return}break;case"close":if(this.readyState<3){this.readyState=3,this.dispatchEvent(new CloseEvent("close",{...t.value}));return}break}this._reportError(`Unexpected event '${t.type}' while in readyState ${this.readyState}`,1002)}_reportError(r,t){this.dispatchEvent(new ErrorEvent("error",{message:r})),typeof t=="number"&&this.close(t,r)}};async function m(s,e,r,t){let a=new u(r),i=t.runPython(`_shiny_app_registry["${e}"].app.call_pyodide`);await M(s,a,i)}async function M(s,e,r){let t={type:"websocket",asgi:{version:"3.0",spec_version:"2.1"},path:s,headers:[]},a=new c;a.enqueue({type:"websocket.connect"});async function i(){return await a.dequeue()}async function o(n){if(n=Object.fromEntries(n.toJs()),n.type==="websocket.accept")e.accept();else if(n.type==="websocket.send")e.send(n.text??n.bytes);else if(n.type==="websocket.close")e.close(n.code,n.reason);else throw e.close(1002,"ASGI protocol error"),new Error(`Unhandled ASGI event: ${n.type}`)}e.addEventListener("message",n=>{let y=n,l={type:"websocket.receive"};typeof y.data=="string"?l.text=y.data:l.bytes=y.data,a.enqueue(l)}),e.addEventListener("close",n=>{let y=n;a.enqueue({type:"websocket.disconnect",code:y.code})}),e.addEventListener("error",n=>{console.error(n)}),await r(t,i,o)}function b(s){let e={message:"An unknown error occured",name:s.name};return s instanceof Error&&(e.message=s.message,s.stack&&(e.stack=s.stack)),e}async function R(s,e){let r=s.globals.get("repr");s.globals.set("js_pyodide",s);let t=await s.runPythonAsync(`
  import pyodide.console
  import __main__
  pyodide.console.PyodideConsole(__main__.__dict__)
  `),a=t.complete.copy();t.destroy(),e&&s.globals.set("callJS",e);let i=await s.runPythonAsync(`
  def _short_format_last_traceback() -> str:
      import sys
      import traceback
      e = sys.last_value
      found_marker = False
      nframes = 0
      for (frame, _) in traceback.walk_tb(e.__traceback__):
          if frame.f_code.co_filename in ("<console>", "<exec>"):
              found_marker = True
          if found_marker:
              nframes += 1
      return "".join(traceback.format_exception(type(e), e, e.__traceback__, -nframes))

  _short_format_last_traceback
  `);return await s.runPythonAsync("del _short_format_last_traceback"),{repr:r,tabComplete:a,shortFormatLastTraceback:i}}function P(s,e="none",r,t){return{get value(){return r.isPyProxy(s)?s.toJs():s},get printed_value(){return t(s)},get to_html(){let i;try{i=r.globals.get("_to_html")}catch(n){console.error("Couldn't find _to_html function: ",n),i=y=>({type:"text",value:"Couldn't finding _to_html function."})}return i(s).toJs({dict_converter:Object.fromEntries})},get none(){}}[e]}importScripts("./pyodide/pyodide.js");var h="none",p;self.stdout_callback=function(s){self.postMessage({type:"nonreply",subtype:"output",stdout:s})};self.stderr_callback=function(s){self.postMessage({type:"nonreply",subtype:"output",stderr:s})};async function _(s,e){self.postMessage({type:"nonreply",subtype:"callJS",fnName:s.toJs(),args:e.toJs()})}var d;self.onmessage=async function(s){let e=s.data;if(e.type==="openChannel"){let t=s.ports[0];m(e.path,e.appName,t,p);return}else if(e.type==="makeRequest"){let t=s.ports[0];f(e.scope,e.appName,t,p);return}let r=s.ports[0];try{if(e.type==="init")h==="none"&&(h="loading",p=await loadPyodide({...e.config,stdout:self.stdout_callback,stderr:self.stderr_callback}),d=await R(p,_),h="loaded"),r.postMessage({type:"reply",subtype:"done"});else if(e.type==="loadPackagesFromImports")await p.loadPackagesFromImports(e.code);else if(e.type==="runPythonAsync"){await p.loadPackagesFromImports(e.code);let t=await p.runPythonAsync(e.code);e.printResult&&t!==void 0&&self.stdout_callback(d.repr(t));try{let a=P(t,e.returnResult,p,d.repr);r.postMessage({type:"reply",subtype:"done",value:a})}finally{p.isPyProxy(t)&&t.destroy()}}else if(e.type==="tabComplete"){let t=d.tabComplete(e.code).toJs()[0];r.postMessage({type:"reply",subtype:"tabCompletions",completions:t})}else if(e.type==="callPyAsync"){let{fnName:t,args:a,kwargs:i}=e,o=p.globals.get(t[0]);for(let l of t.slice(1))o=o[l];let n=o.callKwargs(...a,i),y=await Promise.resolve(n);e.printResult&&y!==void 0&&self.stdout_callback(d.repr(y));try{let l=P(y,e.returnResult,p,d.repr);r.postMessage({type:"reply",subtype:"done",value:l})}finally{p.isPyProxy(y)&&y.destroy()}}else r.postMessage({type:"reply",subtype:"done",error:new Error(`Unknown message type: ${e.toString()}`)})}catch(t){t instanceof p.PythonError&&(t.message=d.shortFormatLastTraceback()),r.postMessage({type:"reply",subtype:"done",error:b(t)})}};
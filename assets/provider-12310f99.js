var d=Object.defineProperty;var o=(i,e,t)=>e in i?d(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var r=(i,e,t)=>(o(i,typeof e!="symbol"?e+"":e,t),t);import{H as p}from"./provider-08302d97.js";import"./register-9d3fd968.js";import"./app-da87ad07.js";class P extends p{constructor(){super(...arguments);r(this,"$$PROVIDER_TYPE","AUDIO")}get type(){return"audio"}setup(t){super.setup(t),this.type==="audio"&&t.delegate.U("provider-setup",{detail:this})}get audio(){return this.n}}export{P as AudioProvider};
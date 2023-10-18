var m=Object.defineProperty;var v=(i,t,r)=>t in i?m(i,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[t]=r;var h=(i,t,r)=>(v(i,typeof t!="symbol"?t+"":t,r),r);import{k as f,l as p,D as d,m as a,n as L,o as S,q as g,s as w,v as y}from"./register-4c5f1b82.js";import{VideoProvider as E}from"./provider-706c8cb1.js";import{a as A}from"./provider-65c904db.js";import"./app-2be73664.js";class H{constructor(t,r,e){this.rh=t,this.ph=r,this._e=e,this.sh()}async sh(){const t={onLoadStart:this.je.bind(this),onLoaded:this.xe.bind(this),onLoadError:this.th.bind(this)};let r=await D(this.rh,t);if(f(r)&&!p(this.rh)&&(r=await j(this.rh,t)),!r)return null;if(!r.isSupported()){const e="[vidstack]: `hls.js` is not supported in this environment";return this.ph.player.dispatchEvent(new d("hls-unsupported")),this.ph.delegate.U("error",{detail:{message:e,code:4}}),null}return r}je(){this.ph.player.dispatchEvent(new d("hls-lib-load-start"))}xe(t){this.ph.player.dispatchEvent(new d("hls-lib-loaded",{detail:t})),this._e(t)}th(t){const r=a(t);this.ph.player.dispatchEvent(new d("hls-lib-load-error",{detail:r})),this.ph.delegate.U("error",{detail:{message:r.message,code:4}})}}async function j(i,t={}){var r,e,n,o,u;if(!f(i)){if((r=t.onLoadStart)==null||r.call(t),i.prototype&&i.prototype!==Function)return(e=t.onLoaded)==null||e.call(t,i),i;try{const s=(n=await i())==null?void 0:n.default;if(s&&s.isSupported)(o=t.onLoaded)==null||o.call(t,s);else throw Error("");return s}catch(s){(u=t.onLoadError)==null||u.call(t,s)}}}async function D(i,t={}){var r,e,n;if(p(i)){(r=t.onLoadStart)==null||r.call(t);try{if(await L(i),!S(window.Hls))throw Error("");const o=window.Hls;return(e=t.onLoaded)==null||e.call(t,o),o}catch(o){(n=t.onLoadError)==null||n.call(t,o)}}}const _="https://cdn.jsdelivr.net";class $ extends E{constructor(){super(...arguments);h(this,"$$PROVIDER_TYPE","HLS");h(this,"mh",null);h(this,"Ad",new A(this.video));h(this,"lh",`${_}/npm/hls.js@^1.0.0/dist/hls.min.js`)}get ctor(){return this.mh}get instance(){return this.Ad.instance}get type(){return"hls"}get canLiveSync(){return!0}get config(){return this.Ad.nh}set config(r){this.Ad.nh=r}get library(){return this.lh}set library(r){this.lh=r}preconnect(){p(this.lh)&&w(this.lh)}setup(r){super.setup(r),new H(this.lh,r,e=>{this.mh=e,this.Ad.setup(e,r),r.delegate.U("provider-setup",{detail:this});const n=y(r.$store.source);n&&this.loadSource(n)})}async loadSource({src:r}){var e;p(r)&&((e=this.Ad.instance)==null||e.loadSource(r))}onInstance(r){const e=this.Ad.instance;return e&&r(e),this.Ad.oh.add(r),()=>this.Ad.oh.delete(r)}destroy(){this.Ad.Jg()}}h($,"supported",g());export{$ as HLSProvider};

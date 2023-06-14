"use strict";var l=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var $=Object.getOwnPropertyNames;var T=Object.prototype.hasOwnProperty;var S=(a,e)=>{for(var t in e)l(a,t,{get:e[t],enumerable:!0})},w=(a,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of $(e))!T.call(a,r)&&r!==t&&l(a,r,{get:()=>e[r],enumerable:!(s=x(e,r))||s.enumerable});return a};var N=a=>w(l({},"__esModule",{value:!0}),a);var A={};S(A,{SystemModule:()=>y});module.exports=N(A);const O=["video","audio","image","text","application"],F=["application/pdf","audio/mpeg","audio/wav","image/png","image/jpeg","image/gif","video/mp4","video/mpeg","text/html"],j=["en","wl","ww"],k={index:"o",slot:"s",mac:"x",pci:"p"},v=["SUN","MON","TUE","WED","THU","FRI","SAT"];class y{constructor(e){this.faker=e;for(const t of Object.getOwnPropertyNames(y.prototype))t==="constructor"||typeof this[t]!="function"||(this[t]=this[t].bind(this))}fileName(e={}){const{extensionCount:t=1}=e,s=this.faker.word.words().toLowerCase().replace(/\W/g,"_"),r=this.faker.helpers.multiple(()=>this.fileExt(),{count:t}).join(".");return r.length===0?s:`${s}.${r}`}commonFileName(e){return`${this.fileName({extensionCount:0})}.${e||this.commonFileExt()}`}mimeType(){const e=Object.keys(this.faker.definitions.system.mimeTypes);return this.faker.helpers.arrayElement(e)}commonFileType(){return this.faker.helpers.arrayElement(O)}commonFileExt(){return this.fileExt(this.faker.helpers.arrayElement(F))}fileType(){const e=new Set,t=this.faker.definitions.system.mimeTypes;Object.keys(t).forEach(r=>{const i=r.split("/")[0];e.add(i)});const s=Array.from(e);return this.faker.helpers.arrayElement(s)}fileExt(e){if(typeof e=="string"){const i=this.faker.definitions.system.mimeTypes;return this.faker.helpers.arrayElement(i[e].extensions)}const t=this.faker.definitions.system.mimeTypes,s=new Set;Object.keys(t).forEach(i=>{t[i].extensions instanceof Array&&t[i].extensions.forEach(n=>{s.add(n)})});const r=Array.from(s);return this.faker.helpers.arrayElement(r)}directoryPath(){const e=this.faker.definitions.system.directoryPaths;return this.faker.helpers.arrayElement(e)}filePath(){return`${this.directoryPath()}/${this.fileName()}`}semver(){return[this.faker.number.int(9),this.faker.number.int(9),this.faker.number.int(9)].join(".")}networkInterface(e={}){var o,m,c,f,h;const{interfaceType:t=this.faker.helpers.arrayElement(j),interfaceSchema:s=this.faker.helpers.objectKey(k)}=e;let r,i="";const n=()=>this.faker.string.numeric({allowLeadingZeros:!0});switch(s){case"index":r=n();break;case"slot":r=`${n()}${(o=this.faker.helpers.maybe(()=>`f${n()}`))!=null?o:""}${(m=this.faker.helpers.maybe(()=>`d${n()}`))!=null?m:""}`;break;case"mac":r=this.faker.internet.mac("");break;case"pci":i=(c=this.faker.helpers.maybe(()=>`P${n()}`))!=null?c:"",r=`${n()}s${n()}${(f=this.faker.helpers.maybe(()=>`f${n()}`))!=null?f:""}${(h=this.faker.helpers.maybe(()=>`d${n()}`))!=null?h:""}`;break}return`${i}${t}${k[s]}${r}`}cron(e={}){const{includeYear:t=!1,includeNonStandard:s=!1}=e,r=[this.faker.number.int(59),"*"],i=[this.faker.number.int(23),"*"],n=[this.faker.number.int({min:1,max:31}),"*","?"],o=[this.faker.number.int({min:1,max:12}),"*"],m=[this.faker.number.int(6),this.faker.helpers.arrayElement(v),"*","?"],c=[this.faker.number.int({min:1970,max:2099}),"*"],f=this.faker.helpers.arrayElement(r),h=this.faker.helpers.arrayElement(i),u=this.faker.helpers.arrayElement(n),d=this.faker.helpers.arrayElement(o),b=this.faker.helpers.arrayElement(m),g=this.faker.helpers.arrayElement(c);let p=`${f} ${h} ${u} ${d} ${b}`;t&&(p+=` ${g}`);const E=["@annually","@daily","@hourly","@monthly","@reboot","@weekly","@yearly"];return!s||this.faker.datatype.boolean()?p:this.faker.helpers.arrayElement(E)}}0&&(module.exports={SystemModule});

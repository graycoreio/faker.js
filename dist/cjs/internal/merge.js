"use strict";var o=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var m=Object.prototype.hasOwnProperty;var s=(r,e)=>{for(var n in e)o(r,n,{get:e[n],enumerable:!0})},u=(r,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of T(e))!m.call(r,t)&&t!==n&&o(r,t,{get:()=>e[t],enumerable:!(a=f(e,t))||a.enumerable});return r};var y=r=>u(o({},"__esModule",{value:!0}),r);var c={};s(c,{mergeArrays:()=>A});module.exports=y(c);function A(...r){return Array.from(new Set(r.flat())).sort()}0&&(module.exports={mergeArrays});

"use strict";var l=Object.create;var t=Object.defineProperty;var s=Object.getOwnPropertyDescriptor;var b=Object.getOwnPropertyNames;var h=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var x=(o,r)=>{for(var m in r)t(o,m,{get:r[m],enumerable:!0})},a=(o,r,m,p)=>{if(r&&typeof r=="object"||typeof r=="function")for(let e of b(r))!w.call(o,e)&&e!==m&&t(o,e,{get:()=>r[e],enumerable:!(p=s(r,e))||p.enumerable});return o};var f=(o,r,m)=>(m=o!=null?l(h(o)):{},a(r||!o||!o.__esModule?t(m,"default",{value:o,enumerable:!0}):m,o)),z=o=>a(t({},"__esModule",{value:!0}),o);var T={};x(T,{faker:()=>F});module.exports=z(T);var i=require("../faker"),n=f(require("../locales/base")),c=f(require("../locales/en")),k=f(require("../locales/zh_TW"));const F=new i.Faker({locale:[k.default,c.default,n.default]});0&&(module.exports={faker});

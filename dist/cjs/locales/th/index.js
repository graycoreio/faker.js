"use strict";var D=Object.create;var e=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var b=Object.getOwnPropertyNames;var x=Object.getPrototypeOf,y=Object.prototype.hasOwnProperty;var _=(o,r)=>{for(var t in r)e(o,t,{get:r[t],enumerable:!0})},f=(o,r,t,p)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of b(r))!y.call(o,i)&&i!==t&&e(o,i,{get:()=>r[i],enumerable:!(p=L(r,i))||p.enumerable});return o};var m=(o,r,t)=>(t=o!=null?D(x(o)):{},f(r||!o||!o.__esModule?e(t,"default",{value:o,enumerable:!0}):t,o)),g=o=>f(e({},"__esModule",{value:!0}),o);var q={};_(q,{default:()=>k});module.exports=g(q);var n=m(require("./animal")),a=m(require("./color")),l=m(require("./date")),c=m(require("./internet")),d=m(require("./location")),h=m(require("./metadata")),s=m(require("./person")),u=m(require("./phone_number"));const j={animal:n.default,color:a.default,date:l.default,internet:c.default,location:d.default,metadata:h.default,person:s.default,phone_number:u.default};var k=j;

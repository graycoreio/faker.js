"use strict";var p=Object.defineProperty;var o=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var n=Object.prototype.hasOwnProperty;var f=(s,e)=>{for(var a in e)p(s,a,{get:e[a],enumerable:!0})},l=(s,e,a,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of i(e))!n.call(s,r)&&r!==a&&p(s,r,{get:()=>e[r],enumerable:!(t=o(e,r))||t.enumerable});return s};var m=s=>l(p({},"__esModule",{value:!0}),s);var u={};f(u,{default:()=>N});module.exports=m(u);var N=[{value:"{{person.firstName}} {{person.lastName}}",weight:49},{value:"{{person.prefix}} {{person.firstName}} {{person.lastName}}",weight:7},{value:"{{person.firstName}} {{person.lastName}} {{person.suffix}}",weight:7},{value:"{{person.prefix}} {{person.firstName}} {{person.lastName}} {{person.suffix}}",weight:1}];

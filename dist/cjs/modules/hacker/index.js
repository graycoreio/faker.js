"use strict";var a=Object.defineProperty;var h=Object.getOwnPropertyDescriptor;var o=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var c=(t,e)=>{for(var r in e)a(t,r,{get:e[r],enumerable:!0})},k=(t,e,r,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of o(e))!f.call(t,i)&&i!==r&&a(t,i,{get:()=>e[i],enumerable:!(s=h(e,i))||s.enumerable});return t};var b=t=>k(a({},"__esModule",{value:!0}),t);var p={};c(p,{HackerModule:()=>n});module.exports=b(p);class n{constructor(e){this.faker=e;for(const r of Object.getOwnPropertyNames(n.prototype))r==="constructor"||typeof this[r]!="function"||(this[r]=this[r].bind(this))}abbreviation(){return this.faker.helpers.arrayElement(this.faker.definitions.hacker.abbreviation)}adjective(){return this.faker.helpers.arrayElement(this.faker.definitions.hacker.adjective)}noun(){return this.faker.helpers.arrayElement(this.faker.definitions.hacker.noun)}verb(){return this.faker.helpers.arrayElement(this.faker.definitions.hacker.verb)}ingverb(){return this.faker.helpers.arrayElement(this.faker.definitions.hacker.ingverb)}phrase(){const e={abbreviation:this.abbreviation,adjective:this.adjective,ingverb:this.ingverb,noun:this.noun,verb:this.verb},r=this.faker.helpers.arrayElement(this.faker.definitions.hacker.phrase);return this.faker.helpers.mustache(r,e)}}0&&(module.exports={HackerModule});

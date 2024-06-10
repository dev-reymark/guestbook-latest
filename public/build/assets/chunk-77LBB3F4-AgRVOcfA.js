import{t as I,h as N,D as E,A as M,j as V,c as k,$ as F,G as R,m as _,u as H,n as z,o as O,f as g,g as S}from"./index-7XyTjIaX.js";import{j as s,r as C}from"./app-C3I58QEU.js";var D=I({base:["relative inline-flex items-center outline-none tap-highlight-transparent",...N],variants:{size:{sm:"text-small",md:"text-medium",lg:"text-large"},color:{foreground:"text-foreground",primary:"text-primary",secondary:"text-secondary",success:"text-success",warning:"text-warning",danger:"text-danger"},underline:{none:"no-underline",hover:"hover:underline",always:"underline",active:"active:underline",focus:"focus:underline"},isBlock:{true:["px-2","py-1","hover:after:opacity-100","after:content-['']","after:inset-0","after:opacity-0","after:w-full","after:h-full","after:rounded-xl","after:transition-background","after:absolute"],false:"hover:opacity-80 active:opacity-disabled transition-opacity"},isDisabled:{true:"opacity-disabled cursor-default pointer-events-none"},disableAnimation:{true:"after:transition-none transition-none"}},compoundVariants:[{isBlock:!0,color:"foreground",class:"hover:after:bg-foreground/10"},{isBlock:!0,color:"primary",class:"hover:after:bg-primary/20"},{isBlock:!0,color:"secondary",class:"hover:after:bg-secondary/20"},{isBlock:!0,color:"success",class:"hover:after:bg-success/20"},{isBlock:!0,color:"warning",class:"hover:after:bg-warning/20"},{isBlock:!0,color:"danger",class:"hover:after:bg-danger/20"},{underline:["hover","always","active","focus"],class:"underline-offset-4"}],defaultVariants:{color:"primary",size:"md",isBlock:!1,underline:"none",isDisabled:!1,disableAnimation:!1}}),G="flex mx-1 text-current self-center",K=r=>s.jsxs("svg",{"aria-hidden":"true",fill:"none",focusable:"false",height:"1em",shapeRendering:"geometricPrecision",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.5",viewBox:"0 0 24 24",width:"1em",...r,children:[s.jsx("path",{d:"M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"}),s.jsx("path",{d:"M15 3h6v6"}),s.jsx("path",{d:"M10 14L21 3"})]});function U(r,t){let{elementType:n="a",onPress:c,onPressStart:i,onPressEnd:l,onClick:o,isDisabled:d,...h}=r,u={};n!=="a"&&(u={role:"link",tabIndex:d?void 0:0});let{focusableProps:m}=E(r,t),{pressProps:f,isPressed:p}=M({onPress:c,onPressStart:i,onPressEnd:l,isDisabled:d,ref:t}),v=V(h,{labelable:!0,isLink:n==="a"}),x=k(m,f),b=F();return{isPressed:p,linkProps:k(v,{...x,...u,"aria-disabled":d||void 0,"aria-current":r["aria-current"],onClick:e=>{var a;(a=f.onClick)==null||a.call(f,e),o&&o(e),!b.isNative&&e.currentTarget instanceof HTMLAnchorElement&&e.currentTarget.href&&!e.isDefaultPrevented()&&R(e.currentTarget,e)&&(e.preventDefault(),b.open(e.currentTarget,e))}})}}function W(r){var t,n;const[c,i]=_(r,D.variantKeys),{ref:l,as:o,children:d,anchorIcon:h,isExternal:u=!1,showAnchorIcon:m=!1,autoFocus:f=!1,className:p,onPress:v,onPressStart:x,onPressEnd:b,onClick:e,...a}=c,B=o||"a",$=H(l),{linkProps:y}=U({...a,onPress:v,onPressStart:x,onPressEnd:b,onClick:e,isDisabled:r.isDisabled,elementType:`${o}`},$),{isFocused:P,isFocusVisible:j,focusProps:w}=z({autoFocus:f});u&&(a.rel=(t=a.rel)!=null?t:"noopener noreferrer",a.target=(n=a.target)!=null?n:"_blank");const L=C.useMemo(()=>D({...i,className:p}),[O(i),p]),T=C.useCallback(()=>({ref:$,className:L,"data-focus":g(P),"data-disabled":g(r.isDisabled),"data-focus-visible":g(j),...k(w,y,a)}),[L,P,j,w,y,a]);return{Component:B,children:d,anchorIcon:h,showAnchorIcon:m,getLinkProps:T}}var A=S((r,t)=>{const{Component:n,children:c,showAnchorIcon:i,anchorIcon:l=s.jsx(K,{className:G}),getLinkProps:o}=W({ref:t,...r});return s.jsx(n,{...o(),children:s.jsxs(s.Fragment,{children:[c,i&&l]})})});A.displayName="NextUI.Link";var Q=A;export{Q as l};

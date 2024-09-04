import{r as a,j as e,Y as O,a as E}from"./app-DbIm5PvF.js";import{F as H,a as F}from"./index-7lQFaI50.js";import{S as b}from"./sweetalert2.all-rJ5C8ypE.js";import{b as x,d as f}from"./index-B6c2cBhK.js";import{S as z,t as G,a as L,b as i,c as M,d as R,e as l}from"./Icons-D2Boc289.js";import{c as V}from"./chunk-ZBZZ6A2J-D0IM_7of.js";import{s as _,l as r}from"./chunk-OKTOLZE5-MHWWqbbT.js";import{p as A}from"./chunk-F7XGZDO5-BYIjmx5-.js";import{i as B}from"./chunk-ZH5EUE66-CB1wrQ-u.js";import"./iconBase-Bxwi9vzu.js";import"./useControlledState-201Wx1HE.js";import"./index-DtAiiwnD.js";import"./VisuallyHidden-C8w9psqC.js";import"./chunk-3XT5V4LF-Bi8Qm_Ma.js";import"./chunk-6NL67ZRH-BIwoaxJy.js";import"./chunk-HUKVTWEI-BTXN31oG.js";import"./useField-BLDbO711.js";import"./LiveAnnouncer-mDjEhN5-.js";import"./chunk-7F3ZLNJ6-su67f2fZ.js";import"./chunk-VGNVQLL4-C14JQvsV.js";import"./index-X92CTFGl.js";function ue({guestLogs:m}){const[p,y]=a.useState(""),[j,w]=a.useState(1),[o,k]=a.useState(13),[u,C]=a.useState("past24Hours"),[D,v]=a.useState([]),c=a.useRef(null);a.useEffect(()=>{(()=>{const s=new Date;let n=null;switch(u){case"past24Hours":n=new Date(s.getTime()-864e5);break;case"past7Days":n=new Date(s.getTime()-6048e5);break;case"past30Days":n=new Date(s.getTime()-2592e6);break;default:n=null;break}if(n){const P=m.filter(T=>new Date(T.check_in_time)>=n);v(P)}else v(m)})()},[u,m]);const d=D.filter(t=>t.guest.name.toLowerCase().includes(p.toLowerCase())),h=j*o,g=h-o,N=d.slice(g,h),I=t=>w(t),S=async t=>{try{await f.Inertia.post(`/guest/log/check-out/${t}`),b.fire({icon:"success",title:"Guest checked out successfully!"})}catch(s){console.error("Error checking out guest:",s),b.fire({icon:"error",title:"An error occurred",text:"Please try again later."})}};return a.useEffect(()=>{const t=()=>{c.current&&clearTimeout(c.current),c.current=setTimeout(()=>{f.Inertia.visit("/",{replace:!0})},6e4)};t();const s=()=>{t()};return window.addEventListener("mousemove",s),window.addEventListener("keydown",s),()=>{c.current&&clearTimeout(c.current),window.removeEventListener("mousemove",s),window.removeEventListener("keydown",s)}},[]),e.jsxs("div",{className:"min-h-screen bg-[url(/assets/images/bg.png)] bg-cover",children:[e.jsx(O,{title:"Check Out"}),e.jsx("div",{className:"py-12 p-4",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsxs(V,{className:"w-full p-4",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold mb-4 ",children:e.jsxs("span",{className:"bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary relative",children:["Check Out",e.jsx("span",{className:"absolute  left-1/2 transform -translate-x-1/2 -bottom-2 h-[3px] w-16 bg-[#2aefe6]"})]})}),e.jsx("p",{className:"text-sm font-light",children:'To check out a guest, click on the "Check Out" button.'})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex justify-between gap-3 items-end mb-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(x,{as:E,href:route("guestlog.create"),color:"primary",variant:"shadow",endContent:e.jsx(H,{}),children:"Check-in"}),e.jsx(x,{isIconOnly:!0,color:"secondary",variant:"flat",startContent:e.jsx(F,{}),onClick:()=>f.Inertia.visit("/")})]}),e.jsx(B,{variant:"bordered",placeholder:"Search by guest name",className:"w-full sm:max-w-[35%]",startContent:e.jsx(z,{className:"text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"}),value:p,onChange:t=>{y(t.target.value),w(1)}})]}),e.jsxs("div",{className:"flex justify-between items-center mt-4",children:[e.jsxs("div",{className:"flex gap-2 w-[35%]",children:[e.jsxs(_,{size:"sm",placeholder:"Items Per Page",value:o.toString(),onChange:t=>k(Number(t.target.value)),children:[e.jsx(r,{value:"5",children:"5"},"5"),e.jsx(r,{value:"10",children:"10"},"10"),e.jsx(r,{value:"15",children:"15"},"15")]}),e.jsxs(_,{size:"sm",placeholder:"Past 24 Hours",value:u,onChange:t=>C(t.target.value),children:[e.jsx(r,{value:"current",children:"All Time"},"current"),e.jsx(r,{value:"past24Hours",children:"Past 24 Hours"},"past24Hours"),e.jsx(r,{value:"past7Days",children:"Past 7 Days"},"past7Days"),e.jsx(r,{value:"past30Days",children:"Past 30 Days"},"past30Days")]})]}),e.jsxs("p",{children:["Showing ",g+1," to"," ",h," of (",d.length,")"]})]}),e.jsxs(G,{selectionMode:"single","aria-label":"Guests Table",children:[e.jsxs(L,{children:[e.jsx(i,{children:"Guest ID"}),e.jsx(i,{children:"Guest Name"}),e.jsx(i,{children:"Meeting With"}),e.jsx(i,{children:"Purpose of Visit"}),e.jsx(i,{children:"Check In"}),e.jsx(i,{children:"Check Out"})]}),e.jsx(M,{emptyContent:"No log for today.",children:N.sort((t,s)=>new Date(s.created_at)-new Date(t.created_at)).map(t=>e.jsxs(R,{children:[e.jsx(l,{children:t.guest_id}),e.jsx(l,{children:t.guest.name}),e.jsx(l,{children:t.meeting_with}),e.jsx(l,{children:t.purpose_of_visit}),e.jsx(l,{children:new Date(new Date(t.check_in_time).getTime()-new Date(t.check_in_time).getTimezoneOffset()*6e4).toLocaleString([],{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",hour12:!0})}),e.jsx(l,{children:t.check_out_time?new Date(new Date(t.check_out_time).getTime()-new Date(t.check_out_time).getTimezoneOffset()*6e4).toLocaleString([],{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",hour12:!0}):e.jsx(x,{onClick:()=>S(t.id),color:"success",size:"sm",children:"Check Out"})})]},t.id))})]}),e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(A,{color:"primary",showShadow:!0,isCompact:!0,showControls:!0,total:Math.ceil(d.length/o),page:j,onChange:I})})]})]})})})]})}export{ue as default};

import{d as s1}from"./chunk-46EHWJZL.js";import{Fb as c1,Kb as a1,Lb as l1,Pa as Q2,U as t2,V as _2,Ya as K2,Za as A,_ as X2,cb as m2,db as $2,ea as $,eb as J2,ob as Z2,sc as e1,ta as Y2}from"./chunk-GWDYAHF2.js";function v4(c,a,l){return(a=h4(a))in c?Object.defineProperty(c,a,{value:l,enumerable:!0,configurable:!0,writable:!0}):c[a]=l,c}function r1(c,a){var l=Object.keys(c);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(c);a&&(e=e.filter(function(s){return Object.getOwnPropertyDescriptor(c,s).enumerable})),l.push.apply(l,e)}return l}function f(c){for(var a=1;a<arguments.length;a++){var l=arguments[a]!=null?arguments[a]:{};a%2?r1(Object(l),!0).forEach(function(e){v4(c,e,l[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(c,Object.getOwnPropertyDescriptors(l)):r1(Object(l)).forEach(function(e){Object.defineProperty(c,e,Object.getOwnPropertyDescriptor(l,e))})}return c}function C4(c,a){if(typeof c!="object"||!c)return c;var l=c[Symbol.toPrimitive];if(l!==void 0){var e=l.call(c,a||"default");if(typeof e!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(a==="string"?String:Number)(c)}function h4(c){var a=C4(c,"string");return typeof a=="symbol"?a:a+""}var i1=()=>{},D2={},F1={},B1=null,D1={mark:i1,measure:i1};try{typeof window<"u"&&(D2=window),typeof document<"u"&&(F1=document),typeof MutationObserver<"u"&&(B1=MutationObserver),typeof performance<"u"&&(D1=performance)}catch{}var{userAgent:f1=""}=D2.navigator||{},T=D2,L=F1,n1=B1,J=D1,T0=!!T.document,w=!!L.documentElement&&!!L.head&&typeof L.addEventListener=="function"&&typeof L.createElement=="function",H1=~f1.indexOf("MSIE")||~f1.indexOf("Trident/"),g4=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,x4=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,R1={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},S4={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},E1=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],u="classic",s2="duotone",N4="sharp",b4="sharp-duotone",U1=[u,s2,N4,b4],k4={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},w4={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},y4=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),A4={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},P4=["fak","fa-kit","fakd","fa-kit-duotone"],o1={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},T4=["kit"],F4={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},B4=["fak","fakd"],D4={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},t1={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Z={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},H4=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],R4=["fak","fa-kit","fakd","fa-kit-duotone"],E4={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},U4={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},I4={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},d2={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},O4=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],v2=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...H4,...O4],W4=["solid","regular","light","thin","duotone","brands"],I1=[1,2,3,4,5,6,7,8,9,10],q4=I1.concat([11,12,13,14,15,16,17,18,19,20]),G4=[...Object.keys(I4),...W4,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",Z.GROUP,Z.SWAP_OPACITY,Z.PRIMARY,Z.SECONDARY].concat(I1.map(c=>"".concat(c,"x"))).concat(q4.map(c=>"w-".concat(c))),V4={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},b="___FONT_AWESOME___",C2=16,O1="fa",W1="svg-inline--fa",R="data-fa-i2svg",h2="data-fa-pseudo-element",j4="data-fa-pseudo-element-pending",H2="data-prefix",R2="data-icon",m1="fontawesome-i2svg",_4="async",X4=["HTML","HEAD","STYLE","SCRIPT"],q1=(()=>{try{return!0}catch{return!1}})();function Q(c){return new Proxy(c,{get(a,l){return l in a?a[l]:a[u]}})}var G1=f({},R1);G1[u]=f(f(f(f({},{"fa-duotone":"duotone"}),R1[u]),o1.kit),o1["kit-duotone"]);var Y4=Q(G1),g2=f({},A4);g2[u]=f(f(f(f({},{duotone:"fad"}),g2[u]),t1.kit),t1["kit-duotone"]);var z1=Q(g2),x2=f({},d2);x2[u]=f(f({},x2[u]),D4.kit);var E2=Q(x2),S2=f({},U4);S2[u]=f(f({},S2[u]),F4.kit);var F0=Q(S2),Q4=g4,V1="fa-layers-text",K4=x4,$4=f({},k4),B0=Q($4),J4=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],z2=S4,Z4=[...T4,...G4],j=T.FontAwesomeConfig||{};function c3(c){var a=L.querySelector("script["+c+"]");if(a)return a.getAttribute(c)}function a3(c){return c===""?!0:c==="false"?!1:c==="true"?!0:c}L&&typeof L.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(a=>{let[l,e]=a,s=a3(c3(l));s!=null&&(j[e]=s)});var j1={styleDefault:"solid",familyDefault:u,cssPrefix:O1,replacementClass:W1,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};j.familyPrefix&&(j.cssPrefix=j.familyPrefix);var q=f(f({},j1),j);q.autoReplaceSvg||(q.observeMutations=!1);var o={};Object.keys(j1).forEach(c=>{Object.defineProperty(o,c,{enumerable:!0,set:function(a){q[c]=a,_.forEach(l=>l(o))},get:function(){return q[c]}})});Object.defineProperty(o,"familyPrefix",{enumerable:!0,set:function(c){q.cssPrefix=c,_.forEach(a=>a(o))},get:function(){return q.cssPrefix}});T.FontAwesomeConfig=o;var _=[];function l3(c){return _.push(c),()=>{_.splice(_.indexOf(c),1)}}var P=C2,x={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function e3(c){if(!c||!w)return;let a=L.createElement("style");a.setAttribute("type","text/css"),a.innerHTML=c;let l=L.head.childNodes,e=null;for(let s=l.length-1;s>-1;s--){let r=l[s],i=(r.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(e=r)}return L.head.insertBefore(a,e),c}var s3="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function X(){let c=12,a="";for(;c-- >0;)a+=s3[Math.random()*62|0];return a}function G(c){let a=[];for(let l=(c||[]).length>>>0;l--;)a[l]=c[l];return a}function U2(c){return c.classList?G(c.classList):(c.getAttribute("class")||"").split(" ").filter(a=>a)}function _1(c){return"".concat(c).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function r3(c){return Object.keys(c||{}).reduce((a,l)=>a+"".concat(l,'="').concat(_1(c[l]),'" '),"").trim()}function r2(c){return Object.keys(c||{}).reduce((a,l)=>a+"".concat(l,": ").concat(c[l].trim(),";"),"")}function I2(c){return c.size!==x.size||c.x!==x.x||c.y!==x.y||c.rotate!==x.rotate||c.flipX||c.flipY}function i3(c){let{transform:a,containerWidth:l,iconWidth:e}=c,s={transform:"translate(".concat(l/2," 256)")},r="translate(".concat(a.x*32,", ").concat(a.y*32,") "),i="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),n="rotate(".concat(a.rotate," 0 0)"),m={transform:"".concat(r," ").concat(i," ").concat(n)},t={transform:"translate(".concat(e/2*-1," -256)")};return{outer:s,inner:m,path:t}}function f3(c){let{transform:a,width:l=C2,height:e=C2,startCentered:s=!1}=c,r="";return s&&H1?r+="translate(".concat(a.x/P-l/2,"em, ").concat(a.y/P-e/2,"em) "):s?r+="translate(calc(-50% + ".concat(a.x/P,"em), calc(-50% + ").concat(a.y/P,"em)) "):r+="translate(".concat(a.x/P,"em, ").concat(a.y/P,"em) "),r+="scale(".concat(a.size/P*(a.flipX?-1:1),", ").concat(a.size/P*(a.flipY?-1:1),") "),r+="rotate(".concat(a.rotate,"deg) "),r}var n3=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}`;function X1(){let c=O1,a=W1,l=o.cssPrefix,e=o.replacementClass,s=n3;if(l!==c||e!==a){let r=new RegExp("\\.".concat(c,"\\-"),"g"),i=new RegExp("\\--".concat(c,"\\-"),"g"),n=new RegExp("\\.".concat(a),"g");s=s.replace(r,".".concat(l,"-")).replace(i,"--".concat(l,"-")).replace(n,".".concat(e))}return s}var M1=!1;function M2(){o.autoAddCss&&!M1&&(e3(X1()),M1=!0)}var o3={mixout(){return{dom:{css:X1,insertCss:M2}}},hooks(){return{beforeDOMElementCreation(){M2()},beforeI2svg(){M2()}}}},k=T||{};k[b]||(k[b]={});k[b].styles||(k[b].styles={});k[b].hooks||(k[b].hooks={});k[b].shims||(k[b].shims=[]);var S=k[b],Y1=[],Q1=function(){L.removeEventListener("DOMContentLoaded",Q1),l2=1,Y1.map(c=>c())},l2=!1;w&&(l2=(L.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(L.readyState),l2||L.addEventListener("DOMContentLoaded",Q1));function t3(c){w&&(l2?setTimeout(c,0):Y1.push(c))}function K(c){let{tag:a,attributes:l={},children:e=[]}=c;return typeof c=="string"?_1(c):"<".concat(a," ").concat(r3(l),">").concat(e.map(K).join(""),"</").concat(a,">")}function p1(c,a,l){if(c&&c[a]&&c[a][l])return{prefix:a,iconName:l,icon:c[a][l]}}var m3=function(a,l){return function(e,s,r,i){return a.call(l,e,s,r,i)}},p2=function(a,l,e,s){var r=Object.keys(a),i=r.length,n=s!==void 0?m3(l,s):l,m,t,z;for(e===void 0?(m=1,z=a[r[0]]):(m=0,z=e);m<i;m++)t=r[m],z=n(z,a[t],t,a);return z};function z3(c){let a=[],l=0,e=c.length;for(;l<e;){let s=c.charCodeAt(l++);if(s>=55296&&s<=56319&&l<e){let r=c.charCodeAt(l++);(r&64512)==56320?a.push(((s&1023)<<10)+(r&1023)+65536):(a.push(s),l--)}else a.push(s)}return a}function N2(c){let a=z3(c);return a.length===1?a[0].toString(16):null}function M3(c,a){let l=c.length,e=c.charCodeAt(a),s;return e>=55296&&e<=56319&&l>a+1&&(s=c.charCodeAt(a+1),s>=56320&&s<=57343)?(e-55296)*1024+s-56320+65536:e}function L1(c){return Object.keys(c).reduce((a,l)=>{let e=c[l];return!!e.icon?a[e.iconName]=e.icon:a[l]=e,a},{})}function b2(c,a){let l=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:e=!1}=l,s=L1(a);typeof S.hooks.addPack=="function"&&!e?S.hooks.addPack(c,L1(a)):S.styles[c]=f(f({},S.styles[c]||{}),s),c==="fas"&&b2("fa",a)}var{styles:Y,shims:p3}=S,K1=Object.keys(E2),L3=K1.reduce((c,a)=>(c[a]=Object.keys(E2[a]),c),{}),O2=null,$1={},J1={},Z1={},c4={},a4={};function u3(c){return~Z4.indexOf(c)}function d3(c,a){let l=a.split("-"),e=l[0],s=l.slice(1).join("-");return e===c&&s!==""&&!u3(s)?s:null}var l4=()=>{let c=e=>p2(Y,(s,r,i)=>(s[i]=p2(r,e,{}),s),{});$1=c((e,s,r)=>(s[3]&&(e[s[3]]=r),s[2]&&s[2].filter(n=>typeof n=="number").forEach(n=>{e[n.toString(16)]=r}),e)),J1=c((e,s,r)=>(e[r]=r,s[2]&&s[2].filter(n=>typeof n=="string").forEach(n=>{e[n]=r}),e)),a4=c((e,s,r)=>{let i=s[2];return e[r]=r,i.forEach(n=>{e[n]=r}),e});let a="far"in Y||o.autoFetchSvg,l=p2(p3,(e,s)=>{let r=s[0],i=s[1],n=s[2];return i==="far"&&!a&&(i="fas"),typeof r=="string"&&(e.names[r]={prefix:i,iconName:n}),typeof r=="number"&&(e.unicodes[r.toString(16)]={prefix:i,iconName:n}),e},{names:{},unicodes:{}});Z1=l.names,c4=l.unicodes,O2=i2(o.styleDefault,{family:o.familyDefault})};l3(c=>{O2=i2(c.styleDefault,{family:o.familyDefault})});l4();function W2(c,a){return($1[c]||{})[a]}function v3(c,a){return(J1[c]||{})[a]}function H(c,a){return(a4[c]||{})[a]}function e4(c){return Z1[c]||{prefix:null,iconName:null}}function C3(c){let a=c4[c],l=W2("fas",c);return a||(l?{prefix:"fas",iconName:l}:null)||{prefix:null,iconName:null}}function F(){return O2}var s4=()=>({prefix:null,iconName:null,rest:[]});function h3(c){let a=u,l=K1.reduce((e,s)=>(e[s]="".concat(o.cssPrefix,"-").concat(s),e),{});return U1.forEach(e=>{(c.includes(l[e])||c.some(s=>L3[e].includes(s)))&&(a=e)}),a}function i2(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:l=u}=a,e=Y4[l][c];if(l===s2&&!c)return"fad";let s=z1[l][c]||z1[l][e],r=c in S.styles?c:null;return s||r||null}function g3(c){let a=[],l=null;return c.forEach(e=>{let s=d3(o.cssPrefix,e);s?l=s:e&&a.push(e)}),{iconName:l,rest:a}}function u1(c){return c.sort().filter((a,l,e)=>e.indexOf(a)===l)}function f2(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:l=!1}=a,e=null,s=v2.concat(R4),r=u1(c.filter(p=>s.includes(p))),i=u1(c.filter(p=>!v2.includes(p))),n=r.filter(p=>(e=p,!E1.includes(p))),[m=null]=n,t=h3(r),z=f(f({},g3(i)),{},{prefix:i2(m,{family:t})});return f(f(f({},z),b3({values:c,family:t,styles:Y,config:o,canonical:z,givenPrefix:e})),x3(l,e,z))}function x3(c,a,l){let{prefix:e,iconName:s}=l;if(c||!e||!s)return{prefix:e,iconName:s};let r=a==="fa"?e4(s):{},i=H(e,s);return s=r.iconName||i||s,e=r.prefix||e,e==="far"&&!Y.far&&Y.fas&&!o.autoFetchSvg&&(e="fas"),{prefix:e,iconName:s}}var S3=U1.filter(c=>c!==u||c!==s2),N3=Object.keys(d2).filter(c=>c!==u).map(c=>Object.keys(d2[c])).flat();function b3(c){let{values:a,family:l,canonical:e,givenPrefix:s="",styles:r={},config:i={}}=c,n=l===s2,m=a.includes("fa-duotone")||a.includes("fad"),t=i.familyDefault==="duotone",z=e.prefix==="fad"||e.prefix==="fa-duotone";if(!n&&(m||t||z)&&(e.prefix="fad"),(a.includes("fa-brands")||a.includes("fab"))&&(e.prefix="fab"),!e.prefix&&S3.includes(l)&&(Object.keys(r).find(M=>N3.includes(M))||i.autoFetchSvg)){let M=y4.get(l).defaultShortPrefixId;e.prefix=M,e.iconName=H(e.prefix,e.iconName)||e.iconName}return(e.prefix==="fa"||s==="fa")&&(e.prefix=F()||"fas"),e}var k2=class{constructor(){this.definitions={}}add(){for(var a=arguments.length,l=new Array(a),e=0;e<a;e++)l[e]=arguments[e];let s=l.reduce(this._pullDefinitions,{});Object.keys(s).forEach(r=>{this.definitions[r]=f(f({},this.definitions[r]||{}),s[r]),b2(r,s[r]);let i=E2[u][r];i&&b2(i,s[r]),l4()})}reset(){this.definitions={}}_pullDefinitions(a,l){let e=l.prefix&&l.iconName&&l.icon?{0:l}:l;return Object.keys(e).map(s=>{let{prefix:r,iconName:i,icon:n}=e[s],m=n[2];a[r]||(a[r]={}),m.length>0&&m.forEach(t=>{typeof t=="string"&&(a[r][t]=n)}),a[r][i]=n}),a}},d1=[],O={},W={},k3=Object.keys(W);function w3(c,a){let{mixoutsTo:l}=a;return d1=c,O={},Object.keys(W).forEach(e=>{k3.indexOf(e)===-1&&delete W[e]}),d1.forEach(e=>{let s=e.mixout?e.mixout():{};if(Object.keys(s).forEach(r=>{typeof s[r]=="function"&&(l[r]=s[r]),typeof s[r]=="object"&&Object.keys(s[r]).forEach(i=>{l[r]||(l[r]={}),l[r][i]=s[r][i]})}),e.hooks){let r=e.hooks();Object.keys(r).forEach(i=>{O[i]||(O[i]=[]),O[i].push(r[i])})}e.provides&&e.provides(W)}),l}function w2(c,a){for(var l=arguments.length,e=new Array(l>2?l-2:0),s=2;s<l;s++)e[s-2]=arguments[s];return(O[c]||[]).forEach(i=>{a=i.apply(null,[a,...e])}),a}function E(c){for(var a=arguments.length,l=new Array(a>1?a-1:0),e=1;e<a;e++)l[e-1]=arguments[e];(O[c]||[]).forEach(r=>{r.apply(null,l)})}function B(){let c=arguments[0],a=Array.prototype.slice.call(arguments,1);return W[c]?W[c].apply(null,a):void 0}function y2(c){c.prefix==="fa"&&(c.prefix="fas");let{iconName:a}=c,l=c.prefix||F();if(a)return a=H(l,a)||a,p1(r4.definitions,l,a)||p1(S.styles,l,a)}var r4=new k2,y3=()=>{o.autoReplaceSvg=!1,o.observeMutations=!1,E("noAuto")},A3={i2svg:function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return w?(E("beforeI2svg",c),B("pseudoElements2svg",c),B("i2svg",c)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:a}=c;o.autoReplaceSvg===!1&&(o.autoReplaceSvg=!0),o.observeMutations=!0,t3(()=>{T3({autoReplaceSvgRoot:a}),E("watch",c)})}},P3={icon:c=>{if(c===null)return null;if(typeof c=="object"&&c.prefix&&c.iconName)return{prefix:c.prefix,iconName:H(c.prefix,c.iconName)||c.iconName};if(Array.isArray(c)&&c.length===2){let a=c[1].indexOf("fa-")===0?c[1].slice(3):c[1],l=i2(c[0]);return{prefix:l,iconName:H(l,a)||a}}if(typeof c=="string"&&(c.indexOf("".concat(o.cssPrefix,"-"))>-1||c.match(Q4))){let a=f2(c.split(" "),{skipLookups:!0});return{prefix:a.prefix||F(),iconName:H(a.prefix,a.iconName)||a.iconName}}if(typeof c=="string"){let a=F();return{prefix:a,iconName:H(a,c)||c}}}},C={noAuto:y3,config:o,dom:A3,parse:P3,library:r4,findIconDefinition:y2,toHtml:K},T3=function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:a=L}=c;(Object.keys(S.styles).length>0||o.autoFetchSvg)&&w&&o.autoReplaceSvg&&C.dom.i2svg({node:a})};function n2(c,a){return Object.defineProperty(c,"abstract",{get:a}),Object.defineProperty(c,"html",{get:function(){return c.abstract.map(l=>K(l))}}),Object.defineProperty(c,"node",{get:function(){if(!w)return;let l=L.createElement("div");return l.innerHTML=c.html,l.children}}),c}function F3(c){let{children:a,main:l,mask:e,attributes:s,styles:r,transform:i}=c;if(I2(i)&&l.found&&!e.found){let{width:n,height:m}=l,t={x:n/m/2,y:.5};s.style=r2(f(f({},r),{},{"transform-origin":"".concat(t.x+i.x/16,"em ").concat(t.y+i.y/16,"em")}))}return[{tag:"svg",attributes:s,children:a}]}function B3(c){let{prefix:a,iconName:l,children:e,attributes:s,symbol:r}=c,i=r===!0?"".concat(a,"-").concat(o.cssPrefix,"-").concat(l):r;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:f(f({},s),{},{id:i}),children:e}]}]}function q2(c){let{icons:{main:a,mask:l},prefix:e,iconName:s,transform:r,symbol:i,title:n,maskId:m,titleId:t,extra:z,watchable:p=!1}=c,{width:M,height:d}=l.found?l:a,y=B4.includes(e),D=[o.replacementClass,s?"".concat(o.cssPrefix,"-").concat(s):""].filter(I=>z.classes.indexOf(I)===-1).filter(I=>I!==""||!!I).concat(z.classes).join(" "),h={children:[],attributes:f(f({},z.attributes),{},{"data-prefix":e,"data-icon":s,class:D,role:z.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(M," ").concat(d)})},N=y&&!~z.classes.indexOf("fa-fw")?{width:"".concat(M/d*16*.0625,"em")}:{};p&&(h.attributes[R]=""),n&&(h.children.push({tag:"title",attributes:{id:h.attributes["aria-labelledby"]||"title-".concat(t||X())},children:[n]}),delete h.attributes.title);let v=f(f({},h),{},{prefix:e,iconName:s,main:a,mask:l,maskId:m,transform:r,symbol:i,styles:f(f({},N),z.styles)}),{children:g,attributes:U}=l.found&&a.found?B("generateAbstractMask",v)||{children:[],attributes:{}}:B("generateAbstractIcon",v)||{children:[],attributes:{}};return v.children=g,v.attributes=U,i?B3(v):F3(v)}function v1(c){let{content:a,width:l,height:e,transform:s,title:r,extra:i,watchable:n=!1}=c,m=f(f(f({},i.attributes),r?{title:r}:{}),{},{class:i.classes.join(" ")});n&&(m[R]="");let t=f({},i.styles);I2(s)&&(t.transform=f3({transform:s,startCentered:!0,width:l,height:e}),t["-webkit-transform"]=t.transform);let z=r2(t);z.length>0&&(m.style=z);let p=[];return p.push({tag:"span",attributes:m,children:[a]}),r&&p.push({tag:"span",attributes:{class:"sr-only"},children:[r]}),p}function D3(c){let{content:a,title:l,extra:e}=c,s=f(f(f({},e.attributes),l?{title:l}:{}),{},{class:e.classes.join(" ")}),r=r2(e.styles);r.length>0&&(s.style=r);let i=[];return i.push({tag:"span",attributes:s,children:[a]}),l&&i.push({tag:"span",attributes:{class:"sr-only"},children:[l]}),i}var{styles:L2}=S;function A2(c){let a=c[0],l=c[1],[e]=c.slice(4),s=null;return Array.isArray(e)?s={tag:"g",attributes:{class:"".concat(o.cssPrefix,"-").concat(z2.GROUP)},children:[{tag:"path",attributes:{class:"".concat(o.cssPrefix,"-").concat(z2.SECONDARY),fill:"currentColor",d:e[0]}},{tag:"path",attributes:{class:"".concat(o.cssPrefix,"-").concat(z2.PRIMARY),fill:"currentColor",d:e[1]}}]}:s={tag:"path",attributes:{fill:"currentColor",d:e}},{found:!0,width:a,height:l,icon:s}}var H3={found:!1,width:512,height:512};function R3(c,a){!q1&&!o.showMissingIcons&&c&&console.error('Icon with name "'.concat(c,'" and prefix "').concat(a,'" is missing.'))}function P2(c,a){let l=a;return a==="fa"&&o.styleDefault!==null&&(a=F()),new Promise((e,s)=>{if(l==="fa"){let r=e4(c)||{};c=r.iconName||c,a=r.prefix||a}if(c&&a&&L2[a]&&L2[a][c]){let r=L2[a][c];return e(A2(r))}R3(c,a),e(f(f({},H3),{},{icon:o.showMissingIcons&&c?B("missingIconAbstract")||{}:{}}))})}var C1=()=>{},T2=o.measurePerformance&&J&&J.mark&&J.measure?J:{mark:C1,measure:C1},V='FA "6.7.2"',E3=c=>(T2.mark("".concat(V," ").concat(c," begins")),()=>i4(c)),i4=c=>{T2.mark("".concat(V," ").concat(c," ends")),T2.measure("".concat(V," ").concat(c),"".concat(V," ").concat(c," begins"),"".concat(V," ").concat(c," ends"))},G2={begin:E3,end:i4},c2=()=>{};function h1(c){return typeof(c.getAttribute?c.getAttribute(R):null)=="string"}function U3(c){let a=c.getAttribute?c.getAttribute(H2):null,l=c.getAttribute?c.getAttribute(R2):null;return a&&l}function I3(c){return c&&c.classList&&c.classList.contains&&c.classList.contains(o.replacementClass)}function O3(){return o.autoReplaceSvg===!0?a2.replace:a2[o.autoReplaceSvg]||a2.replace}function W3(c){return L.createElementNS("http://www.w3.org/2000/svg",c)}function q3(c){return L.createElement(c)}function f4(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:l=c.tag==="svg"?W3:q3}=a;if(typeof c=="string")return L.createTextNode(c);let e=l(c.tag);return Object.keys(c.attributes||[]).forEach(function(r){e.setAttribute(r,c.attributes[r])}),(c.children||[]).forEach(function(r){e.appendChild(f4(r,{ceFn:l}))}),e}function G3(c){let a=" ".concat(c.outerHTML," ");return a="".concat(a,"Font Awesome fontawesome.com "),a}var a2={replace:function(c){let a=c[0];if(a.parentNode)if(c[1].forEach(l=>{a.parentNode.insertBefore(f4(l),a)}),a.getAttribute(R)===null&&o.keepOriginalSource){let l=L.createComment(G3(a));a.parentNode.replaceChild(l,a)}else a.remove()},nest:function(c){let a=c[0],l=c[1];if(~U2(a).indexOf(o.replacementClass))return a2.replace(c);let e=new RegExp("".concat(o.cssPrefix,"-.*"));if(delete l[0].attributes.id,l[0].attributes.class){let r=l[0].attributes.class.split(" ").reduce((i,n)=>(n===o.replacementClass||n.match(e)?i.toSvg.push(n):i.toNode.push(n),i),{toNode:[],toSvg:[]});l[0].attributes.class=r.toSvg.join(" "),r.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",r.toNode.join(" "))}let s=l.map(r=>K(r)).join(`
`);a.setAttribute(R,""),a.innerHTML=s}};function g1(c){c()}function n4(c,a){let l=typeof a=="function"?a:c2;if(c.length===0)l();else{let e=g1;o.mutateApproach===_4&&(e=T.requestAnimationFrame||g1),e(()=>{let s=O3(),r=G2.begin("mutate");c.map(s),r(),l()})}}var V2=!1;function o4(){V2=!0}function F2(){V2=!1}var e2=null;function x1(c){if(!n1||!o.observeMutations)return;let{treeCallback:a=c2,nodeCallback:l=c2,pseudoElementsCallback:e=c2,observeMutationsRoot:s=L}=c;e2=new n1(r=>{if(V2)return;let i=F();G(r).forEach(n=>{if(n.type==="childList"&&n.addedNodes.length>0&&!h1(n.addedNodes[0])&&(o.searchPseudoElements&&e(n.target),a(n.target)),n.type==="attributes"&&n.target.parentNode&&o.searchPseudoElements&&e(n.target.parentNode),n.type==="attributes"&&h1(n.target)&&~J4.indexOf(n.attributeName))if(n.attributeName==="class"&&U3(n.target)){let{prefix:m,iconName:t}=f2(U2(n.target));n.target.setAttribute(H2,m||i),t&&n.target.setAttribute(R2,t)}else I3(n.target)&&l(n.target)})}),w&&e2.observe(s,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function V3(){e2&&e2.disconnect()}function j3(c){let a=c.getAttribute("style"),l=[];return a&&(l=a.split(";").reduce((e,s)=>{let r=s.split(":"),i=r[0],n=r.slice(1);return i&&n.length>0&&(e[i]=n.join(":").trim()),e},{})),l}function _3(c){let a=c.getAttribute("data-prefix"),l=c.getAttribute("data-icon"),e=c.innerText!==void 0?c.innerText.trim():"",s=f2(U2(c));return s.prefix||(s.prefix=F()),a&&l&&(s.prefix=a,s.iconName=l),s.iconName&&s.prefix||(s.prefix&&e.length>0&&(s.iconName=v3(s.prefix,c.innerText)||W2(s.prefix,N2(c.innerText))),!s.iconName&&o.autoFetchSvg&&c.firstChild&&c.firstChild.nodeType===Node.TEXT_NODE&&(s.iconName=c.firstChild.data)),s}function X3(c){let a=G(c.attributes).reduce((s,r)=>(s.name!=="class"&&s.name!=="style"&&(s[r.name]=r.value),s),{}),l=c.getAttribute("title"),e=c.getAttribute("data-fa-title-id");return o.autoA11y&&(l?a["aria-labelledby"]="".concat(o.replacementClass,"-title-").concat(e||X()):(a["aria-hidden"]="true",a.focusable="false")),a}function Y3(){return{iconName:null,title:null,titleId:null,prefix:null,transform:x,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function S1(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:l,prefix:e,rest:s}=_3(c),r=X3(c),i=w2("parseNodeAttributes",{},c),n=a.styleParser?j3(c):[];return f({iconName:l,title:c.getAttribute("title"),titleId:c.getAttribute("data-fa-title-id"),prefix:e,transform:x,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:s,styles:n,attributes:r}},i)}var{styles:Q3}=S;function t4(c){let a=o.autoReplaceSvg==="nest"?S1(c,{styleParser:!1}):S1(c);return~a.extra.classes.indexOf(V1)?B("generateLayersText",c,a):B("generateSvgReplacementMutation",c,a)}function K3(){return[...P4,...v2]}function N1(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!w)return Promise.resolve();let l=L.documentElement.classList,e=z=>l.add("".concat(m1,"-").concat(z)),s=z=>l.remove("".concat(m1,"-").concat(z)),r=o.autoFetchSvg?K3():E1.concat(Object.keys(Q3));r.includes("fa")||r.push("fa");let i=[".".concat(V1,":not([").concat(R,"])")].concat(r.map(z=>".".concat(z,":not([").concat(R,"])"))).join(", ");if(i.length===0)return Promise.resolve();let n=[];try{n=G(c.querySelectorAll(i))}catch{}if(n.length>0)e("pending"),s("complete");else return Promise.resolve();let m=G2.begin("onTree"),t=n.reduce((z,p)=>{try{let M=t4(p);M&&z.push(M)}catch(M){q1||M.name==="MissingIcon"&&console.error(M)}return z},[]);return new Promise((z,p)=>{Promise.all(t).then(M=>{n4(M,()=>{e("active"),e("complete"),s("pending"),typeof a=="function"&&a(),m(),z()})}).catch(M=>{m(),p(M)})})}function $3(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;t4(c).then(l=>{l&&n4([l],a)})}function J3(c){return function(a){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=(a||{}).icon?a:y2(a||{}),{mask:s}=l;return s&&(s=(s||{}).icon?s:y2(s||{})),c(e,f(f({},l),{},{mask:s}))}}var Z3=function(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:l=x,symbol:e=!1,mask:s=null,maskId:r=null,title:i=null,titleId:n=null,classes:m=[],attributes:t={},styles:z={}}=a;if(!c)return;let{prefix:p,iconName:M,icon:d}=c;return n2(f({type:"icon"},c),()=>(E("beforeDOMElementCreation",{iconDefinition:c,params:a}),o.autoA11y&&(i?t["aria-labelledby"]="".concat(o.replacementClass,"-title-").concat(n||X()):(t["aria-hidden"]="true",t.focusable="false")),q2({icons:{main:A2(d),mask:s?A2(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:p,iconName:M,transform:f(f({},x),l),symbol:e,title:i,maskId:r,titleId:n,extra:{attributes:t,styles:z,classes:m}})))},c0={mixout(){return{icon:J3(Z3)}},hooks(){return{mutationObserverCallbacks(c){return c.treeCallback=N1,c.nodeCallback=$3,c}}},provides(c){c.i2svg=function(a){let{node:l=L,callback:e=()=>{}}=a;return N1(l,e)},c.generateSvgReplacementMutation=function(a,l){let{iconName:e,title:s,titleId:r,prefix:i,transform:n,symbol:m,mask:t,maskId:z,extra:p}=l;return new Promise((M,d)=>{Promise.all([P2(e,i),t.iconName?P2(t.iconName,t.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(y=>{let[D,h]=y;M([a,q2({icons:{main:D,mask:h},prefix:i,iconName:e,transform:n,symbol:m,maskId:z,title:s,titleId:r,extra:p,watchable:!0})])}).catch(d)})},c.generateAbstractIcon=function(a){let{children:l,attributes:e,main:s,transform:r,styles:i}=a,n=r2(i);n.length>0&&(e.style=n);let m;return I2(r)&&(m=B("generateAbstractTransformGrouping",{main:s,transform:r,containerWidth:s.width,iconWidth:s.width})),l.push(m||s.icon),{children:l,attributes:e}}}},a0={mixout(){return{layer(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:l=[]}=a;return n2({type:"layer"},()=>{E("beforeDOMElementCreation",{assembler:c,params:a});let e=[];return c(s=>{Array.isArray(s)?s.map(r=>{e=e.concat(r.abstract)}):e=e.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(o.cssPrefix,"-layers"),...l].join(" ")},children:e}]})}}}},l0={mixout(){return{counter(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:l=null,classes:e=[],attributes:s={},styles:r={}}=a;return n2({type:"counter",content:c},()=>(E("beforeDOMElementCreation",{content:c,params:a}),D3({content:c.toString(),title:l,extra:{attributes:s,styles:r,classes:["".concat(o.cssPrefix,"-layers-counter"),...e]}})))}}}},e0={mixout(){return{text(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:l=x,title:e=null,classes:s=[],attributes:r={},styles:i={}}=a;return n2({type:"text",content:c},()=>(E("beforeDOMElementCreation",{content:c,params:a}),v1({content:c,transform:f(f({},x),l),title:e,extra:{attributes:r,styles:i,classes:["".concat(o.cssPrefix,"-layers-text"),...s]}})))}}},provides(c){c.generateLayersText=function(a,l){let{title:e,transform:s,extra:r}=l,i=null,n=null;if(H1){let m=parseInt(getComputedStyle(a).fontSize,10),t=a.getBoundingClientRect();i=t.width/m,n=t.height/m}return o.autoA11y&&!e&&(r.attributes["aria-hidden"]="true"),Promise.resolve([a,v1({content:a.innerHTML,width:i,height:n,transform:s,title:e,extra:r,watchable:!0})])}}},s0=new RegExp('"',"ug"),b1=[1105920,1112319],k1=f(f(f(f({},{FontAwesome:{normal:"fas",400:"fas"}}),w4),V4),E4),B2=Object.keys(k1).reduce((c,a)=>(c[a.toLowerCase()]=k1[a],c),{}),r0=Object.keys(B2).reduce((c,a)=>{let l=B2[a];return c[a]=l[900]||[...Object.entries(l)][0][1],c},{});function i0(c){let a=c.replace(s0,""),l=M3(a,0),e=l>=b1[0]&&l<=b1[1],s=a.length===2?a[0]===a[1]:!1;return{value:N2(s?a[0]:a),isSecondary:e||s}}function f0(c,a){let l=c.replace(/^['"]|['"]$/g,"").toLowerCase(),e=parseInt(a),s=isNaN(e)?"normal":e;return(B2[l]||{})[s]||r0[l]}function w1(c,a){let l="".concat(j4).concat(a.replace(":","-"));return new Promise((e,s)=>{if(c.getAttribute(l)!==null)return e();let i=G(c.children).filter(M=>M.getAttribute(h2)===a)[0],n=T.getComputedStyle(c,a),m=n.getPropertyValue("font-family"),t=m.match(K4),z=n.getPropertyValue("font-weight"),p=n.getPropertyValue("content");if(i&&!t)return c.removeChild(i),e();if(t&&p!=="none"&&p!==""){let M=n.getPropertyValue("content"),d=f0(m,z),{value:y,isSecondary:D}=i0(M),h=t[0].startsWith("FontAwesome"),N=W2(d,y),v=N;if(h){let g=C3(y);g.iconName&&g.prefix&&(N=g.iconName,d=g.prefix)}if(N&&!D&&(!i||i.getAttribute(H2)!==d||i.getAttribute(R2)!==v)){c.setAttribute(l,v),i&&c.removeChild(i);let g=Y3(),{extra:U}=g;U.attributes[h2]=a,P2(N,d).then(I=>{let u4=q2(f(f({},g),{},{icons:{main:I,mask:s4()},prefix:d,iconName:v,extra:U,watchable:!0})),o2=L.createElementNS("http://www.w3.org/2000/svg","svg");a==="::before"?c.insertBefore(o2,c.firstChild):c.appendChild(o2),o2.outerHTML=u4.map(d4=>K(d4)).join(`
`),c.removeAttribute(l),e()}).catch(s)}else e()}else e()})}function n0(c){return Promise.all([w1(c,"::before"),w1(c,"::after")])}function o0(c){return c.parentNode!==document.head&&!~X4.indexOf(c.tagName.toUpperCase())&&!c.getAttribute(h2)&&(!c.parentNode||c.parentNode.tagName!=="svg")}function y1(c){if(w)return new Promise((a,l)=>{let e=G(c.querySelectorAll("*")).filter(o0).map(n0),s=G2.begin("searchPseudoElements");o4(),Promise.all(e).then(()=>{s(),F2(),a()}).catch(()=>{s(),F2(),l()})})}var t0={hooks(){return{mutationObserverCallbacks(c){return c.pseudoElementsCallback=y1,c}}},provides(c){c.pseudoElements2svg=function(a){let{node:l=L}=a;o.searchPseudoElements&&y1(l)}}},A1=!1,m0={mixout(){return{dom:{unwatch(){o4(),A1=!0}}}},hooks(){return{bootstrap(){x1(w2("mutationObserverCallbacks",{}))},noAuto(){V3()},watch(c){let{observeMutationsRoot:a}=c;A1?F2():x1(w2("mutationObserverCallbacks",{observeMutationsRoot:a}))}}}},P1=c=>{let a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return c.toLowerCase().split(" ").reduce((l,e)=>{let s=e.toLowerCase().split("-"),r=s[0],i=s.slice(1).join("-");if(r&&i==="h")return l.flipX=!0,l;if(r&&i==="v")return l.flipY=!0,l;if(i=parseFloat(i),isNaN(i))return l;switch(r){case"grow":l.size=l.size+i;break;case"shrink":l.size=l.size-i;break;case"left":l.x=l.x-i;break;case"right":l.x=l.x+i;break;case"up":l.y=l.y-i;break;case"down":l.y=l.y+i;break;case"rotate":l.rotate=l.rotate+i;break}return l},a)},z0={mixout(){return{parse:{transform:c=>P1(c)}}},hooks(){return{parseNodeAttributes(c,a){let l=a.getAttribute("data-fa-transform");return l&&(c.transform=P1(l)),c}}},provides(c){c.generateAbstractTransformGrouping=function(a){let{main:l,transform:e,containerWidth:s,iconWidth:r}=a,i={transform:"translate(".concat(s/2," 256)")},n="translate(".concat(e.x*32,", ").concat(e.y*32,") "),m="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),t="rotate(".concat(e.rotate," 0 0)"),z={transform:"".concat(n," ").concat(m," ").concat(t)},p={transform:"translate(".concat(r/2*-1," -256)")},M={outer:i,inner:z,path:p};return{tag:"g",attributes:f({},M.outer),children:[{tag:"g",attributes:f({},M.inner),children:[{tag:l.icon.tag,children:l.icon.children,attributes:f(f({},l.icon.attributes),M.path)}]}]}}}},u2={x:0,y:0,width:"100%",height:"100%"};function T1(c){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return c.attributes&&(c.attributes.fill||a)&&(c.attributes.fill="black"),c}function M0(c){return c.tag==="g"?c.children:[c]}var p0={hooks(){return{parseNodeAttributes(c,a){let l=a.getAttribute("data-fa-mask"),e=l?f2(l.split(" ").map(s=>s.trim())):s4();return e.prefix||(e.prefix=F()),c.mask=e,c.maskId=a.getAttribute("data-fa-mask-id"),c}}},provides(c){c.generateAbstractMask=function(a){let{children:l,attributes:e,main:s,mask:r,maskId:i,transform:n}=a,{width:m,icon:t}=s,{width:z,icon:p}=r,M=i3({transform:n,containerWidth:z,iconWidth:m}),d={tag:"rect",attributes:f(f({},u2),{},{fill:"white"})},y=t.children?{children:t.children.map(T1)}:{},D={tag:"g",attributes:f({},M.inner),children:[T1(f({tag:t.tag,attributes:f(f({},t.attributes),M.path)},y))]},h={tag:"g",attributes:f({},M.outer),children:[D]},N="mask-".concat(i||X()),v="clip-".concat(i||X()),g={tag:"mask",attributes:f(f({},u2),{},{id:N,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[d,h]},U={tag:"defs",children:[{tag:"clipPath",attributes:{id:v},children:M0(p)},g]};return l.push(U,{tag:"rect",attributes:f({fill:"currentColor","clip-path":"url(#".concat(v,")"),mask:"url(#".concat(N,")")},u2)}),{children:l,attributes:e}}}},L0={provides(c){let a=!1;T.matchMedia&&(a=T.matchMedia("(prefers-reduced-motion: reduce)").matches),c.missingIconAbstract=function(){let l=[],e={fill:"currentColor"},s={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};l.push({tag:"path",attributes:f(f({},e),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let r=f(f({},s),{},{attributeName:"opacity"}),i={tag:"circle",attributes:f(f({},e),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||i.children.push({tag:"animate",attributes:f(f({},s),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:f(f({},r),{},{values:"1;0;1;1;0;1;"})}),l.push(i),l.push({tag:"path",attributes:f(f({},e),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:f(f({},r),{},{values:"1;0;0;0;0;1;"})}]}),a||l.push({tag:"path",attributes:f(f({},e),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:f(f({},r),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:l}}}},u0={hooks(){return{parseNodeAttributes(c,a){let l=a.getAttribute("data-fa-symbol"),e=l===null?!1:l===""?!0:l;return c.symbol=e,c}}}},d0=[o3,c0,a0,l0,e0,t0,m0,z0,p0,L0,u0];w3(d0,{mixoutsTo:C});var D0=C.noAuto,m4=C.config,H0=C.library,z4=C.dom,M4=C.parse,R0=C.findIconDefinition,E0=C.toHtml,p4=C.icon,U0=C.layer,v0=C.text,C0=C.counter;var h0=["*"],g0=c=>{throw new Error(`Could not find icon with iconName=${c.iconName} and prefix=${c.prefix} in the icon library.`)},x0=()=>{throw new Error("Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.")},S0=c=>{let a={[`fa-${c.animation}`]:c.animation!=null&&!c.animation.startsWith("spin"),"fa-spin":c.animation==="spin"||c.animation==="spin-reverse","fa-spin-pulse":c.animation==="spin-pulse"||c.animation==="spin-pulse-reverse","fa-spin-reverse":c.animation==="spin-reverse"||c.animation==="spin-pulse-reverse","fa-pulse":c.animation==="spin-pulse"||c.animation==="spin-pulse-reverse","fa-fw":c.fixedWidth,"fa-border":c.border,"fa-inverse":c.inverse,"fa-layers-counter":c.counter,"fa-flip-horizontal":c.flip==="horizontal"||c.flip==="both","fa-flip-vertical":c.flip==="vertical"||c.flip==="both",[`fa-${c.size}`]:c.size!==null,[`fa-rotate-${c.rotate}`]:c.rotate!==null,[`fa-pull-${c.pull}`]:c.pull!==null,[`fa-stack-${c.stackItemSize}`]:c.stackItemSize!=null};return Object.keys(a).map(l=>a[l]?l:null).filter(l=>l)},j2=new WeakSet,L4="fa-auto-css";function N0(c,a){if(!a.autoAddCss||j2.has(c))return;if(c.getElementById(L4)!=null){a.autoAddCss=!1,j2.add(c);return}let l=c.createElement("style");l.setAttribute("type","text/css"),l.setAttribute("id",L4),l.innerHTML=z4.css();let e=c.head.childNodes,s=null;for(let r=e.length-1;r>-1;r--){let i=e[r],n=i.nodeName.toUpperCase();["STYLE","LINK"].indexOf(n)>-1&&(s=i)}c.head.insertBefore(l,s),a.autoAddCss=!1,j2.add(c)}var b0=c=>c.prefix!==void 0&&c.iconName!==void 0,k0=(c,a)=>b0(c)?c:Array.isArray(c)&&c.length===2?{prefix:c[0],iconName:c[1]}:{prefix:a,iconName:c},w0=(()=>{class c{constructor(){this.defaultPrefix="fas",this.fallbackIcon=null,this._autoAddCss=!0}set autoAddCss(l){m4.autoAddCss=l,this._autoAddCss=l}get autoAddCss(){return this._autoAddCss}static{this.\u0275fac=function(e){return new(e||c)}}static{this.\u0275prov=t2({token:c,factory:c.\u0275fac,providedIn:"root"})}}return c})(),y0=(()=>{class c{constructor(){this.definitions={}}addIcons(...l){for(let e of l){e.prefix in this.definitions||(this.definitions[e.prefix]={}),this.definitions[e.prefix][e.iconName]=e;for(let s of e.icon[2])typeof s=="string"&&(this.definitions[e.prefix][s]=e)}}addIconPacks(...l){for(let e of l){let s=Object.keys(e).map(r=>e[r]);this.addIcons(...s)}}getIconDefinition(l,e){return l in this.definitions&&e in this.definitions[l]?this.definitions[l][e]:null}static{this.\u0275fac=function(e){return new(e||c)}}static{this.\u0275prov=t2({token:c,factory:c.\u0275fac,providedIn:"root"})}}return c})(),A0=(()=>{class c{constructor(){this.stackItemSize="1x"}ngOnChanges(l){if("size"in l)throw new Error('fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.')}static{this.\u0275fac=function(e){return new(e||c)}}static{this.\u0275dir=J2({type:c,selectors:[["fa-icon","stackItemSize",""],["fa-duotone-icon","stackItemSize",""]],inputs:{stackItemSize:"stackItemSize",size:"size"},features:[$]})}}return c})(),P0=(()=>{class c{constructor(l,e){this.renderer=l,this.elementRef=e}ngOnInit(){this.renderer.addClass(this.elementRef.nativeElement,"fa-stack")}ngOnChanges(l){"size"in l&&(l.size.currentValue!=null&&this.renderer.addClass(this.elementRef.nativeElement,`fa-${l.size.currentValue}`),l.size.previousValue!=null&&this.renderer.removeClass(this.elementRef.nativeElement,`fa-${l.size.previousValue}`))}static{this.\u0275fac=function(e){return new(e||c)(A(K2),A(Y2))}}static{this.\u0275cmp=m2({type:c,selectors:[["fa-stack"]],inputs:{size:"size"},features:[$],ngContentSelectors:h0,decls:1,vars:0,template:function(e,s){e&1&&(a1(),l1(0))},encapsulation:2})}}return c})(),a6=(()=>{class c{constructor(l,e,s,r,i){this.sanitizer=l,this.config=e,this.iconLibrary=s,this.stackItem=r,this.document=X2(e1),i!=null&&r==null&&console.error('FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x"></fa-icon>.')}ngOnChanges(l){if(this.icon==null&&this.config.fallbackIcon==null){x0();return}if(l){let e=this.findIconDefinition(this.icon??this.config.fallbackIcon);if(e!=null){let s=this.buildParams();N0(this.document,this.config);let r=p4(e,s);this.renderedIconHTML=this.sanitizer.bypassSecurityTrustHtml(r.html.join(`
`))}}}render(){this.ngOnChanges({})}findIconDefinition(l){let e=k0(l,this.config.defaultPrefix);if("icon"in e)return e;let s=this.iconLibrary.getIconDefinition(e.prefix,e.iconName);return s??(g0(e),null)}buildParams(){let l={flip:this.flip,animation:this.animation,border:this.border,inverse:this.inverse,size:this.size||null,pull:this.pull||null,rotate:this.rotate||null,fixedWidth:typeof this.fixedWidth=="boolean"?this.fixedWidth:this.config.fixedWidth,stackItemSize:this.stackItem!=null?this.stackItem.stackItemSize:null},e=typeof this.transform=="string"?M4.transform(this.transform):this.transform;return{title:this.title,transform:e,classes:S0(l),mask:this.mask!=null?this.findIconDefinition(this.mask):null,symbol:this.symbol,attributes:{role:this.a11yRole}}}static{this.\u0275fac=function(e){return new(e||c)(A(s1),A(w0),A(y0),A(A0,8),A(P0,8))}}static{this.\u0275cmp=m2({type:c,selectors:[["fa-icon"]],hostAttrs:[1,"ng-fa-icon"],hostVars:2,hostBindings:function(e,s){e&2&&(c1("innerHTML",s.renderedIconHTML,Q2),Z2("title",s.title))},inputs:{icon:"icon",title:"title",animation:"animation",mask:"mask",flip:"flip",size:"size",pull:"pull",border:"border",inverse:"inverse",symbol:"symbol",rotate:"rotate",fixedWidth:"fixedWidth",transform:"transform",a11yRole:"a11yRole"},features:[$],decls:0,vars:0,template:function(e,s){},encapsulation:2})}}return c})();var l6=(()=>{class c{static{this.\u0275fac=function(e){return new(e||c)}}static{this.\u0275mod=$2({type:c})}static{this.\u0275inj=_2({})}}return c})();var s6={prefix:"fas",iconName:"laptop-code",icon:[640,512,[],"f5fc","M64 96c0-35.3 28.7-64 64-64l384 0c35.3 0 64 28.7 64 64l0 240-64 0 0-240-384 0 0 240-64 0 0-240zM0 403.2C0 392.6 8.6 384 19.2 384l601.6 0c10.6 0 19.2 8.6 19.2 19.2 0 42.4-34.4 76.8-76.8 76.8L76.8 480C34.4 480 0 445.6 0 403.2zM281 209l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM393 175l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"]};var r6={prefix:"fas",iconName:"server",icon:[448,512,[],"f233","M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm216 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm216 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"]};var i6={prefix:"fas",iconName:"plug",icon:[448,512,[128268],"f1e6","M128-32c17.7 0 32 14.3 32 32l0 96 128 0 0-96c0-17.7 14.3-32 32-32s32 14.3 32 32l0 96 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 64c0 95.1-69.2 174.1-160 189.3l0 66.7c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-66.7C101.2 398.1 32 319.1 32 224l0-64c-17.7 0-32-14.3-32-32S14.3 96 32 96l64 0 0-96c0-17.7 14.3-32 32-32z"]};var f6={prefix:"fas",iconName:"robot",icon:[640,512,[129302],"f544","M352 0c0-17.7-14.3-32-32-32S288-17.7 288 0l0 64-96 0c-53 0-96 43-96 96l0 224c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-224c0-53-43-96-96-96l-96 0 0-64zM160 368c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zm120 0c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zm120 0c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zM224 176a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm144 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM64 224c0-17.7-14.3-32-32-32S0 206.3 0 224l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96zm544-32c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32z"]};var n6={prefix:"fas",iconName:"desktop",icon:[512,512,[128421,61704,"desktop-alt"],"f390","M64 32C28.7 32 0 60.7 0 96L0 352c0 35.3 28.7 64 64 64l144 0-16 48-72 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l272 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-72 0-16-48 144 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 32zM96 96l320 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32L96 320c-17.7 0-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32z"]};var o6={prefix:"fas",iconName:"gamepad",icon:[640,512,[],"f11b","M448 64c106 0 192 86 192 192S554 448 448 448l-256 0C86 448 0 362 0 256S86 64 192 64l256 0zM192 176c-13.3 0-24 10.7-24 24l0 32-32 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l32 0 0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-32 32 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-32 0 0-32c0-13.3-10.7-24-24-24zm240 96a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm64-96a32 32 0 1 0 0 64 32 32 0 1 0 0-64z"]};export{a6 as a,l6 as b,s6 as c,r6 as d,i6 as e,f6 as f,n6 as g,o6 as h};

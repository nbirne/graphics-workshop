import{s as n,l as e,a as o,b as t,r,t as i,c as a,p as c}from"./vendor.7e6f1bd5.js";!function(n=".",e="__import__"){try{self[e]=new Function("u","return import(u)")}catch(o){const t=new URL(n,location),r=n=>{URL.revokeObjectURL(n.src),n.remove()};self[e]=n=>new Promise(((o,i)=>{const a=new URL(n,t);if(self[e].moduleMap[a])return o(self[e].moduleMap[a]);const c=new Blob([`import * as m from '${a}';`,`${e}.moduleMap['${a}']=m;`],{type:"text/javascript"}),s=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(c),onerror(){i(new Error(`Failed to import: ${n}`)),r(s)},onload(){o(self[e].moduleMap[a]),r(s)}});document.head.appendChild(s)})),self[e].moduleMap={}}}("/graphics-workshop/assets/");var s="/graphics-workshop/assets/teapot.obj.40bf042c.json";const l={quiltFrag:"precision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\nuniform float seed;\n\nvoid main() {\n    vec2 coord = gl_FragCoord.xy / resolution;\n\n    // Output RGB color in range from 0.0 to 1.0\n    vec3 color = vec3(coord.x, coord.y, 0.0);\n    color.z += abs(sin(time));\n\n    // 1. Uncomment these lines to draw triangles\n    vec2 squareCoord = 20.0 * gl_FragCoord.xy / resolution.y + vec2(time);\n    vec2 loc = fract(squareCoord);\n    color = vec3(smoothstep(-0.05, 0.05, loc.y - loc.x));\n\n    // 2. Uncomment these lines to invert some of the triangles\n    // vec2 cell = squareCoord - loc;\n    // if (mod(2.0 * cell.x + cell.y, 5.0) == 1.0) {\n    //     color = 1.0 - color;\n    // }\n    \n    vec2 cell = squareCoord - loc;\n    if (mod(3.0 * cell.x + cell.y, 4.0) > 4.0 * seed) {\n        color = 1.0 - color;\n    }\n\n    // 3. Uncomment these lines to produce interesting colors\n    // float c = mod(3.0 * cell.x + 2.0 * cell.y, 7.0) / 7.0;\n    // color = 1.0 - (1.0 - color) * vec3(c, c, c);\n    \n    float r = mod(3.0 * cell.x + 2.0 * cell.y, 7.0) / 7.0;\n    float g = mod(5.0 * cell.x + 2.0 * cell.y, 3.0) / 3.0;\n    float b = mod(3.0 * cell.x + 5.0 * cell.y, 5.0) / 5.0;\n    color = 1.0 - (1.0 - color) * vec3(r, g, b);\n\n    // 4. Uncomment to lighten the colors\n    color = sqrt(color);\n\n    gl_FragColor = vec4(color, 1.0);\n}\n",quiltVert:"attribute vec2 position;\n\nvoid main() {\n    gl_Position = vec4(position, 0.0, 1.0);\n}\n",contoursFrag:"#extension GL_OES_standard_derivatives : enable\nprecision mediump float;\n\nuniform vec3 kd; // diffuse coefficient\nuniform vec3 ks; // specular coefficient\nuniform float shininess; // shininess parameter\nuniform vec3 eye; // position of camera\nuniform vec2 resolution;\n\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n\nvec3 illuminate(vec3 lightPosition) {\n    vec3 wi = lightPosition - vPosition;\n    float intensity = 1.0 / dot(wi, wi); // inverse-square law\n    vec3 diffuse = kd * max(dot(normalize(wi), normalize(vNormal)), 0.0);\n\n    vec3 specular = vec3(0.0); // Change me!\n\n    return intensity * (diffuse + specular);\n}\n\nvoid main() {\n    vec2 coord = gl_FragCoord.xy / resolution.y;\n\n    // We add two lights to the scene. Feel free to change these\n    // values, or add more lights at different positions!\n    vec3 color = vec3(0.0);\n    color += 40.0 * illuminate(vec3(0.0, 3.0, 9.0));\n    color += 20.0 * illuminate(vec3(0.0, 10.0, 2.0));\n\n    // Stylized shading\n    float value = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;\n    color = vec3(0.0);\n    vec3 darkblue = vec3(0.2, 0.3, 0.4);\n    vec3 blue = vec3(0.5, 0.65, 0.8);\n    vec3 dots = length(fract(coord * 80.0) - 0.5) < sqrt(0.5 - value) ? blue : vec3(1.0);\n    color = mix(color, darkblue, step(0.2, value));\n    color = mix(color, blue, step(0.25, value));\n    color = mix(color, dots, step(0.35, value));\n    color = mix(color, vec3(1.0), step(0.45, value));\n\n    // Edge estimation\n    float vn = abs(dot(normalize(vNormal), normalize(vPosition - eye)));\n    float vnGradient = fwidth(vn);\n    float edgeFactor = smoothstep(1.25, 0.75, vn / vnGradient / 5.0);\n    color = mix(color, vec3(0.1), edgeFactor);\n\n    gl_FragColor = vec4(color, 1.0);\n}\n",contoursVert:"attribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 view;\nuniform mat4 projection;\n\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n\nvoid main() {\n    vPosition = position;\n    vNormal = normal;\n    gl_Position = projection * view * vec4(position, 1.0);\n}\n",landscapeFrag:'precision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\nuniform float seed;\nuniform float scale;\n\nfloat snoise(vec2);\n\nvoid main() {\n    vec2 coord = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;\n    coord *= scale;\n\n    // "Organic" simplex noise values in range [-1, 1]\n    float noise1 = snoise(vec2(seed * 10000.0, 0) + coord);\n    float noise2 = snoise(vec2(seed * 10000.0, 1e3) + coord / 2.0);\n    float noise4 = snoise(vec2(seed * 10000.0, 2e3) + coord / 4.0);\n    float noise8 = snoise(vec2(seed * 10000.0, 3e3) + coord / 8.0);\n\n    // Display various scales of simplex noise\n    vec3 color = 0.5 + 0.5 * vec3(noise1, noise2, noise8);\n\n    // 1. Fractal noise scales: uncomment each line, one at a time\n    color = vec3(0.5);\n    color += 0.5 * noise8;\n    color += 0.25 * noise4;\n    color += 0.1 * noise2;\n    color += 0.05 * noise1;\n\n    // 2. Generate "water" and "land"\n    float elevation = 0.3 - 0.2 * max(length(coord) - 20.0, 0.0);\n    elevation += noise8 + noise4 * 0.2 + noise2 * 0.1 + noise1 * 0.05;\n    float landFactor = smoothstep(-0.05, 0.05, elevation);\n    float deepSea = smoothstep(-0.1, -0.3, elevation);\n    float deepColor = 0.8 - 0.3 * smoothstep(-0.2, -0.5, elevation);\n    vec3 waterColor = mix(vec3(0.2, 0.2, 0.8), vec3(0.0, 0.0, deepColor), deepSea);\n    color = mix(waterColor, vec3(0.0, 0.6, 0.0), landFactor);\n\n    // 3. Generate "mountains" and "beaches" based on elevation\n    float mountainFactor = (elevation - 1.0) * 5.0;\n    vec3 mountainColor = vec3(0.12, 0.15, 0.1);\n    mountainColor = mix(mountainColor, vec3(0.4, 0.32, 0.4), smoothstep(0.7, 0.8, mountainFactor));\n    mountainColor = mix(mountainColor, vec3(0.9, 0.9, 0.9), smoothstep(1.1, 1.15, mountainFactor));\n    vec3 landColor = mix(vec3(0.0, 0.6, 0.0), mountainColor, smoothstep(0.0, 0.1, mountainFactor));\n    float grassFactor = smoothstep(0.75, 0.7, elevation);\n    landColor = mix(landColor, vec3(0.2, 0.8, 0.0), grassFactor);\n    float beachFactor = smoothstep(0.5, 0.4, elevation);\n    landColor = mix(landColor, vec3(0.9, 0.9, 0.5), beachFactor);\n    color = mix(waterColor, landColor, landFactor);\n\n    // Indicate coral via shading\n    float coral = noise8 + .2*noise4;\n    coral = max(0.0, coral);\n    waterColor += vec3(0.0, .3*coral, 0.0);\n    color = mix(waterColor, landColor, landFactor);\n\n    gl_FragColor = vec4(color, 1.0);\n}\n\n\n\n//\n// Everything below this line is an implementation of 2D simplex\n// noise in GLSL. You shouldn\'t modify any code below.\n//\n// If you\'re curious, see the following paper:\n// https://weber.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf\n//\n\n// Some useful functions\nvec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }\n\n//\n// Description : GLSL 2D simplex noise function\n//      Author : Ian McEwan, Ashima Arts\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License :\n//  Copyright (C) 2011 Ashima Arts. All rights reserved.\n//  Distributed under the MIT License. See LICENSE file.\n//  https://github.com/ashima/webgl-noise\n//\nfloat snoise(vec2 v) {\n\n    // Precompute values for skewed triangular grid\n    const vec4 C = vec4(0.211324865405187,\n                        // (3.0-sqrt(3.0))/6.0\n                        0.366025403784439,\n                        // 0.5*(sqrt(3.0)-1.0)\n                        -0.577350269189626,\n                        // -1.0 + 2.0 * C.x\n                        0.024390243902439);\n                        // 1.0 / 41.0\n\n    // First corner (x0)\n    vec2 i  = floor(v + dot(v, C.yy));\n    vec2 x0 = v - i + dot(i, C.xx);\n\n    // Other two corners (x1, x2)\n    vec2 i1 = vec2(0.0);\n    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);\n    vec2 x1 = x0.xy + C.xx - i1;\n    vec2 x2 = x0.xy + C.zz;\n\n    // Do some permutations to avoid\n    // truncation effects in permutation\n    i = mod289(i);\n    vec3 p = permute(\n            permute( i.y + vec3(0.0, i1.y, 1.0))\n                + i.x + vec3(0.0, i1.x, 1.0 ));\n\n    vec3 m = max(0.5 - vec3(\n                        dot(x0,x0),\n                        dot(x1,x1),\n                        dot(x2,x2)\n                        ), 0.0);\n\n    m = m*m ;\n    m = m*m ;\n\n    // Gradients:\n    //  41 pts uniformly over a line, mapped onto a diamond\n    //  The ring size 17*17 = 289 is close to a multiple\n    //      of 41 (41*7 = 287)\n\n    vec3 x = 2.0 * fract(p * C.www) - 1.0;\n    vec3 h = abs(x) - 0.5;\n    vec3 ox = floor(x + 0.5);\n    vec3 a0 = x - ox;\n\n    // Normalise gradients implicitly by scaling m\n    // Approximation of: m *= inversesqrt(a0*a0 + h*h);\n    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);\n\n    // Compute final noise value at P\n    vec3 g = vec3(0.0);\n    g.x  = a0.x  * x0.x  + h.x  * x0.y;\n    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);\n    return 130.0 * dot(m, g);\n}\n',landscapeVert:"attribute vec2 position;\n\nvoid main() {\n    gl_Position = vec4(position, 0.0, 1.0);\n}\n",shadingFrag:"precision mediump float;\n\nuniform vec3 kd; // diffuse coefficient\nuniform vec3 ks; // specular coefficient\nuniform float shininess; // shininess parameter\nuniform vec3 eye; // position of camera\n\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n\nvec3 illuminate(vec3 lightPosition) {\n    vec3 wi = lightPosition - vPosition;\n    float intensity = 1.0 / dot(wi, wi); // inverse-square law\n    vec3 diffuse = kd * max(dot(normalize(wi), normalize(vNormal)), 0.0);\n\n    // 1. Your specular highlights code goes here!\n    //\n    // This is the outline of what your program should do:\n    //  - Compute the unit vector wo from the current position to the\n    //    camera, by subtracting vPosition from eye and calling\n    //    normalize().\n    vec3 wo = normalize(eye - vPosition);\n\n    //  - Compute the reflected incident light vector r, by reflecting\n    //    normalize(wi) about normalize(vNormal) using the reflect()\n    //    function.\n    vec3 r = reflect(normalize(vNormal), normalize(wi));\n\n    //  - Take the dot product of r and wo, then raise this to the\n    //    exponent of the shininess coefficient. (Make sure your\n    //    result is not negative!)\n    vec3 specular = vec3(max(pow(dot(wo, r), shininess), 0.0));\n\n    //  - Multiply the result by specular coefficient ks.\n    specular *= ks;\n\n    // vec3 specular = vec3(0.0); // Change me! \n\n    return intensity * (diffuse + specular);\n}\n\nvoid main() {\n    // We add two lights to the scene. Feel free to change these\n    // values, or add more lights at different positions!\n    vec3 color = vec3(0.0);\n    color += 40.0 * illuminate(vec3(0.0, 3.0, 9.0));\n    color += 20.0 * illuminate(vec3(0.0, 10.0, 2.0));\n    gl_FragColor = vec4(color, 1.0);\n}\n",shadingVert:"attribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 view;\nuniform mat4 projection;\n\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n\nvoid main() {\n    vPosition = position;\n    vNormal = normal;\n    gl_Position = projection * view * vec4(position, 1.0);\n}\n",raytracingFrag:"precision mediump float;\n\nconst float epsilon = 0.001;\nconst float inf = 1e9;\n\nuniform vec2 resolution;\nuniform vec3 eye;\nuniform vec3 center;\nuniform vec3 background;\nuniform bool antialias;\n\nstruct Ray {\n    vec3 origin;\n    vec3 dir;\n};\n\nstruct Material {\n    vec3 kd;\n    vec3 ks;\n    bool metal;\n    bool checker;\n};\n\nstruct Hit {\n    float time;\n    vec3 normal;\n    Material material;\n};\n\n// Trace a ray to a sphere, using high school geometry\nvoid sphere(inout Hit h, Ray r, vec4 s, Material m) {\n    // Rescale to unit sphere at the origin\n    r.origin = (r.origin - s.xyz) / s.w;\n    r.dir = r.dir / s.w;\n\n    // Quadratic formula\n    float a = dot(r.dir, r.dir);\n    float b = dot(r.dir, r.origin);\n    float c = dot(r.origin, r.origin) - 1.0;\n\n    float d = b * b - a * c;\n    if (d < 0.0) {\n        return;\n    }\n\n    d = sqrt(d);\n    float t = (-b - d) / a;\n    if (t < epsilon) {\n        t = (-b + d) / a;\n    }\n\n    if (t >= epsilon && t < h.time) {\n        h.time = t;\n        h.normal = normalize(r.origin + r.dir * t);\n        h.material = m;\n    }\n}\n\nvoid circle(inout Hit h, Ray r, float y, float radius, Material m) {\n    float t = (y - r.origin.y) / r.dir.y;\n    if (t >= epsilon && t < h.time\n            && length(r.origin + t * r.dir) < radius) {\n        h.time = t;\n        h.normal = vec3(0.0, 1.0, 0.0);\n        h.material = m;\n    }\n}\n\n// Intersect a ray with the scene\nHit intersect(Ray r) {\n    Hit h = Hit(inf, vec3(0.0), Material(vec3(0.0), vec3(0.0), false, false));\n    sphere(h, r, vec4(0.8, -1.0, -10.0, 1.0),\n        Material(vec3(0.4, 0.2, 0.8), vec3(0.8), false, false));\n    sphere(h, r, vec4(-2.5, -0.2, -12.0, 1.8),\n        Material(vec3(1.0, 0.4, 0.2), vec3(0.8), true, false));\n    sphere(h, r, vec4(-3.5, -1.2, -6.0, 0.8),\n        Material(vec3(0.2, 0.6, 0.3), vec3(0.8), false, false));\n    circle(h, r, -2.0, 50.0,\n        Material(vec3(0.8, 0.8, 0.8), vec3(0.0), false, true));\n    return h;\n}\n\n// Compute lighting from one light\nvec3 illuminate(vec3 lightPosition, vec3 pos, vec3 wo, Hit h) {\n    vec3 wi = lightPosition - pos;\n    vec3 kd = h.material.kd;\n    if (h.material.checker) {\n        // Checkerboard pattern for the floor\n        vec2 coords = floor(pos.xz);\n        kd = vec3(mod(coords.x + coords.y, 2.0) * 0.8 + 0.2);\n    }\n    float intensity = 1.0 / dot(wi, wi); // inverse-square law\n    vec3 diffuse = kd * max(dot(normalize(wi), h.normal), 0.0);\n\n    // Non-dielectric materials have tinted reflections\n    vec3 ks = h.material.metal ? h.material.kd : h.material.ks;\n    vec3 r = -reflect(normalize(wi), h.normal);\n    vec3 specular = ks * pow(max(dot(r, wo), 0.0), 10.0);\n\n    return intensity * (diffuse + specular);\n}\n\n// Compute total lighting at a given point\nvec3 calcLighting(vec3 pos, vec3 wo, Hit h) {\n    vec3 color = vec3(0.0);\n    color += 100.0 * illuminate(vec3(-3.0, 10.0, 0.0), pos, wo, h);\n    color += 200000.0 * illuminate(vec3(0.0, 1000.0, 0.0), pos, wo, h);\n    return color;\n}\n\n// Trace a ray, returning an RGB color based on its value\nvec3 trace(Ray r) {\n    Hit h = intersect(r);\n    if (h.time != inf) {\n        vec3 pos = r.origin + h.time * r.dir;\n        vec3 color = calcLighting(pos, -r.dir, h);\n        if (h.material.metal) {\n            vec3 dir = reflect(r.dir, h.normal);\n            Hit h2 = intersect(Ray(pos, dir));\n            if (h2.time < inf) {\n                vec3 pos2 = pos + h2.time * dir;\n                color += 0.2 * h.material.ks * calcLighting(pos2, -dir, h2);\n            } else {\n                color += 0.2 * h.material.ks * background;\n            }\n        }\n        return color;\n    }\n    return background;\n}\n\nvec3 tracePixel(vec2 coord) {\n    // Pixel coordinates, normalized so that p.y in range [-1, 1]\n    vec2 p = (2.0 * coord - resolution) / resolution.y;\n\n    // View ray from camera\n    vec3 ww = normalize(center - eye);\n    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));\n    vec3 vv = normalize(cross(uu, ww));\n    // (Note: cot(pi/12) = 2 + sqrt(3) = 3.73)\n    vec3 dir = normalize(p.x * uu + p.y * vv + 3.73 * ww);\n\n    return trace(Ray(eye, dir));\n}\n\nvoid main() {\n    vec3 color = vec3(0.0);\n\n    if (antialias) {\n        // Anti-aliasing by supersampling multiple rays\n        color += 0.25 * tracePixel(gl_FragCoord.xy + vec2(-0.25, -0.25));\n        color += 0.25 * tracePixel(gl_FragCoord.xy + vec2(-0.25, +0.25));\n        color += 0.25 * tracePixel(gl_FragCoord.xy + vec2(+0.25, -0.25));\n        color += 0.25 * tracePixel(gl_FragCoord.xy + vec2(+0.25, +0.25));\n    } else {\n        color += tracePixel(gl_FragCoord.xy);\n    }\n\n    gl_FragColor = vec4(color, 1.0);\n}\n",raytracingVert:"attribute vec2 position;\n\nvoid main() {\n    gl_Position = vec4(position, 0.0, 1.0);\n}\n"};const m=r({extensions:["OES_standard_derivatives"]}),d=function(r,{eye:i,center:a}){let c=!1,s=null;const l={eye:i,center:a},m=n=>{c=!0,s=[n.screenX/r.height,n.screenY/r.height]},d=i=>{if(!c)return;const[a,m]=[i.screenX/r.height,i.screenY/r.height],[d,v]=s;s=[a,m];const u=n([],l.eye,l.center),h=e(u);let f=Math.acos(u[1]/h),p=Math.atan2(u[2],u[0]);f=Math.min(Math.max(f-5*(m-v),1e-8),Math.PI-1e-8),p+=5*(a-d),o(l.eye,h*Math.cos(p)*Math.sin(f),h*Math.cos(f),h*Math.sin(p)*Math.sin(f)),t(l.eye,l.eye,l.center)},v=()=>{c=!1};return r.addEventListener("mousedown",m),r.addEventListener("mousemove",d),r.addEventListener("mouseup",v),r.addEventListener("touchstart",(n=>m(n.touches[0]))),r.addEventListener("touchmove",(n=>d(n.touches[0]))),r.addEventListener("touchend",v),l}(document.getElementsByTagName("canvas")[0],{eye:[1,0,5.2],center:[0,0,0]}),v=function(){const n=new i({title:"Controls"}),e={project:"quilt",seed:0,scale:20,mesh:s,fps:0,kd:{r:95,g:230,b:213},ks:{r:240,g:240,b:240},shininess:5,background:{r:120,g:178,b:255},antialias:!0};n.addInput(e,"project",{options:{"Quilt patterns":"quilt","Procedural landscapes":"landscape","Rasterization and shading":"shading","Stylized rendering":"contours","Ray tracing":"raytracing"}});const o=[[n.addInput(e,"seed",{min:0,max:1}),["quilt","landscape"]],[n.addInput(e,"scale",{min:10,max:30}),["landscape"]],[n.addInput(e,"mesh",{options:{Gengar:"/graphics-workshop/assets/gengar.obj.372efedb.json",Knot:"/graphics-workshop/assets/knot.obj.937920cf.json",Sphere:"/graphics-workshop/assets/sphere.obj.4e2aaece.json",Suzanne:"/graphics-workshop/assets/suzanne.obj.c35b0f43.json",Teapot:s}}).on("change",(n=>h(n.value))),["shading","contours"]],[n.addInput(e,"kd"),["shading","contours"]],[n.addInput(e,"ks"),["shading","contours"]],[n.addInput(e,"shininess",{min:1,max:9}),["shading","contours"]],[n.addInput(e,"background"),["raytracing"]],[n.addInput(e,"antialias"),["raytracing"]]];n.addMonitor(e,"fps"),n.addSeparator(),n.addButton({title:"Instructions"}).on("click",(()=>{const n=document.createElement("a");n.href="https://github.com/ekzhang/graphics-workshop#readme",n.target="_blank",n.click()}));const t=localStorage.getItem("graphics-workshop");if(t)try{n.importPreset(JSON.parse(t))}catch(a){console.warn(`Error loading saved preset: ${a}`)}const r=()=>{const t=n.exportPreset();localStorage.setItem("graphics-workshop",JSON.stringify(t));for(const[n,r]of o)n.hidden=!r.includes(e.project)};return r(),n.on("change",r),e}();let u=null;async function h(n){const e=await fetch(n);u=await e.json()}function f(n){return[n.r/255,n.g/255,n.b/255]}const p=m({attributes:{position:[[-1,1],[-1,-1],[1,1],[1,-1]]},elements:[[0,1,2],[2,1,3]],uniforms:{view:()=>a([],d.eye,d.center,[0,1,0]),projection:({drawingBufferWidth:n,drawingBufferHeight:e})=>{const o=n/e;return c([],Math.PI/6,o,.01,100)},eye:()=>d.eye,center:()=>d.center,resolution:({drawingBufferWidth:n,drawingBufferHeight:e})=>[n,e],time:m.context("time")}}),g={quilt:m({uniforms:{seed:()=>v.seed}}),landscape:m({uniforms:{seed:()=>v.seed,scale:()=>v.scale}}),shading:m({attributes:{position:()=>u.vertices,normal:()=>u.normals},uniforms:{kd:()=>f(v.kd),ks:()=>f(v.ks),shininess:()=>v.shininess},elements:()=>u.elements}),contours:m({attributes:{position:()=>u.vertices,normal:()=>u.normals},uniforms:{kd:()=>f(v.kd),ks:()=>f(v.ks),shininess:()=>v.shininess},elements:()=>u.elements}),raytracing:m({uniforms:{background:()=>f(v.background),antialias:()=>v.antialias}})};let y=function(){try{return{quilt:m({frag:l.quiltFrag,vert:l.quiltVert}),landscape:m({frag:l.landscapeFrag,vert:l.landscapeVert}),shading:m({frag:l.shadingFrag,vert:l.shadingVert}),contours:m({frag:l.contoursFrag,vert:l.contoursVert}),raytracing:m({frag:l.raytracingFrag,vert:l.raytracingVert})}}catch(n){return null}}();h(v.mesh).then((()=>{const n=[...Array(60)].fill(0);m.frame((()=>{const e=n.shift(),o=performance.now();n.push(o),0!==e&&(v.fps=1e3/((o-e)/n.length)),p((()=>{"contours"===v.project?m.clear({color:[1,1,1,1]}):m.clear({color:[0,0,0,1]}),g[v.project]((()=>{y&&y[v.project]()}))}))}))}));

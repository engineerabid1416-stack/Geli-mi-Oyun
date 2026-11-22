/* 1/4: kurulum, sahne, harita ve binalar */
const $=i=>document.getElementById(i),T=THREE;
if('ontouchstart' in window||navigator.maxTouchPoints>0)document.body.classList.add('touch');
$('nm').value='Oyuncu'+Math.floor(Math.random()*90+10);
const ren=new T.WebGLRenderer({canvas:$('c'),antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,1.75));
const scene=new T.Scene(),cam=new T.PerspectiveCamera(75,1,.05,200);cam.rotation.order='YXZ';
scene.background=new T.Color(0x8fb6d9);scene.fog=new T.Fog(0x8fb6d9,35,120);
scene.add(new T.HemisphereLight(0xffffff,0x556677,1.1),cam);
const sun=new T.DirectionalLight(0xffffff,.9);sun.position.set(30,50,20);scene.add(sun);
function rs(){ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();
// ---- harita (herkeste aynı) ----
const solids=[],boxes=[];
function box(x,z,w,h,d,col){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshLambertMaterial({color:col}));m.position.set(x,h/2,z);scene.add(m);solids.push(m);boxes.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,top:h})}
const fl=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshLambertMaterial({color:0x3a4650}));fl.rotation.x=-Math.PI/2;scene.add(fl,new T.GridHelper(100,50,0x667788,0x4a5866));solids.push(fl);
[[0,-40,82,6,2],[0,40,82,6,2],[-40,0,2,6,82],[40,0,2,6,82]].forEach(a=>box(a[0],a[1],a[2],a[3],a[4],0x5b6573));
let sd=7;const sr=()=>(sd=sd*16807%2147483647)/2147483647;
for(let i=0;i<28;i++){const w=2+sr()*5,d=2+sr()*5,h=[1,1,2.5,3.5,4.5][i%5];box((sr()-.5)*72,(sr()-.5)*72,w,h,d,[0xd9506a,0x4fb6a5,0xe0b45a,0x7a85d6][i%4])}
// ---- binalar ----
const wtex=(col,w,h)=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle=col;g.fillRect(0,0,128,128);
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=Math.random()>.45?'#ffd98a':'#243445';g.fillRect(i*32+7,j*32+7,18,20)}
 g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,124,128,4);
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(Math.max(1,Math.round(w/4)),Math.max(1,Math.round(h/4)));return t};
function bld(x,z,w,h,d,col,sol){const tx=new T.MeshLambertMaterial({map:wtex(col,d,h)}),tz=new T.MeshLambertMaterial({map:wtex(col,w,h)}),rf=new T.MeshLambertMaterial({color:0x2b3138});
 const m=new T.Mesh(new T.BoxGeometry(w,h,d),[tx,tx,rf,rf,tz,tz]);m.position.set(x,h/2,z);scene.add(m);
 const r=new T.Mesh(new T.BoxGeometry(w*.35,1.2,d*.35),rf);r.position.set(x,h+.6,z);scene.add(r);
 const a=new T.Mesh(new T.CylinderGeometry(.08,.08,3,6),new T.MeshLambertMaterial({color:0x99a3ad}));a.position.set(x+w*.3,h+2.7,z);scene.add(a);
 if(sol){solids.push(m);boxes.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,top:h})}}
{const g2=new T.Mesh(new T.PlaneGeometry(500,500),new T.MeshLambertMaterial({color:0x2d343c}));g2.rotation.x=-Math.PI/2;g2.position.y=-.03;scene.add(g2)}
const BC=['#5b6573','#7a5a4a','#4a6070','#6b6b7a','#5a4f66'];
[[-27,-27,10,12,9],[26,-26,9,14,10],[-28,24,11,10,8],[27,25,10,11,12],[0,-31,14,9,6],[0,31,12,10,7]].forEach((a,i)=>bld(a[0],a[1],a[2],a[3],a[4],BC[i%5],1));
for(let i=0;i<32;i++){const side=i%4,k=Math.floor(i/4),al=-66+k*19+Math.random()*6,off=50+Math.random()*14,w=8+Math.random()*8,d=8+Math.random()*8,h=14+Math.random()*22;
 const x=side<2?al:(side===2?-off:off),z=side<2?(side===0?-off:off):al;bld(x,z,w,h,d,BC[i%5],0)}
const blocked=(x,z,y)=>boxes.some(b=>x>b.x0-.35&&x<b.x1+.35&&z>b.z0-.35&&z<b.z1+.35&&y<b.top-.25);
const gnd=(x,z,y)=>{let g=0;for(const b of boxes)if(x>b.x0-.2&&x<b.x1+.2&&z>b.z0-.2&&z<b.z1+.2&&b.top<=y+.35&&b.top>g)g=b.top;return g};

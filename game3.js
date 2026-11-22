/* 3/4: oyuncular, efektler, savaş, online, mağaza */
// ---- oyuncular ----
const players={},rc=new T.Raycaster();let rm=null,myId=null,peerL=[],playing=0,showBuy=0;
const hue=id=>{let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%360;return new T.Color().setHSL(h/360,.7,.55)};
function addP(id,bot){const g=new T.Group(),M=c=>new T.MeshLambertMaterial({color:c}),parts=[];let hh=0;for(const c of id)hh=(hh*31+c.charCodeAt(0))>>>0;
 const skin=[0xf2c9a0,0xdcae82,0xb67b50,0x8a5a3a][hh%4],hair=[0x2b1d14,0x6b4a2f,0xc9a14a,0x111111,0x8a2f2f][(hh>>3)%5],cl=hue(id),dk=0x222831;
 const B=(w,h,d,c,x,y,z,par,hd)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);(par||g).add(m);if(hd!==0){m.userData.pid=id;if(hd)m.userData.head=1;parts.push(m)}return m};
 const J=(x,y,z,par)=>{const o=new T.Group();o.position.set(x,y,z);(par||g).add(o);return o};
 const tor=J(0,0,0);
 B(.5,.62,.28,cl,0,1.14,0,tor);B(.46,.4,.03,0x2b3138,0,1.2,-.155,tor,0);B(.53,.1,.3,0x2b3138,0,.86,0,tor);B(.1,.1,.1,skin,0,1.5,0,tor);
 B(.46,.2,.26,dk,0,.78,0);
 const hd=J(0,1.7,0,tor),hm=new T.Mesh(new T.SphereGeometry(.17,16,12),M(skin));hm.userData.pid=id;hm.userData.head=1;hd.add(hm);parts.push(hm);
 const hr=new T.Mesh(new T.SphereGeometry(.18,16,8,0,Math.PI*2,0,Math.PI*.35),M(hair));hr.position.y=.015;hr.userData.pid=id;hr.userData.head=1;hd.add(hr);parts.push(hr);
 B(.32,.2,.1,hair,0,-.01,.1,hd,1);
 [-1,1].forEach(s=>{B(.06,.04,.02,0xffffff,s*.065,.03,-.152,hd,0);B(.028,.03,.02,0x1a1a1a,s*.065,.028,-.163,hd,0);B(.075,.016,.02,hair,s*.065,.07,-.15,hd,0);B(.03,.06,.04,skin,s*.17,0,0,hd,0)});
 B(.03,.04,.035,skin,0,-.015,-.165,hd,0);B(.07,.014,.02,0x7a2f2f,0,-.075,-.148,hd,0);
 B(.08,.1,.5,0x111111,.2,1.12,-.35,g,0);
 const arm=s=>{const sh=J(s*.33,1.4,0,tor),el=J(0,-.3,0,sh);B(.12,.3,.12,cl,0,-.15,0,sh);B(.1,.28,.1,skin,0,-.14,0,el);B(.1,.1,.1,0x2b3138,0,-.31,0,el);sh.rotation.z=-s*.12;return{sh,el}};
 const leg=s=>{const hp=J(s*.13,.82,0),kn=J(0,-.4,0,hp);B(.18,.4,.2,dk,0,-.2,0,hp);B(.15,.38,.17,0x39424e,0,-.19,0,kn);B(.17,.09,.28,0x111111,0,-.375,-.04,kn);return{hp,kn}};
 const L={tor,l:leg(-1),r:leg(1),la:arm(-1),ra:arm(1)};L.la.sh.rotation.z=.3;
 g.userData.parts=parts;scene.add(g);
 const pl={m:g,id,bot,hp:100,name:bot?'Bot':'?',tx:0,ty:0,tz:0,ry:0,k:0,d:0,wt:0,dir:0,mv:0,buf:[],L};animP(pl,0,0);players[id]=pl;if(bot)rbot(pl)}
function rbot(p){for(let i=0;i<40;i++){const x=(Math.random()-.5)*70,z=(Math.random()-.5)*70;if(!blocked(x,z,0)){p.m.position.set(x,0,z);return}}}
// ---- efektler ----
const fxs=[],gr=[];
function tracer(a,b){const l=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(...a),new T.Vector3(...b)]),new T.LineBasicMaterial({color:0xffe27a}));scene.add(l);fxs.push({k:'t',g:l,t:.07})}
function boom(k,p){const v=new T.Vector3(...p);
 if(k==='s'){const g=new T.Group(),mat=new T.MeshBasicMaterial({color:0xcfd6dc,transparent:true,opacity:.85,depthWrite:false});
  for(let i=0;i<14;i++){const s=new T.Mesh(new T.SphereGeometry(1.5+Math.random(),10,8),mat);s.position.set((Math.random()-.5)*5,Math.random()*2.5+.8,(Math.random()-.5)*5);g.add(s)}
  g.position.set(v.x,0,v.z);scene.add(g);fxs.push({k,g,mat,t:10});return}
 const g=new T.Mesh(new T.SphereGeometry(.4,10,8),new T.MeshBasicMaterial({color:0xffffff}));g.position.copy(v);scene.add(g);fxs.push({k,g,t:.35});
 const to=cam.position.clone().sub(v),dist=to.length();if(dist>45||P.dead)return;to.normalize();
 rc.set(v,to);rc.far=dist;const occ=rc.intersectObjects(solids,false).length;
 const d=new T.Vector3();cam.getWorldDirection(d);const look=Math.min(1,Math.max(0,(-d.dot(to)+.3)/1.3));
 if(!occ)P.blind=Math.max(P.blind,.8+3.5*(1-dist/45)*look)}
function throwG(k){if(P.dead||!playing)return;if(k==='f'){if(P.fl<1)return;P.fl--}else{if(P.sm<1)return;P.sm--}
 const d=new T.Vector3();cam.getWorldDirection(d);
 const m=new T.Mesh(new T.SphereGeometry(.1,8,8),new T.MeshBasicMaterial({color:k==='f'?0xffffaa:0x9aa5b1}));m.position.copy(cam.position).addScaledVector(d,.5);scene.add(m);
 gr.push({m,k,v:d.clone().multiplyScalar(15).add(new T.Vector3(0,3,0)),t:1.1})}
// ---- savaş ----
function feed(t){const e=document.createElement('div');e.textContent=t;$('feed').appendChild(e);setTimeout(()=>e.remove(),4000)}
function reload(){const w=W[P.cur];if(P.rl>0||w.ammo>=w.mag||w.res<=0||P.dead)return;P.rl=P.rlT=w.n==='Operator'?2.4:1.6;P.dropped=0}
function heal(){if(P.dead||P.heals<1||P.hp>=100||P.healT>0)return;P.heals--;P.healT=2}
function swap(i){if(W[i]&&W[i].own&&!P.dead){P.cur=i;P.rl=0}}
function nextW(s){let i=P.cur;do{i=(i+s+4)%4}while(!W[i].own);swap(i)}
function shoot(w){w.ammo--;const d=new T.Vector3();cam.getWorldDirection(d);
 const sp=w.sp*(P.ads?.25:1)*(P.og?1:3);d.x+=(Math.random()-.5)*sp*2;d.y+=(Math.random()-.5)*sp*2;d.z+=(Math.random()-.5)*sp*2;d.normalize();
 cam.updateMatrixWorld();rc.set(cam.position,d);rc.far=150;
 const tg=[...solids];for(const id in players){const p=players[id];if(p.m.visible)tg.push(...p.m.userData.parts)}
 const h=rc.intersectObjects(tg,false)[0],end=h?h.point:cam.position.clone().addScaledVector(d,100);
 const st=cam.localToWorld(new T.Vector3(.2,-.15,-.6)),a=[st.x,st.y,st.z],b=[end.x,end.y,end.z];
 tracer(a,b);rm&&rm.emit('fx',{k:'t',a,b}).catch(()=>{});P.mf=.05;P.pitch+=w.auto?.004:.012;gun.position.z=-.42;
 if(h&&h.object.userData.pid)dmgTo(h.object.userData.pid,h.object.userData.head?9999:dmg(w),h.object.userData.head)}
function dmgTo(id,d,hd){const p=players[id];if(!p||p.dead)return;const c=$('cross');c.classList.add('hit');setTimeout(()=>c.classList.remove('hit'),120);
 if(p.bot){p.hp-=d;if(p.hp<=0){P.k++;P.cred+=300;p.m.visible=false;p.dead=1;feed('Bot öldürüldü +300');setTimeout(()=>{p.hp=100;p.dead=0;p.m.visible=true;rbot(p)},3000)}}
 else rm&&rm.emit('hit',{t:id,d,by:myId,h:hd?1:0}).catch(()=>{})}
function die(by){P.dead=1;P.rl=0;P.d++;P.hp=0;$('dead').style.display='flex';rm&&rm.emit('died',{by,v:myId}).catch(()=>{});
 setTimeout(()=>{P.hp=100;P.dead=0;P.healT=0;spawn();W.forEach(w=>{w.ammo=w.mag;w.res=w.mag*3});$('dead').style.display='none'},3000)}
function spawn(){for(let i=0;i<50;i++){const x=(Math.random()-.5)*70,z=(Math.random()-.5)*70;if(!blocked(x,z,0)){P.x=x;P.z=z;break}}P.y=0;P.vy=0}
// ---- online ----
async function net(code,host){
 const room=window.claude?await claude.use('room'):null;if(!room)return 'Online bağlantı yok. Oyunu Claude üzerindeki bağlantıdan aç.';
 rm=await room.join('valo-'+code);
 rm.onPeers(ch=>{peerL=ch.peers;ch.peers.forEach(p=>{if(p.isMe){myId=p.peer;return}let q=players[p.peer];const s=p.presence||{};
  if(!q){addP(p.peer,0);q=players[p.peer];q.m.position.set(s.x||0,s.y||0,s.z||0)}
  {const nx=s.x||0,ny=s.y||0,nz=s.z||0,nr=s.ry||0,Lb=q.buf[q.buf.length-1];if(!Lb||Lb.x!==nx||Lb.y!==ny||Lb.z!==nz||Lb.r!==nr){q.buf.push({t:performance.now(),x:nx,y:ny,z:nz,r:nr});if(q.buf.length>10)q.buf.shift()}}q.name=s.name||'Oyuncu';q.k=s.k||0;q.d=s.d||0;q.m.visible=!s.dead;q.cr=s.cr});
  ch.left.forEach(p=>{const q=players[p.peer];if(q){scene.remove(q.m);delete players[p.peer]}})});
 rm.on('hit',m=>{const o=m.data;if(!o||m.isMe||o.t!==myId||P.dead)return;P.hp-=Math.min(+o.d||0,9999);P.dmgT=.4;if(P.hp<=0)die(o.by)});
 rm.on('died',m=>{const o=m.data||{};const n=id=>id===myId?'Sen':(players[id]&&players[id].name)||'?';feed(n(o.by)+' ➜ '+n(o.v));if(o.by===myId&&!m.isMe){P.k++;P.cred+=300}});
 rm.on('fx',m=>{if(m.isMe||!m.data)return;const o=m.data;o.k==='t'?tracer(o.a,o.b):boom(o.k,o.p)});
 const sendP=()=>rm&&rm.presence({x:+P.x.toFixed(2),y:+P.y.toFixed(2),z:+P.z.toFixed(2),ry:+P.yaw.toFixed(2),name:P.name,k:P.k,d:P.d,dead:P.dead,cr:P.crouch?1:0,host:host?1:0}).catch(()=>{});
 sendP();setInterval(sendP,45);
 if(!host){await new Promise(r=>setTimeout(r,2500));if(!peerL.some(p=>!p.isMe&&p.presence&&p.presence.host)){await rm.leave();rm=null;return 'Bu kodla bir oda bulunamadı.'}}
 return ''}
async function go(mode){P.name=$('nm').value.trim().slice(0,12)||'Oyuncu';let code='';
 if(mode==='join'){code=$('cd').value.trim().toUpperCase();if(code.length<4){$('msg').textContent='Önce oda kodunu gir';return}}
 if(mode==='host'){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';for(let i=0;i<5;i++)code+=A[Math.floor(Math.random()*A.length)]}
 $('msg').textContent='Bağlanıyor…';
 if(mode==='solo'){for(let i=0;i<4;i++)addP('b'+i,1)}
 else{const e=await net(code,mode==='host').catch(()=>'Bağlantı kurulamadı, tekrar dene.');if(e){$('msg').textContent=e;return}$('code').textContent='ODA KODU: '+code}
 $('menu').style.display='none';$('hud').style.display='block';playing=1;spawn();
 try{const f=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();const lk=()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{});f&&f.then?f.then(lk).catch(()=>{}):lk()}catch(e){}}
// ---- mağaza ----
function buyUI(){let h=`<h3 style="text-align:center">MAĞAZA 💰${P.cred}</h3>`;
 W.forEach((w,i)=>{h+=`<div class=r><b>${w.n}</b><span>Hasar ${dmg(w)} · Kafa = ÖLÜM</span>`+(w.own?`<button class=g onclick="sel(${i})">${P.cur==i?'Seçili':'Seç'}</button><button onclick="up(${i})">+10 hasar 💰100</button>`:`<button onclick="buy(${i})">Al 💰${w.p}</button>`)+`</div>`});
 [['heals','✚ Şifa paketi',100],['fl','✦ Flash',150],['sm','☁ Sis bombası',150]].forEach(a=>h+=`<div class=r><b>${a[1]}</b><span>Elinde: ${P[a[0]]}</span><button onclick="item('${a[0]}',${a[2]})">💰${a[2]}</button></div>`);
 h+=`<div class=r><b>Cephane</b><span>+1 şarjör</span><button onclick="item('am',100)">💰100</button></div><div class=r><b>Nişangah</b><span>Şekil seç</span><button class="g" onclick="xh('dot')">●</button><button class="g" onclick="xh('ring')">◯</button><button class="g" onclick="xh('plus')">＋</button></div><button class=g onclick="tb()">Kapat</button><button class=g onclick="tb();startEdit()">🎛 Tuş düzeni</button>`;$('buy').innerHTML=h}
function tb(){showBuy=!showBuy;$('buy').style.display=showBuy?'flex':'none';if(showBuy){buyUI();document.exitPointerLock&&document.exitPointerLock()}}
const buy=i=>{if(P.cred>=W[i].p){P.cred-=W[i].p;W[i].own=1;P.cur=i;buyUI()}},up=i=>{if(P.cred>=100){P.cred-=100;W[i].inv+=100;buyUI()}},sel=i=>{swap(i);buyUI()},
item=(k,c)=>{if(P.cred<c)return;P.cred-=c;k==='am'?W[P.cur].res+=W[P.cur].mag:P[k]++;buyUI()};

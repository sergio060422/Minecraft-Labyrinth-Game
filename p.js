let n = 18;

function create_grid() {
  let prnt = document.getElementsByClassName("prnt")[0];

  for(let i = 1; i <= n * n; i++){
    let new_child = document.createElement("div");
    
    new_child.className = "proto";
    new_child.id = i + "";
    new_child.style.display = "inline-grid";
    prnt.appendChild(new_child);
  }
  
  for(let i = 1; i <= n; i++){
    let child = document.getElementById(i + "");
    
    child.style.gridColumnStart = i + "";
    child.style.gridColumnEnd = i + 1 + "";
  }
  
  fill();

}

let map = new Map(), cd = new Map();

function gnum(i, j) {
  return (i - 1) * n + j;
}

function fill(){
  for(let i = 1; i <= n; i++){
    let a = [2];
    
    for(let j = 1; j <= n; j++){
      cd[gnum(i, j)] = [i, j];
        
      if(i % n < 2 || j % n < 2){
        a.push(1);
        let child = document.getElementById(gnum(i, j) + "");
        
        if(i != 1 || j != 2){
           child.style.backgroundImage = "url(Images/wall.png)";
           if(rand() % 2){
             child.style.backgroundImage ="url(Images/wall2.png";
           }
        }
      
      }
      
      else{
        a.push(0);
      }
    }
    map[i] = a;
  }
  map[1][2] = map[n][n - 1] = 0;
  config_map();
} 

let mi = [0, 1, 0, -1];
let mj = [1, 0, -1, 0];

function ok(i, j){
  if(i >= 1 && i <= n && j >= 1 && j <= n){
    if(!map[i][j]){
      return 1;
    }
  }
  return 0;
}

let cnt = 0;

function rstart() {
  cnt = 0;
  
  for(let i = 1; i <= n; i++){
    for(let j = 1; j <= n; j++){
      if(map[i][j] == 2){
        map[i][j] = 0;
      }
    }
  }
}

function dfs(i, j){
  map[i][j] = 2;
  cnt++;
  
  for(let k = 0; k < 4; k++){
    let ip = i + mi[k];
    let jp = j + mj[k];
    
    if(ok(ip, jp)){
      dfs(ip, jp);
    }
  }
}

let fcell = [];

function rand(){
    return Number((Math.random() + "").substr(2, 1));
}

function rem(idc){
    let r = cd[idc][0], c = cd[idc][1];
    
    for(let i = r - 3; i <= r + 3; i++){
        for(let j = c - 3; j <= c + 3; j++){
            if(fcell.includes(gnum(i, j))){
                let pos = fcell.indexOf(gnum(i, j));
                fcell.splice(pos, 1);
            }
        }
    }
}

function ok2(i, j){
  if(i > 1 && i < n && j > 1 && j < n){
    if(cells.includes(gnum(i, j))){
      return 1;
    }
  }
  return 0;
}

function bfs(i, j, di, dj, t){
  let q = [];
  let idc = gnum(i, j), ans = [], curr;
  let p = new Map();
 
  p[idc] = idc;
  q.push([i, j]);
  
  while(q.length){
    let vi = q[0][0], vj = q[0][1];
    curr = gnum(vi, vj);
    q.splice(0, 1);
    if(vi == di && vj == dj){
     break;
    }
    for(let k = 0; k < 4; k++){
      let ui = vi + mi[k];
      let uj = vj + mj[k];
      let gtid = gnum(ui, uj);
      
      if(ok2(ui, uj) && p[gtid] == undefined){
        p[gtid] = curr;
        q.push([ui, uj]);
      }
    }
  }
  
  while(curr != p[curr]){
    ans.push(curr);
    curr = p[curr];
  }
  
  if(t){
    return ans[ans.length - 1];
  }
  else{
    return ans;
  }
}

let eppos = [], zr = 2, zc = 2;
let interval;

function add_zombie(idc){
    let cell = document.getElementById(idc + "");
    let zombie = document.createElement("img");
    
    zombie.className = "zombie";
    zombie.src = "Images/zombie.png";
    cell.appendChild(zombie);
    
    interval = setInterval(zombie_move, 700);
}

function is_close(){
    for(let i = 0; i < 4; i++){
        if(zr + mi[i] == row && zc + mj[i] == col){
            return 1;
        }
    }
    return 0;
}

function abs(k){
  if(k < 0){
    return k * (-1);
  }
  return k;
}

function Manhattan(x1, y1, x2, y2){
  return abs(x1 - x2) + abs(y1 - y2);
}

const cry = new Audio("Audio/zombie_audio.ogg");
const tp = new Audio("Audio/tp.mp3");
const bow = new Audio("Audio/arrow.mp3");

let lifes = 3;

function life_rem(){
  lifes--;
  let life_stand = document.getElementById("life_stand");
  let curr = document.getElementById(gnum(row, col) +"");
  life_stand.removeChild(life_stand.lastElementChild);
  if(sele){
    sele = 0;
    remsel(row, col);
    remchild(cell);
    end();
  }
  if(lifes){
    let start = document.getElementById(n * n - 1 + "");
    let steve = document.createElement("img");

    map[row][col] = 0;
    steve.className = "steve";
    steve.src = "Images/token.png";
    start.style.backgroundImage = "url(Images/walk.png)";
    start.classList.remove("start");
    start.appendChild(steve);
    if(row != zr || col != zc){
      curr.removeChild(curr.lastElementChild);
    }
    row = n, col = n - 1;
    frst = 1;
    block_move = 0;
  }
  else{
    if (row != zr || col != zc) {
      curr.lastElementChild.classList.add("dsappear");
    }
    gameover();
  }
}

function zombie_attack(){
    if(frst){
      return;
    }
    let cell = document.getElementById(gnum(row, col) + "");
    let zcell = document.getElementById(gnum(zr, zc) + "");
    
    block_move = 1;
    map[zr][zc] = 0;
    zr = row;
    zc = col;
    map[zr][zc] = 1;
    frst = 1;
    setTimeout(function eat(){
        cell.removeChild(cell.lastChild);
        cell.appendChild(zcell.lastChild);
        cry.play();
        life_rem();
    }, 500);
    
}

let fast = 0;

function zombie_move(){
    if(block_move){
      return;
    }
    let fc = []; 
    for(let i = 0; i < 4; i++){
        let zrp = zr + mi[i];
        let zcp = zc + mj[i]; 
            
        if(ok(zrp, zcp) && zrp > 1){
            fc.push(gnum(zrp, zcp));
        }
    }
        
    let goto = fc[Math.floor(Math.random() * fc.length)];
    
    if(!frst && Manhattan(zr, zc, row, col) <= 10){
      goto = bfs(zr, zc, row, col, 1);
      if(!fast){
        clearInterval(interval);
        interval = setInterval(zombie_move, 500);
        fast = 1;
      }
    }
    else if(fast){
      clearInterval(interval);
      interval = setInterval(zombie_move, 700);
      fast = 0;
    }
    
    let gtcell = document.getElementById(goto + "");
    let curr = document.getElementById(gnum(zr, zc) + "");
    
    for(let i = 0; i < curr.childNodes.length; i++){
      let node = curr.childNodes.item(i);
      
      if(node.className == "zombie"){
        let zombie = document.createElement("img");
        zombie.src = "Images/zombie.png";
        zombie.className ="zombie";
        gtcell.appendChild(zombie);
        curr.removeChild(node);
        break;
      }
    }
    
    if(eppos.includes(gnum(zr, zc))){
        let epearl = curr.firstChild;
        epearl.style.display = "block";
    }
    if(eppos.includes(goto)){
        let epearl = gtcell.firstChild;
        epearl.style.display = "none";
    }
    let zombie = document.getElementsByClassName("zombie")[0];
    let skeleton = document.getElementsByClassName("skeleton")[0];
    
    if(goto == gnum(sr, sc)){
      skeleton.src = "Images/image.png";
      zombie.style.display = "none";
    }
    else{
      zombie.style.display= "block";
      skeleton.style.display = "block";
      zombie.src = "Images/zombie.png";
      skeleton.src = "Images/skeleton.png";
    }
    map[zr][zc] = 0;
    zr = cd[goto][0], zc = cd[goto][1];
    map[zr][zc] = 1;
    
    if(is_close(row, col)){
        zombie_attack();
    }
}

let cells = [], skc = [], skroute, sr, sc, sgr, sgc;

function add_skeleton(){
  let del = [];
    
  for(let i = 0; i < skc.length; i++){
      let x = cd[skc[i]][0];
      let y = cd[skc[i]][1];
      
      if(Manhattan(x, y, n, n - 1) <= 10 || (x == zr && y == zc) || eppos.includes(gnum(x, y))){
          skc.splice(i, 1);
          del.push(skc[i]);
      }
  }
    
  let id = skc[Math.floor(Math.random() * skc.length)];
  let cell = document.getElementById(id + "");
  let skeleton = document.createElement("img");
  
  for(let i = 0; i < del.length; i++){
      skc.push(del[i]);
  }
  
  skeleton.className = "skeleton";
  skeleton.src = "Images/skeleton.png";
  cell.appendChild(skeleton);
  sr = sgr = cd[id][0];
  sc = sgc = cd[id][1];
  skc.splice(skc.indexOf(id), 1);
  skinterval = setInterval(skeleton_move, 1000);
}

function is_close_sk(){
    for(let i = 0; i < 4; i++){
        for(let j = 1; j <= 4; j++){
            let currR = sr + mi[i] * j;
            let currC = sc + mj[i] * j;
            
            if(currR == row && currC == col){
                return j;
            }
            if(block[gnum(currR, currC)] && (currR != zr || currC != zc)){
                break;
            }
        }
    }
    return 0;
}

function skeleton_move(){
  if(block_move){
    return;
  }
  if(sr == sgr && sc == sgc){
    let id = skc[Math.floor(Math.random() * skc.length)];
    skc.push(gnum(sr, sc) + "");
    sgr = cd[id][0];
    sgc = cd[id][1];
    skroute = bfs(sr, sc, sgr, sgc, 0);
  }
  if(!skroute.length){
    return;
  }
  let id = skroute[skroute.length - 1];
  let zid = gnum(zr, zc);
  skroute.pop();
  let curr = document.getElementById(gnum(sr, sc) + "");
  let gt = document.getElementById(id + "");
  let skeleton = document.getElementsByClassName("skeleton")[0];
  
  for(let i = 0; i < curr.childNodes.length; i++){
      let node = curr.childNodes.item(i);
      
      if(node.className == "skeleton"){
        curr.removeChild(node);
        break;
      }
  }
  if(eppos.includes(gnum(sr, sc))){
      let epearl = curr.firstChild;
      epearl.style.display = "block";
  }
  if(eppos.includes(id)){
      let epearl = gt.firstChild;
      epearl.style.display = "none";
  }
  
  let zombie = document.getElementsByClassName("zombie")[0];
  
  if (id == gnum(zr, zc)) {
    skeleton.src = "Images/image.png";
    zombie.style.display = "none";
  }
  else {
    zombie.style.display = "block";
    skeleton.style.display = "block";
    zombie.src = "Images/zombie.png";
    skeleton.src = "Images/skeleton.png";
  }
  
  sr = cd[id][0];
  sc = cd[id][1];
  
  let icsk = is_close_sk();
    
  if(icsk){
      skeleton_attack(icsk);
  }
  gt.appendChild(skeleton);
}

function skeleton_attack(dis){
    if(frst){
      return;
    }
    let curr = document.getElementById(gnum(sr, sc) + "");
    let arrow = document.createElement("img");
    arrow.className = "arrow";
    block_move = 1;
    bow.play();
    
    let d1 = -53 * (dis - 1) - 30;
    let d2 = 53 * (dis - 1) + 30;
    
    if(dis == 1){
      d1 = -53;
      d2 = 53;
    }
    
    if(sc == col){
      if(sr > row){
        arrow.id = "arrow_up";
        arrow.src ="Images/up.png";
        arrow.style.setProperty("--arrow-dis", d1 + "px");
      }
      else{
        arrow.id = "arrow_down";
        arrow.src ="Images/down.png";
        arrow.style.setProperty("--arrow-dis", d2 + "px");
      }
    }
    else{
      if (sc > col) {
        arrow.id = "arrow_left";
        arrow.src = "Images/left.png";
        arrow.style.setProperty("--arrow-dis", d1 + "px");
      }
      else {
        arrow.id = "arrow_right";
        arrow.src = "Images/right.png";
        arrow.style.setProperty("--arrow-dis", d2 + "px");
      }
    }
    
    curr.appendChild(arrow);
    
    setTimeout(function f(){
      curr.removeChild(arrow);
      life_rem();
    }, 1500);
}

let block = new Map();

function config_map(){
  let disp = Math.pow((n - 2), 2) + 2;
  
  for(let i = 2; i < n; i++){
    for(let j = 2; j < n; j++){
      let num = rand() % 2;
      let idc = gnum(i, j);
      
      if(num){
        disp--;
        
        map[i][j] = 1;
        dfs(1, 2);
        if(disp != cnt){
          disp++;
          map[i][j] = 0;
          fcell.push(idc);
          cells.push(idc);
          skc.push(idc);
          let cell = document.getElementById(idc + "");
          cell.style.backgroundImage = "url(Images/walk.png)";
        }
        else{
          let child = document.getElementById(idc + "");
       
          if(rand() % 2){
            child.style.backgroundImage = "url(Images/wall.png)";
            block[idc] = 1;
          }
          else{
            child.style.backgroundImage = "url(Images/wall2.png)";
            block[idc] = 2;
          }
       }
       rstart();
      }
      else{
          fcell.push(idc);
          cells.push(idc);
          skc.push(idc);
      }
    }
  }
  
  rem(2);
  rem(n * n - 1);
  
  let epc = Math.floor(Math.random() * 2) + 4; 
      
  for(let i = 0; i < epc; i++){
      let len = fcell.length;
      let idc = fcell[Math.floor(Math.random() * len)];
      let cell = document.getElementById(idc + "");
      let epearl = document.createElement("img");
      
      epearl.className = "epearl";
      epearl.src = "Images/epearl.webp";
      cell.appendChild(epearl);
      eppos.push(idc);
      rem(idc);
  }
  
  let zid = fcell[Math.floor(Math.random() * fcell.length)];
  let end = document.getElementById("2");
  let diamond = document.createElement("img");
  
  zr = cd[zid][0], zc = cd[zid][1];
  add_zombie(zid);
  add_skeleton();
  
  diamond.className = "diamond";
  diamond.src = "Images/diamond.png";
  end.appendChild(diamond);
    
  let child = document.getElementById(n * n - 1 + "");
  child.style.backgroundImage = "url(Images/walk.png)";
  
  let steve = document.createElement("img");
  steve.className= "steve";
  steve.src = "Images/token.png";
  child.appendChild(steve);
  steve.style.display = "block";
  
  map[n][n - 1] = 1;
    
  for(let i = 1; i <= n; i++){
    for(let j = 1; j <= n; j++){
      let child = document.getElementById(gnum(i, j) + "");
      
      if(map[i][j] == 1){
        if(i == 1 || map[i - 1][j]== 0){
          child.style.borderTopWidth = "1px";
          child.style.borderTopColor = "black";
         
        }
        if(j == n || map[i][j + 1] == 0){
          child.style.borderRightWidth = "1px";
          child.style.borderRightColor = "black";
        }
        if(i == n || map[i + 1][j]== 0){
          child.style.borderBottomWidth = "1px";
          child.style.borderBottomColor = "black";
        }
        if(j == 1 || map[i][j - 1] == 0){
          child.style.borderLeftWidth = "1px";
          child.style.borderLeftColor = "black";
        }
      }
    }
  }
  
  config_buttons();
}

function config_buttons(){
  let lb = document.getElementsByClassName("bdir");
  
  for(let i = 0; i < 4; i++){
    let bdir = lb[i];
    let dir = bdir.id;
    bdir.addEventListener("click", move);
    bdir.style.backgroundImage = "url(Images/" + dir +".svg)";
  }
  document.addEventListener("keydown", move);
}

let row = n, col = n - 1, frst = 1;
let ct = 0;
function move(e){
  if(block_move || is_close()){
    return null;
  }

  let dir = e.target.id;
  let curr = document.getElementById(gnum(row, col) + "");
  let key = String.fromCharCode(e.keyCode);

  if(key == "W" || key == "A" || key == "S" || key == "D"){
      dir = "";
  }
  
  map[row][col] = 0;
  let ar = row, ac = col;
  
  if(dir == "up" || key == "W"){
    if(frst){
      frst = 0;
      curr.classList.add("start");
      map[row][col] = 1;
    }
    if(ok(row - 1, col)){
      let goto = document.getElementById(gnum(row - 1, col) + "");
      let steve = curr.lastChild;
      
      curr.removeChild(steve);
      goto.appendChild(steve);
      row--;
    }
  }
  else if(dir == "down" || key == "S"){
    if(ok(row + 1, col)){
      let goto = document.getElementById(gnum(row + 1, col) + "");
      let steve = curr.lastChild;
      
      curr.removeChild(steve);
      goto.appendChild(steve);
      row++;
    }
  }
  else if(dir == "right" || key == "D") {
    if(ok(row, col + 1)) {
      let goto = document.getElementById(gnum(row, col + 1) + "");
      let steve = curr.lastChild;
  
      curr.removeChild(steve);
      goto.appendChild(steve);
      col++;
    }
  }
  else if(dir == "left" || key == "A") {
    if(ok(row, col - 1)) {
      let goto = document.getElementById(gnum(row, col - 1) + "");
      let steve = curr.lastChild;
  
      curr.removeChild(steve);
      goto.appendChild(steve);
      col--;
    }
  }

  if(row != ar || col != ac){
      remsel(ar, ac);
      if (sele) {
        sele = 0;
        remchild(cell);
        cell = 0;
      }
  }
  map[row][col] = 1;
  let idc = gnum(row, col);
  if(row == 1 && col == 2){
    let end = document.getElementById("2");
    end.removeChild(end.firstChild);
    gameover();
  }
  else if(eppos.includes(idc)){
    let cell = document.getElementById(idc + "");
    cell.removeChild(cell.firstChild);
    teleport();
  }
  else{
      let icsk = is_close_sk();

      if(is_close(row, col)){
         zombie_attack();
      }
      else if(icsk){
          skeleton_attack(icsk);
      }
      else if(!tuto){
          addsel(row, col);
      }
  }
}

function addsel(r, c){
   for (let i = 0; i < 4; i++) {
     let ip = r + mi[i];
     let jp = c + mj[i];
     let idc = gnum(ip, jp);
     let cell = document.getElementById(idc + "");
   
     if (block[idc]) {
       cell.addEventListener("click", select);
     }
   }
}

function remsel(r, c){
   for (let i = 0; i < 4; i++) {
     let ip = r + mi[i];
     let jp = c + mj[i];
     let idc = gnum(ip, jp);
   
     if (block[idc]) {
       let cellp = document.getElementById(idc + "");
       cellp.removeEventListener("click", select);
     }
   }
}

let block_move = 0;

function teleport() {
  let pos = eppos.indexOf(gnum(row, col));
  eppos.splice(pos, 1);
    
  let btbar = document.getElementById("btbar");
  let ifcon = document.getElementById("ifcon");
  btbar.style.display = "none";
  block_move = 1;
  ifcon.style.display = "block";
  clearInterval(interval, 700);
  clearInterval(skinterval, 1000);
    
  for(let i = row - 2; i <= row + 2; i++){
    for(let j = col - 2; j <= col + 2; j++){
      if(ok(i, j) && (i != row || j != col) && (i != sr || j != sc)){
        let cell = document.getElementById(gnum(i, j) + "");
        cell.style.backgroundImage = "url(Images/check.png)";
        cell.addEventListener("click", make_tp);
      }
    }
  }
}

function make_tp(e){
  let cell = e.target;
  let curr = document.getElementById(gnum(row, col ) + "");
  
  for (let i = row - 2; i <= row + 2; i++) {
    for (let j = col - 2; j <= col + 2; j++) {
      if (ok(i, j)) {
        let cellp = document.getElementById(gnum(i, j) + "");
        cellp.style.backgroundImage = "url(Images/walk.png)";
        cellp.removeEventListener("click", make_tp);
      }
    }
  }
  tp.play();
  let steve = curr.lastChild;
  curr.removeChild(steve);
  cell.appendChild(steve);
  let idc = parseInt(cell.id);
  map[row][col] = 0;
  row = cd[idc][0], col = cd[idc][1];
  let icsk = is_close_sk();
  block_move = 0;
  if(is_close(row, col)){
      zombie_attack();
  }
  else if(icsk){
     block_move = 1;
     skeleton_attack(icsk);
  }
  else{
    addsel(row, col);
  }
  map[row][col] = 1;
  let btbar = document.getElementById("btbar");
  let ifcon = document.getElementById("ifcon");
  btbar.style.display = "block";
  ifcon.style.display = "none";
  interval = setInterval(zombie_move, 700);
  skinterval = setInterval(skeleton_move, 1000);
}

function gameover(){
  let gover = document.getElementById("gover");
  let bdir = document.getElementsByClassName("bdir");
  let prnt = document.getElementsByClassName("prnt")[0];
  let btbar = document.getElementById("btbar");
  let rst = document.getElementById("rst");
  
  clearInterval(interval);
  clearInterval(skinterval);
  prnt.style.opacity = btbar.style.opacity = "0.5";
  document.removeEventListener("keydown", move);
  block_move = 1;
  let state = document.getElementById("state");
  if(row == 1){
    state.classList.add("win");
    state.textContent = "You Win!";
  }
  else{
    state.classList.add("lose");
    state.textContent = "Game Over";
  }
  gover.style.display = "block";
  setTimeout(function f(){
    rst.style.display = "block";
    let body = document.getElementsByTagName("body")[0];
    document.addEventListener("click", rload);
    document.addEventListener("keydown", rload);
  }, 1600);
 
}

function rload(){
  location.reload();
}

let t = 10, t2 = 10, inter1, inter2, kt = 0.0175, sele = 0, cv;

function remchild(node){
  for(let i = node.childNodes.length - 1; i >= 0; i--){
    node.removeChild(node.lastChild);
  }
}

function add(){
  let cvc = document.getElementById("canvas_container");
  cvb = document.getElementById("cvb");
  
  cvc.addEventListener("touchstart", start);
  cvc.addEventListener("touchend", end);
}

function end(e){
  clearInterval(inter1);
  clearInterval(inter2);
  stop();
  
  let canvas = cvb.getContext("2d");
  canvas.clearRect(0, 0, 50, 50);
  element = document.getElementById("cv");
  canvas = element.getContext("2d");
  canvas.clearRect(0, 0, 180, 180);
  t = 0;
  t2 = 0;
}

let cell = 0;

function select(e){
  let tg = e.target;
  
  if(tg == cell || tg.className != "proto"){
    return;
  }
  else{
    cell = tg;
  }
  let cft = document.createElement("div");
  
  if(tuto){
    tuto = block_move = 0;
    let cftcon = document.getElementById("cftcon");
    let btbar = document.getElementById("btbar");
   
    btbar.style.display = "block";
    cftcon.style.display = "none";
  }
  cft.className = "cft";
  cell.appendChild(cft);
  sele = 1;
  
  for(let i = 0; i < 4; i++){
    let ip = row + mi[i];
    let jp = col + mj[i];
    let b = block[gnum(ip, jp)];
    let cell2 = document.getElementById(gnum(ip, jp) + "");
    
    if(cell2 != cell && b){
      remchild(cell2);
    }
    if(b){
      if(b == 1){
        cell2.style.backgroundImage = "url(Images/wall.png)";
      }
      else{
        cell2.style.backgroundImage = "url(Images/wall2.png)";
      }
    }
  }
}

let tuto = 1;
let breaking= new Audio("Audio/breaking.mp3");
let broke = new Audio("Audio/broke.mp3");

function stop(){
  breaking.pause();
  breaking.currentTime = 0;
}

function start(e){
  let element = document.getElementById("cv");
  let canvas = element.getContext("2d");
  
  if(tuto){
      let ok = 0;
      
      for(let i = 0; i < 4; i++){
         let ip = row + mi[i];
         let jp = col + mj[i];
         let id = gnum(ip, jp);
         let cell2 = document.getElementById(id + "");
         
         if(block[id]){
           ok = 1;
           
           cell2.style.backgroundImage = "url(Images/check.png)";
           cell2.addEventListener("click", select);
          }
      }
      if(ok){
        let btbar = document.getElementById("btbar");
        let cftcon = document.getElementById("cftcon");
        
        block_move = 1;
        btbar.style.display = "none";
        cftcon.style.display = "block";
      }

  }
  if(sele){
    let cft = cell.firstChild;
    let canvas = cvb.getContext("2d");
    cft.appendChild(cvb);
    breaking.play();
   
    inter1 = setInterval(function f() {
      let p = t * 100 / 300;
      let rad = p * 360 / 100 * kt;
    
      canvas.lineWidth = 3;
      canvas.strokeStyle = "lightcyan";
      canvas.lineCap = "round";
    
      canvas.beginPath();
      canvas.arc(23, 23, 17, 0, rad);
      canvas.stroke();
      
      t++;
      if (t > 300) {
        stop();
        broke.play();
        end();
        sele = 0;
        remchild(cell);
        let idc = parseInt(cell.id);
        let i = cd[idc][0];
        let j = cd[idc][1];
        block[idc] = 0;
        cell.style.backgroundImage = "url(Images/walk.png)";
        for(let k = 0; k < 4; k++){
          let ip = i + mi[k];
          let jp = j + mj[k];
          let idp = gnum(ip, jp);
          let child = document.getElementById(idp + "")
          
          if(block[idp] || ip == n || jp == n){
            if(k == 0){
               child.style.borderLeftWidth = "1px";
               child.style.borderLeftColor = "black";
            }
            if(k == 1){
               child.style.borderTopWidth = "1px";
               child.style.borderTopColor = "black";
            }
            if(k == 2){
               child.style.borderRightWidth = "1px";
               child.style.borderRightColor = "black";
            }
            if(k == 3){
               child.style.borderBottomWidth = "1px";
               child.style.borderBottomColor = "black";
            }
          }
        }
        cell.style.borderStyle = "solid";
        cell.style.borderColor = "rgba(255, 255, 255, 0)";
        cell.style.borderWidth = "1.5px";
        cell.removeEventListener("click", select);
        skc.push(idc);
        fcell.push(idc);
        cells.push(idc);
        map[i][j] = 0;
        let icsk = is_close_sk();
        if(icsk){
          skeleton_attack(icsk);
        }
      }
    }, 10);
    
    let cv = document.getElementById("cv");
    let canvas2 = cv.getContext("2d");
    
    inter2 = setInterval(function f() {
      let p = t * 100 / 300;
      let rad = p * 360 / 100 * kt;
    
      canvas2.lineWidth = 12;
      canvas2.strokeStyle = "lightcyan";
      canvas2.lineCap = "round";
    
      canvas2.beginPath();
      canvas2.arc(90, 90, 80, 0, rad);
      canvas2.stroke();
      
      t2++;
    }, 10);
  }
}

window.addEventListener("load", add);
window.addEventListener("load", create_grid); 

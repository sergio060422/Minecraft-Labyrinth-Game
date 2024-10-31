let n = 20;

function create_grid() {
  let prnt = document.getElementsByClassName("prnt")[0];
  let wd = document.getElementsByTagName("hr")[0].offsetWidth;
  
  if(wd <= 8){
      n = 15;
  }
  
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

let map = new Map();

function gnum(i, j) {
  return (i - 1) * n + j;
}

function fill(){
  for(let i = 1; i <= n; i++){
    let a = [2];
    
    for(let j = 1; j <= n; j++){
      if(i % n < 2 || j % n < 2){
        a.push(1);
        let child = document.getElementById(gnum(i, j) + "");
        
        if(i != 1 || j != 2){
           child.style.backgroundImage = "url(Images/wall.png)";
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

function config_map(){
  let disp = Math.pow((n - 2), 2) + 2;
  
  for(let i = 2; i < n; i++){
    for(let j = 2; j < n; j++){
      let num = Number((Math.random() + "").substr(2, 1)) % 2;
      
      if(num){
        disp--;
        
        map[i][j] = 1;
        dfs(1, 2);
        if(disp != cnt){
          disp++;
          map[i][j] = 0;
        
        }
        else{
          let child = document.getElementById(gnum(i,j) + "");
         
          child.style.backgroundImage = "url(Images/wall.png)";
          
        }
        rstart();
      }
    }
  }
  let end = document.getElementById("2");
  let diamond = document.createElement("img");
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
        if(j == 1 || map[i][j - 1]== 0){
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

let row = n, col = n - 1;

function move(e){
  let dir = e.target.id;
  let curr = document.getElementById(gnum(row, col) + "");
  let key = String.fromCharCode(e.keyCode);
    
  if(dir == "up" || key == "W"){
    if(ok(row - 1, col)){
      let goto = document.getElementById(gnum(row - 1, col) + "");
      let steve = curr.lastChild;
      
      curr.removeChild(steve);
      goto.appendChild(steve);
      row--;
    }
  }
  if(dir == "down" || key == "S"){
    if(ok(row + 1, col)){
      let goto = document.getElementById(gnum(row + 1, col) + "");
      let steve = curr.lastChild;
      
      curr.removeChild(steve);
      goto.appendChild(steve);
      row++;
    }
  }
  if (dir == "right" || key == "D") {
    if (ok(row, col + 1)) {
      let goto = document.getElementById(gnum(row, col + 1) + "");
      let steve = curr.lastChild;
  
      curr.removeChild(steve);
      goto.appendChild(steve);
      col++;
    }
  }
  if (dir == "left" || key == "A") {
    if (ok(row, col - 1)) {
      let goto = document.getElementById(gnum(row, col - 1) + "");
      let steve = curr.lastChild;
  
      curr.removeChild(steve);
      goto.appendChild(steve);
      col--;
    }
  }
  if(row == 1 && col == 2){
    let end = document.getElementById("2");
    end.removeChild(end.firstChild);
    gameover();
  }
  
}

function gameover(){
  let win = document.getElementById("gover");
  let bdir = document.getElementsByClassName("bdir");
  let prnt = document.getElementsByClassName("prnt")[0];
  let btbar = document.getElementById("btbar");
  let rst = document.getElementById("rst");

  prnt.style.opacity = btbar.style.opacity = "0.5";
  document.removeEventListener("keydown", move);
  for(let i = 0; i < 4; i++){
    bdir[i].removeEventListener("click", move);
  }
  win.style.display = "block";
  setTimeout(function f(){
    rst.style.display = "block";
    let body = document.getElementsByTagName("body")[0];
    document.addEventListener("click", rload);
    document.addEventListener("keydown", rload);
  }, 2100);
 
}

function rload(){
  location.reload();
}


window.addEventListener("load", create_grid); 
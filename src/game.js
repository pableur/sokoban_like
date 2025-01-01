var grid = [
    ['#','#','#','#','#','#','#','#'],
    ['#','.','E','.','.','.','.','#'],
    ['#','C','C','.','.','.','.','#'],
    ['#','.','C','.','.','.','.','#'],
    ['#','E','.','.','H','.','.','#'],
    ['#','.','E','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','#'],
    ['#','#','#','#','#','#','#','#'],
];

function hitt_crate(pos){
    for(let i = 0; i < crates.length; i++){
        if(crates[i].equals(pos)){
            return i;
        }
    }
    return false;
}

function check_end_game(){
    for(let i = 0; i < end_points.length; i++){
        console.log('end game check '+end_points[i]);
        if(hitt_crate(end_points[i]) === false){
            return false;
        }
    }
    console.log('You win');
    if (typeof confirmationDialog.showModal === "function") {
        confirmationDialog.showModal();
      } else {
        // is not supported
        alert(
          "The dialog HTML5 API is not supported by this browser. Please, update."
        );
      }
}

function move_hero(vector){
    let next_pos = hero.add(vector);
    let check_empty_pos = next_pos.add(vector)

    console.log('Move hero current_pos '+hero+' next pos ' + next_pos);
    console.log('check '+check_empty_pos);
    if(map.get(next_pos) == '#'){
        console.log('Hitt wall');
        return;
    }

    let hitted_crate = hitt_crate(next_pos);
    if(hitted_crate !== false){
        console.log(crates)
        console.log('Hitt crate '+ hitted_crate+' at '+next_pos);
        console.log('Empty ?'+hitt_crate(check_empty_pos));
        if(map.get(check_empty_pos) == '#'){
            return;
        }else if(hitt_crate(check_empty_pos) !== false){
            console.log('not empty');
            return;
        }
        else{
            console.log('Move crate '+hitted_crate+' to '+check_empty_pos);
            crates[hitted_crate] = check_empty_pos;
            document.getElementById("crate_" + hitted_crate).style.left = 64*crates[hitted_crate].x+'px';
            document.getElementById("crate_" + hitted_crate).style.top = 64*crates[hitted_crate].y+'px';
            check_end_game();
        }
    }
    
    hero = hero.add(vector)
    hero_element.style.left = 64 * hero.x + 'px';
    hero_element.style.top = 64 * hero.y + 'px';
}

var game_element = document.getElementById("game");
var map_element = document.getElementById("map");


var map = new Map(grid);
var hero = null;
var crates = [];
var end_points = [];

for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
        switch (map.get(new Position(x, y)) ) {
            case 'H':
                hero = new Position(x, y);
                continue;
            case 'C':
                crates.push(new Position(x, y));
                break;
            case 'E':
                end_points.push(new Position(x, y));
                break;
        }

        asset = map.get_cell_asset(new Position(x, y));
        var block = document.createElement("img")
        if(map.get(new Position(x, y)) == 'C'){
            block.id = "crate_" + (crates.length - 1)
            block.classList.add('crate');
        }
        else{
            block.id = "map_" + x + "_" + y
        }
        block.classList.add('asset');
        block.style.left = 64*x+'px';
        block.style.top = 64*y+'px';
        block.src = asset
        map_element.appendChild(block)
    }
}

map_element.style.width = 64*map.width+'px';
map_element.style.height = 64*map.height+'px';

var hero_element = document.createElement("img")
hero_element.id = "hero"
hero_element.classList.add('asset');
hero_element.style.left = 64*hero.x+'px';
hero_element.style.top = 64*hero.y+'px';
game_element.appendChild(hero_element)

function animation() {
    let hero = document.getElementById('hero')
    if(hero.src.includes('assets/Character10.png')){
        hero.src = 'assets/Character1.png'
    }else{
        hero.src = 'assets/Character10.png'
    }

    setTimeout(animation, 100)
}
setTimeout(animation, 200)


document.addEventListener(
    "keydown",
    (event) => {
        const keyName = event.key;

        switch(keyName){
            case "ArrowUp":
                move_hero(new Position(0, -1));
                break;
            case "ArrowDown":
                move_hero(new Position(0, 1));
                break;
            case "ArrowLeft":
                move_hero(new Position(-1, 0));
                break;
            case "ArrowRight":
                move_hero(new Position(1, 0));
                break;
            default:
                console.log('Key pressed '+keyName)
        }
    },
    false,
);


// elements IDs attribution
const confirmationDialog = document.querySelector("#confirmationDialog");
const buttonOk = document.querySelector("#buttonOk");
const buttonClose = document.querySelector("#buttonClose");
const buttonCloseX = document.querySelector("#buttonCloseX");
const result = document.querySelector("#result");


function handleClose() {
  confirmationDialog.close();
  result.textContent = "Result: <dialog> was closed (click event)";
}

// button1
buttonOk.addEventListener("click", () => {
  confirmationDialog.close();
  result.textContent = "Result: <dialog> was confirmed! (click event)";
  // your confirm logic here...
});

// button2
buttonClose.addEventListener("click", () => {
  handleClose()
});

// button3
buttonCloseX.addEventListener("click", () => {
  handleClose()
});

// esc key
confirmationDialog.addEventListener("cancel", (event) => {
  result.textContent = "Result: <dialog> was canceled by ESC key press (cancel event)";
});

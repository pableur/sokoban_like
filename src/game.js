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
    if(invert_direction){
        vector.x = -vector.x;
        vector.y = -vector.y;
    }
    let next_pos = hero.add(vector);
    let check_empty_pos = next_pos.add(vector)

    console.log('Move hero current_pos '+hero+' next pos ' + next_pos);
    console.log('check '+check_empty_pos);
    if(map.get(next_pos) == '#')
        return;

    let hitted_crate = hitt_crate(next_pos);
    if(hitted_crate !== false){
        if(map.get(check_empty_pos) == '#'){
            return;
        }else if(hitt_crate(check_empty_pos) !== false){
            return;
        }
        else{
            crates[hitted_crate] = check_empty_pos;
            animate_move(document.getElementById("crate_" + hitted_crate), 64*crates[hitted_crate].x, 64*crates[hitted_crate].y, 4, 4)
            check_end_game();
        }
    }

    hero = hero.add(vector)
    animate_move(hero_element, 64 * hero.x, 64 * hero.y, 4, 4)
}

function init_game(grid){
    map = new Map(grid);
    crates = [];
    end_points = [];

    map_element.innerHTML = '';

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
                case '.':
                    continue;
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

    if(hero_element == null){
        hero_element = document.createElement("img")
        hero_element.id = "hero"
        hero_element.classList.add('asset');
    }
    hero_element.style.left = 64*hero.x+'px';
    hero_element.style.top = 64*hero.y+'px';
    game_element.appendChild(hero_element);
}

var game_element = document.getElementById("game");
var map_element = document.getElementById("map");


var map = null;
var hero = null;
var hero_element = null;
var crates = [];
var end_points = [];
var in_animation = false;
var invert_direction = false;

var hero_direction = 'left';

var hero_assets = {
    'left': ['assets/Character1.png', 'assets/Character10.png'],
    'right': ['assets/Character2.png', 'assets/Character3.png'],
    'up': ['assets/Character8.png', 'assets/Character9.png'],
    'down': ['assets/Character5.png', 'assets/Character6.png']
}

var hero_assets_index = 0;
init_game(level_1);

function animation() {
    hero_assets_index = (hero_assets_index + 1) % 2
    let hero = document.getElementById('hero')
    hero.src = hero_assets[hero_direction][hero_assets_index]

    setTimeout(animation, 100)
}

function animate_move(element, x, y, delta_x, delta_y){
    in_animation = true;
    var direction = 1;
    if(parseInt(element.style.left) != x){
        if(parseInt(element.style.left) > x)
            direction = -1;
        let new_x = parseInt(element.style.left) + delta_x * direction;
        element.style.left = new_x + 'px';
    }

    direction = 1;
    if(parseInt(element.style.top) != y){
        if(parseInt(element.style.top) > y)
            direction = -1;
        let new_y = parseInt(element.style.top) + delta_y * direction;
        element.style.top = new_y + 'px';
    }
    console.log('animate move '+element.style.left+' '+element.style.top);
    console.log('target '+x+' '+y);

    if(parseInt(element.style.left) == x && parseInt(element.style.top) == y){
        in_animation = false;
        return;
    }
    setTimeout(animate_move, 20, element, x, y, delta_x, delta_y);
}

animation();

document.addEventListener(
    "keydown",
    (event) => {
        const keyName = event.key;
        if(in_animation)
            return;
        switch(keyName){
            case "ArrowUp":
                hero_direction = 'up';
                move_hero(new Position(0, -1));
                break;
            case "ArrowDown":
                hero_direction = 'down';
                move_hero(new Position(0, 1));
                break;
            case "ArrowLeft":
                hero_direction = 'left';
                move_hero(new Position(-1, 0));
                break;
            case "ArrowRight":
                hero_direction = 'right';
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
const buttonRetry = document.querySelector("#buttonRetry");


function handleClose() {
  confirmationDialog.close();
  result.textContent = "Result: <dialog> was closed (click event)";
}

// button1
buttonOk.addEventListener("click", () => {
  confirmationDialog.close();
  current_level += 1;
  init_game(levels[current_level]);
});

buttonRetry.addEventListener("click", () => {
    init_game(levels[current_level]);
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

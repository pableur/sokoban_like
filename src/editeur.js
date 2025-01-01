grid = [
    ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
    ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
]
var selected_item = '.';

var map = new Map(grid);

var map_element = document.getElementById("map");
load_map();

function load_map(){
    map_element.innerHTML = '';

    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            switch (map.get(new Position(x, y)) ) {
                case '.':
                    continue;
            }

            asset = map.get_cell_asset(new Position(x, y));
            var block = document.createElement("img")

            block.classList.add('asset');
            block.style.left = 64*x+'px';
            block.style.top = 64*y+'px';
            block.src = asset
            map_element.appendChild(block)
        }
    }

    map_element.style.width = 64*map.width+'px';
    map_element.style.height = 64*map.height+'px';
}

function select_item(item){
    console.log(item);
    selected_item = item;
    for(let element of document.getElementsByClassName('selected')){
        element.classList.remove('selected');
    }

    switch(item){
        case '.':
            element = document.getElementById('ressource_ground');
            break;
        case '#':
            element = document.getElementById('ressource_wall');
            break;
        case 'E':
            element = document.getElementById('ressource_endpoint');
            break;
        case 'C':
            element = document.getElementById('ressource_crate');
            break;
        case 'H':
            element = document.getElementById('ressource_hero');
    }
    element.classList.add('selected');
}

function printMousePos(event) {
    console.log("clientX: " + event.clientX + " - clientY: " + event.clientY);
    x = Math.floor(event.clientX / 64);
    y = Math.floor(event.clientY / 64);
    map.set(new Position(x, y), selected_item);
    load_map();
  }

function render_map_as_js_code(){
    var output = 'var level = [\n'
    for (let y = 0; y < map.height; y++) {
        output += '    [\''+map.grid[y].join('\',\'')+'\'],\n';
    }

    output += '];'
    return output
}


  document.getElementById('map').addEventListener('click', printMousePos);


const button_js_code = document.querySelector("#buttonJsCode");

button_js_code.addEventListener("click", () => {
    var element = document.getElementById("js_code");
    element.innerText = render_map_as_js_code();
    if (typeof confirmationDialog.showModal === "function") {
        confirmationDialog.showModal();
    }
});
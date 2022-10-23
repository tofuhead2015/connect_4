const WIDTH = 7
const HEIGHT = 6

const board = new Array()

let current_player = 0

let players = [{name: "Player One"}, {name: "Player Two"}]

let game_over = false


function layout_board(board_width, board_height){
    document.getElementById('game-status-board').innerText = players[current_player].name

    const board_container = document.getElementById('board-container')

    const grid = document.createElement('table')

    // create the top row
    const top_row = document.createElement('tr')
    for (let i = 0; i < board_width; i ++){
        let row_item = document.createElement('th')
        row_item.className = "top-row-item"
        row_item.id = "top" + i
        row_item.addEventListener('click', board_clicked)        
        top_row.append(row_item)
    }
    grid.append(top_row)

    // create the rest of the rows
    for (let i = 0; i < board_height; i ++){
        let row = document.createElement('tr')
        for (let j = 0; j < board_width; j ++){
            let row_item = document.createElement('td')
            row_item.className = "row-item"
            row_item.id = "slot" + i + ":" + j
            let round = document.createElement('div')
            round.id = "round" + i + ':' + j
            round.classList.add('round')   
            round.classList.add('empty-color')                     
            row_item.append(round)
            row.append(row_item)
        }
        grid.append(row)
    }

    board_container.append(grid)    
}

function init_board(){
    for (let i = 0; i < HEIGHT; i++){
        let row = []
        for (let j = 0; j < WIDTH; j ++) row.push(null)
        board.push(row)
    }
}

function board_clicked(e){
    if (game_over) return

    const clicked_id = e.target.id

    console.log(clicked_id)

    const col = parseInt(clicked_id[clicked_id.length-1])
    const drop_row = get_first_empty_row(col)

    if (drop_row === -1) return

    show_drop_animation(drop_row, col)    
}

function drop_round_original(row, col, clicked_id){
    show_drop_animation(row, col, clicked_id)
    console.log('drop_round', row, col)
    const round = document.getElementById('round' + row + ':' + col)
    if (!current_player){
        round.classList.remove('empty-color')
        round.classList.add('player1-color')
    } else {
        round.classList.remove('empty-color')
        round.classList.add('player2-color')
    } 
    
}

function show_drop_animation(row, col){    
    let animated_row = 0
    let round_color 
    if (!current_player)
        round_color = 'player1-color'
    else
        round_color = 'player2-color'
    let id = setInterval(function(){
        if (animated_row > 0 && animated_row != row + 1){
            let round_above = document.getElementById("round" + (animated_row-1) + ":" + col)
            round_above.classList.remove(round_color)
            round_above.classList.add("empty-color")
        }
        if (animated_row <= row){
            let round = document.getElementById("round" + animated_row + ":" + col)
            round.classList.remove('empty-color')
            round.classList.add(round_color)
        }        
        animated_row ++
        if (animated_row > row){
            clearInterval(id)
            board[row][col] = current_player    
            if (!check_game_over(row, col)) toggle_current_player()
        } 
    }, 200)    
}


function get_first_empty_row(col_id){
    console.log(board)

    for (let i = board.length - 1; i >= 0; i --){
        if (board[i][col_id] === null) return i
    }
    
    return -1
}

function check_game_over(row, col){
    let slots = check_for_win_all_four(row,col)
    if (slots.length >= 4){
        display_win(slots)
        game_over = true
        return true
    }

    if (check_board_full()){
        // a tie
        display_tie()
        game_over = true
        return true
    }
    return false
}

function display_tie(){
    document.getElementById('game-status-board').innerText = 'A Tie Game'
}

function display_win(slots){
    let i = 1
    for (let slot of slots){
        let id = 'slot' + slot[0] + ":" + slot[1]
        console.log('display_win slot id:', id)
        document.getElementById(id).classList.add('win-slot')
        let round_id = 'round' + slot[0] + ":" + slot[1]
        document.getElementById(round_id).innerText = i
        i ++
    }
    document.getElementById('game-status-board').innerText = players[current_player].name + " wins!"
}

function check_for_win_all_four(row, col){  

    const NorthSouth = [[-1, 0], [1, 0]]
    const EastWest = [[0, -1], [0, 1]]
    const NE_SW = [[-1, -1], [1, 1]]
    const NW_SE = [[-1, 1], [1, -1]]
    const directions = [NorthSouth, EastWest, NE_SW, NW_SE]

    for (let dirs of directions){
        let slots = [[row, col]]
        for (let dir of dirs){
            let i = row
            let j = col
            let prior = true
            while (true){
                i += dir[0]
                j += dir[1]
                if (i < 0 || j >= WIDTH || i >= HEIGHT || j < 0)  break
                if (board[i][j] === current_player) {
                    if (prior)
                        slots.push([i, j])
                    else
                        slots.shift([i, j])
                } else {
                    break
                }
            }
        }  
        if (slots.length >= 4) return slots
    }
    return []
}

function check_board_full(){
    return !board.some(row=>row.some(slot=>slot===null))
}

function toggle_current_player(){
    current_player = (current_player + 1) % 2
    document.getElementById('game-status-board').innerText = players[current_player].name
    //document.getElementById('game_status-board-round').className = 'playerone-color'
}

init_board()
layout_board(WIDTH, HEIGHT)
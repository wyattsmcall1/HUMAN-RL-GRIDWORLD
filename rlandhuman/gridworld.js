var reward     = [];
var transition = [];
var term_map = [];
var sym_map = [];

function gridworld_init(n_states){
    mdp_init_reward(n_states);
    mdp_init_transition(n_states);
    mdp_init_symbols(n_states);    
}

// init reward map for gridworld
function mdp_init_reward(n_states){
    
    for (var i=0; i < n_states; ++i){
        term_map[i] = new Array(n_states);
        reward[i] = new Array(n_states);
        for (var j=0; j < n_states; ++j){
            reward[i][j] = -1.0;
            term_map[i][j] = false;
        }
    }
    
    // init goal location
    [xi,yi] = mdp_random_state(n_states);
    reward[xi][yi] = 100.0;
    term_map[xi][yi] = true;
    
    // init pit location
    for (var i = 0; i < n_states*n_states/20; ++i){
        [xi,yi] = mdp_random_state(n_states);
        reward[xi][yi] = -100.0;
        term_map[xi][yi] = true;
    }
}

function mdp_step(current_state,action,n_states){
    
    if (document.getElementById("norm_trans").checked){
        if (action == 0){
            current_state[0] = Math.max(0,current_state[0]-1);
        }
        if (action == 1){
            current_state[0] = Math.min(n_dim-1,current_state[0]+1);
        }
        if (action == 2){
            current_state[1] = Math.max(0,current_state[1]-1);
        }
        if (action == 3){
            current_state[1] = Math.min(n_dim-1,current_state[1]+1);
        }
    }
    else if (document.getElementById("semi_trans").checked){
        if (action == 0){
            current_state[0] = Math.min(n_dim-1,current_state[0]+1);
            current_state[1] = Math.min(n_dim-1,current_state[1]+1);
        }
        if (action == 1){
            current_state[0] = Math.max(0,current_state[0]-1);
            current_state[1] = Math.min(n_dim-1,current_state[1]+1);
        }
        if (action == 2){
            current_state[1] = Math.max(0,current_state[1]-2);
        }
        if (action == 3){
            current_state[1] = Math.max(0,current_state[1]-1);
        }
    }
    else if (document.getElementById("rand_trans").checked){
        current_state_1D = current_state[0] + current_state[1]*(n_states);
        new_state = get_transition(current_state_1D, action, n_states);
    
        current_state[0] = Math.floor(new_state % (n_states));
        current_state[1] = Math.floor(new_state / (n_states));
    
        console.log("transition state for action:", current_state[0], current_state[1]);
    }

    
    return current_state;
}

function get_transition(current_state_1D, action, n_states){
    new_state = 0;
    for (var k=0; k < n_states*n_states; ++k){
        if (transition[current_state_1D][action][k] == 1.0){
            new_state = k;
            break;
        }
        else{
            new_state = current_state_1D;
        }
    }
    return new_state;
}

function mdp_init_transition(n_states){
    for (var i=0; i < n_states*n_states; ++i){
        transition[i] = new Array(n_actions);
        for (var j=0; j < n_actions; ++j){
            transition[i][j] = new Array(n_states*n_states);
            for (var k=0; k < n_states*n_states; ++k){
                transition[i][j][k] = 0.0;
            }
        }
    }
    
    var current_state = [0, 0];
    var new_state = [0, 0];
    if (document.getElementById("norm_trans").checked){
        for (var i=0; i < n_states*n_states; ++i){
            for (var j=0; j < n_actions; ++j){
                current_state[0] = Math.floor(i % (n_states));
                current_state[1] = Math.floor(i / (n_states));
                if (j == 0){
                    new_state[0] = Math.max(0,current_state[0]-1);
                }
                if (j == 1){
                    new_state[0] = Math.min(n_dim-1,current_state[0]+1);
                }
                if (j == 2){
                    new_state[1] = Math.max(0,current_state[1]-1);
                }
                if (j == 3){
                    new_state[1] = Math.min(n_dim-1,current_state[1]+1);
                }
                new_state_1D = new_state[0] + new_state[1]*(n_states);
                transition[i][j][new_state_1D] = 1.0;
            }
        }
    }
    else if (document.getElementById("semi_trans").checked){
        for (var i=0; i < n_actions; ++i){
            for (var j=0; j < n_states*n_states; ++j){
                current_state[0] = Math.floor(i % (n_states));
                current_state[1] = Math.floor(i / (n_states));
                if (j == 0){
                    current_state[0] = Math.min(n_dim-1,current_state[0]+1);
                    current_state[1] = Math.min(n_dim-1,current_state[1]+1);
                }
                if (j == 1){
                    current_state[0] = Math.max(0,current_state[0]-1);
                    current_state[1] = Math.min(n_dim-1,current_state[1]+1);
                }
                if (j == 2){
                    current_state[1] = Math.max(0,current_state[1]-2);
                }
                if (j == 3){
                    current_state[1] = Math.max(0,current_state[1]-1);
                }
                new_state_1D = new_state[0] + new_state[1]*(n_states);
                transition[i][j][new_state_1D] = 1.0;
            }
        }
    }
    else if (document.getElementById("rand_trans").checked){
        for (var i=0; i < n_states*n_states; ++i){
            for (var j=0; j < n_actions; ++j){
                rand = Math.floor(Math.random() * n_states*n_states + 0);
                transition[i][j][rand] = 1.0;
            }
        }
    }
}

function mdp_init_symbols(n_states){
    var alphabet = "♠♥♣♦☂☁☀★☎☘☙☾♚♞abcdefghjklmnopqrstu";
   for (var i=0; i < n_states; ++i){
       sym_map[i] = new Array(n_states);
       for (var j=0; j < n_states; ++j){
            sym_map[i][j] = ' ';
        }
    }
    for (var i=0; i < n_states; ++i){
        var s = mdp_random_state(n_states);
        var symbol = alphabet[i];
        sym_map[s[0]][s[1]] = symbol;
    }
}

function mdp_random_state(n_states){
    var all_clr = false;
    
    while (!all_clr){
        var rand1 = Math.floor(Math.random() * n_states );
        var rand2 = Math.floor(Math.random() * n_states );
        if (term_map[rand1][rand2] == false ) all_clr = true;
        s = [rand1, rand2];
    }
    return s;
}


//SERVICE FUNCTIONS
function state2Dto1D(state2D,n_states){
    state1D = (state2D[0] + state2D[1]*(n_states));
    return state1D;
}

function state1Dto2D(state1D,n_states){
    state2D[0] = Math.floor(state1D % (n_states));
    state2D[1] = Math.floor(state1D / (n_states));
    return state2D;
}

function findMaxInd(arr) {
    if (arr.length == 0)
        return -1;

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++)
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }

    return maxIndex;
}

function findMaxVal(arr) {
    if (arr.length == 0)
        return -1;
    
    var max = arr[0];
    
    for (var i = 1; i < arr.length; i++)
        if (arr[i] > max) {
            max = arr[i];
        }
    
    return max;
}

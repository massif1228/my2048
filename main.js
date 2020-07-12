var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function prepareForMobile() {

    if( documentWidth > 500 ) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css("height", cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newgame() {
    //初始化棋盘格
    init();
    //在棋盘格中随机生成2个数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    //建立静态格子
    for ( var i = 0; i < 4; i ++ ) {
        for ( var j = 0; j < 4; j ++ ) {
            var gridCell = $('#grid-cell-' + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }
    }
    //建立二维数组
    for ( var i = 0; i < 4; i ++ ) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for ( var j = 0; j < 4; j ++ ) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    
    //更新格子内容
    updateBoardView();
    score = 0;
    updateScore( score );

}

function updateBoardView() {

    $(".number-cell").remove();
    for( var i = 0; i < 4; i ++ ) {
        for( var j = 0; j < 4; j ++ ) {
            $('#grid-container').append("<div class='number-cell' id='number-cell-" + i + "-" + j +"'></div>");
            var numberCell = $("#number-cell-" + i + "-" + j);
            if ( board[i][j] == 0 ) {
                numberCell.css("width", "0px");
                numberCell.css("height", "0px");
                numberCell.css("top", getPosTop(i, j) + cellSideLength/2);
                numberCell.css("left", getPosLeft(i, j) + cellSideLength/2);
            }
            else {
                numberCell.css("width", cellSideLength);
                numberCell.css("height", cellSideLength);
                numberCell.css("top", getPosTop(i, j));
                numberCell.css("left", getPosLeft(i, j));
                numberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
                numberCell.css("color", getNumberColor(board[i][j]));
                numberCell.css("font-size", getNumberSize(board[i][j]))
                numberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    
    }
    
    $('.number-cell').css('line-height', cellSideLength+'px');
    $('.number-cell').css('font-size', 0.6 * cellSideLength+'px')
    
}

function generateOneNumber() {
    if ( nospace(board) ) {
        return false;
    }

    //随机生成一个位置
    var randx = parseInt(Math.floor( Math.random() * 4 ));
    var randy = parseInt(Math.floor( Math.random() * 4 ));

    while ( true ) {
        if ( board[randx][randy] == 0 ) 
            break;
        
        randx = parseInt( Math.floor( Math.random() * 4 ) );
        randy = parseInt( Math.floor( Math.random() * 4 ) );
        
    }

    //随机生成一个2或4
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown( function( event ) {
    switch( event.keyCode ) {
        case 37: //moveLeft
            if ( moveLeft() ) {
                setTimeout( "generateOneNumber()", 200 )
                isgameover();
            };
            break;

        case 38: //moveUp
            if ( moveUp() ) {
                setTimeout( "generateOneNumber()", 200 );
                isgameover();
            };
            break;

        case 39: //moveRight
            if ( moveRight() ) {
                setTimeout( "generateOneNumber()", 200 );
                isgameover();
            };
            break;
        
        case 40: //moveDown
            if ( moveDown() ) {
                setTimeout( "generateOneNumber()", 200 );
                isgameover();
            };
            break;
        
        default: 
            break;
    }
} )

document.addEventListener('touchstart', function( event ) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend', function( event ) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltx = endx - startx;
    var delty = endy - starty;

    if( Math.abs( deltx ) < 0.1 * documentWidth && Math.abs( delty ) < 0.1 * documentWidth ) {
        return;
    }

    if( Math.abs( deltx ) >= Math.abs( delty ) ) {
        //x
        if( deltx > 0 ) {
            //right
            if ( moveRight() ) {
                setTimeout( "generateOneNumber()", 200 );
                isgameover();
            }
        }
        else {
            //left
            if ( moveLeft() ) {
                setTimeout( "generateOneNumber()", 200 )
                isgameover();
            }
        }
    }
    else {
        //y
        if( delty > 0 ) {
            //down
            if ( moveDown() ) {
                setTimeout( "generateOneNumber()", 200 );
                isgameover();
            }
        }
        else {
            //up
            if ( moveUp() ) {
                setTimeout( "generateOneNumber()", 200 );
                isgameover();
            }
        }
    }
});

function isgameover() {
    if( nospace( board ) && nomove( board ) ) {
        gameover();
    }
}

function gameover() {
    alert("GameOver!"); 
}

function moveLeft() {
    if ( !canMoveLeft( board ) ) {
        return false; 
    }
    else {
        for ( var i = 0; i < 4; i ++ ) {
            for ( var j = 1; j < 4; j ++ ) {
                if ( board[i][j] != 0 ) {
                    for ( var k = 0; k < j; k ++ ) {
                        if ( board[i][k] == 0 && noBlockHorizontal ( i, k, j, board ) ) {
                            // move
                            showMoveAnimation( i, j, i, k );
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if ( board[i][k] == board[i][j] && noBlockHorizontal ( i, k, j, board ) && !hasConflicted[i][k] ) {
                            //move
                            showMoveAnimation( i, j, i, k );
                            //add
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            //uodate-score
                            score += board[i][k];
                            updateScore( score );

                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout( "updateBoardView()", 200 );
    return true;
}

function moveRight() {
    if( !canMoveRight( board ) ) {
        return false;
    }
    else {
        for( var i = 0; i < 4; i ++ ) {
            for( var j = 2; j >= 0; j -- ) {
                if( board[i][j] != 0 ) {
                    for( var k = 3; k > j; k -- ) {
                        if( board[i][k] == 0 && noBlockHorizontal( i, j, k, board ) ) {
                            //move
                            showMoveAnimation( i, j, i, k );
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if( board[i][k] == board[i][j] && noBlockHorizontal( i, j, k, board ) && !hasConflicted[i][k] ){
                            //move
                            showMoveAnimation( i, j, i, k );
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            //uodate-score
                            score += board[i][k];
                            updateScore( score );

                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout( "updateBoardView()", 200 )
    return true; 
}

function moveUp() {
    if( !canMoveUp( board ) ) {
        return false;
    }
    else {
        for( var j = 0; j < 4; j ++ ) {
            for( var i = 1; i < 4; i ++ ) {
                if( board[i][j] != 0 ) {
                    for( var k = 0; k < i; k ++ ) {
                        if( board[k][j] == 0 && noBlockVertical( j, k, i, board ) ) {
                            //move
                            showMoveAnimation( i, j, k, j );
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if( board[k][j] == board[i][j] && noBlockVertical( j, k, i, board ) && !hasConflicted[k][j] ) {
                            //move
                            showMoveAnimation( i, j, k, j );
                            //add
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            //uodate-score
                            score += board[k][j];
                            updateScore( score );

                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout( "updateBoardView()", 200 );
    return true;
}

function moveDown() {
    if( !canMoveDown( board ) ) {
        return false;
    }
    else {
        for( var j = 0; j < 4; j ++ ) {
            for( var i = 2; i >= 0; i -- ) {
                if( board[i][j] != 0 ) {
                    for( var k = 3; k > i; k -- ) {
                        if( board[k][j] == 0 && noBlockVertical( j, i, k, board ) ) {
                            //move
                            showMoveAnimation( i, j, k, j );
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if( board[k][j] == board[i][j] && noBlockVertical( j, i, k, board ) && !hasConflicted[k][j] ) {
                            //move
                            showMoveAnimation( i, j, k, j );
                            //add
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            //uodate-score
                            score += board[k][j];
                            updateScore( score );

                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }

    }
    setTimeout( "updateBoardView()", 200 );
    return true;
}

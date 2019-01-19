$(document).ready(function(){

var snakeBody =[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]
var snakeHead = [0,5];
var speed = 100;
var direction = 'right';
var score = 0;
var sizex = 50;
var sizey = 30;
var keyPressTime = 0;
var lastKeyPressTime = 0;
var threshold = -80;
var validKeyCodes = {	37 : 'left', 38 : 'up',	39 : 'right',	40 : 'down',};

$("#welcomeScreen").click(function gameStartUP() {
	$("#welcomeScreen").hide("slow");
	$("#gameBoard").show("slow");
	$("#infoScore").show("slow");
	renderBoard();
	renderFruit();
	renderSnake();
	gameStart();

});

$( document ).bind('keydown', function( keypressed ) {
	newDirection( keypressed.keyCode );
});


function gameShutDown() {
	$("#welcomeScreen").show("slow");
	$("#gameBoard").hide("slow");
	$("#infoScore").hide("slow");
	$('#gameBoard').html('');
	$('#infoScore').html('');
	score = 0;
	speed = 100;
	snakeBody = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]], snakeHead = [0,5];
	direction = 'right';
	clearInterval(timer);
}
function gameStart() {
	timer = setInterval(animateSnake, speed);
}
function restart() {
	score = 0;
	speed = 100;
	snakeBody = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]], snakeHead = [0,5];
	direction = 'right';
	$( '#infoScore' ).html( 'Your Score : ' + score );
	renderSnake();
	renderFruit();
	clearInterval(timer);
	$( document ).bind('keydown', function( keypressed ) {
		newDirection( keypressed.keyCode );
	});
	gameStart();
}
function getFruit() {
			fruitCell = [(Math.floor(Math.random()*(sizey-1))+1),(Math.floor(Math.random()*sizex-1)+1)];
}
function renderFruit() {
	if (($('tr').eq( fruitCell[0] ).find('td').eq(fruitCell[1]).hasClass('snakeBody'))) {
		getFruit();
	}
	$( 'td' ).removeClass( 'fruitCell' );
	$('tr').eq( fruitCell[0] ).find('td').eq(fruitCell[1]).addClass( 'fruitCell' );
}
function renderSnake (){
			$('td').removeClass('snakeBody snakeHead');
			for (var coordinates in snakeBody ){
				$('tr').eq(snakeBody[coordinates][0]).find('td').eq(snakeBody[coordinates][1]).addClass('snakeBody');
			}
			$('tr').eq(snakeHead[0]).find('td').eq(snakeHead[1]).addClass('snakeHead');
		}
function renderBoard() {
			var textHtml = ''; /* So it is converted to text */
			for( var i = 0; i < sizex; i++ ) {
				textHtml = textHtml + '<td class="boardCell"> </td>';
			}
			html = [];
			for( var i = 0; i <= sizey; i++ ) {
				html.push( '<tr>'+ textHtml + '</tr>');
			}
			$("#gameBoard").append( '<table id="gridMovement">' + html.join( '\n' ) + '</table>' );
			getFruit();
		};
function newDirection(keyCode) {
	keyPressTime = new Date().getTime();
	if (lastKeyPressTime - keyPressTime  < threshold) {
		if( typeof validKeyCodes[keyCode] != 'undefined' ) {
			var newDirection = validKeyCodes[ keyCode ];
			var changeDirection = false;
			switch (direction) {
				case 'left':
				if (newDirection == 'right') {
					changeDirection = false;
					break;
				} else {
					changeDirection = true;
				}
				break;
				case 'right':
				if (newDirection == 'left') {
					changeDirection = false;
					break;
				} else {
					changeDirection = true;
				}
					break;
				case 'up':
				if (newDirection == 'down') {
					changeDirection = false;
					break;
				} else {
					changeDirection = true;
				}
					break;
				case 'down':
				if (newDirection == 'up') {
					changeDirection = false;
					break;
				} else {
					changeDirection = true;
				}
			}
			direction = changeDirection ? newDirection : direction;
		}
	}
		lastKeyPressTime = keyPressTime;
}
function animateSnake() {
	var snakeNewHead = [];
	var newCell = {length:0};
	switch(direction){
		case 'right':
		snakeNewHead = [ snakeHead[0], snakeHead[1]+1 ];
		break;
		case 'left':
		snakeNewHead = [ snakeHead[0], snakeHead[1]-1 ];
		break;
		case 'up':
		snakeNewHead = [ snakeHead[0]-1, snakeHead[1] ];
		break;
		case 'down':
		snakeNewHead = [ snakeHead[0]+1, snakeHead[1] ];
		break;
	}
	if( snakeNewHead[0] < 0 || snakeNewHead[1] < 0 ) {
		restart();
		return;
	} else if( snakeNewHead[0] >= sizex || snakeNewHead[1] >= sizex ) {
		restart();
		return;
	}
	var newCell = $('tr').eq( snakeNewHead[0] ).find('td').eq(snakeNewHead[1]);
	if( newCell.length == 0 ) {
		restart();
	} else {
		if ( newCell.hasClass('snakeBody')) {
			restart();
		} else {
			if( newCell.hasClass( 'fruitCell' ) ) {
				snakeBody.push( [] );
				getFruit();
				renderFruit();
				score += 100;
				$( '#infoScore' ).html( 'Your Score : ' + score );
				if(speed-10 > 5){
					speed = speed - 1;
				}else{
					speed = speed;
				}
				clearInterval(timer);
				gameStart();
			}
			for( var i = ( snakeBody.length - 1 ); i > 0 ; i-- ) {
				snakeBody[ i ] = snakeBody[ i - 1 ];
			}
			snakeBody[ 0 ] = snakeHead = snakeNewHead;
			renderSnake();
		}
	}
}
})

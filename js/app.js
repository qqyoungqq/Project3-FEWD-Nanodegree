//************************ Define some variables *********************************
var playerImages = ['images/char-boy.png','images/char-cat-girl.png',
                    'images/char-horn-girl.png','images/char-pink-girl.png',
                    'images/char-princess-girl.png'];
var playerInd;
var userSelections = false;
var renderFlag = false;
//*********************** Enemy Class *******************************************
var Enemy = function() {
    // The image for our enemies
    this.sprite = 'images/enemy-bug.png';

    // The possible y position of enemies
    this.yposPoss = [83,166,249]; 

    // The range of x position of enemies
    this.xposRange = [0,404];

    // The speed range of enemies
    this.speedRange = [100,400]; 

    // Set the enemy's initial position
    this.initialpos();
}

// Set the enemy's initial position
Enemy.prototype.initialpos = function() {
    var y = this.yposPoss;
    var s = this.speedRange;
    var len = y.length;
    this.y = y[Math.floor(Math.random() * len)];
    this.x = -100;
    this.speed = Math.floor(Math.random()*(s[1]-s[0]))+s[0];
}

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var xMax = 600;

	// Upldate the position by multiplying the speed by the dt parameter
    this.x = this.x + this.speed*dt;

    // reset the enemy's position whenever exeeding the maximum x position
    if (this.x > xMax) {
        this.initialpos();
    }

    if (this.x > -50 && this.x < 50) {
        this.tx=0;
    } else if (this.x > 50 && this.x < 150) {
        this.tx=101;
    } else if (this.x > 150 && this.x < 250) {
        this.tx=202;
    } else if (this.x > 250 && this.x < 350) {
        this.tx=303;
    } else if (this.x > 350 && this.x < 450) {
        this.tx=404;
    }

    //player is set to the initial position and 
    //life number decreases by one once the player collide any enemy
    if (player.x === this.tx && player.y === this.y) {
        player.initialpos();
        life.decrease();
    }

}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
//*********************** End Enemy Class *******************************************


//*********************** Player Class **********************************************
var Player = function() {
    // Set the player's initial position
    this.initialpos();
}

// Set the player's initial position
Player.prototype.initialpos = function() {
    this.x = 202;    
    this.y = 415;
}

// Update the player's position
Player.prototype.update = function() {
	if (this.inpkey === 'left' && this.x != 0) {
		this.x = this.x - 101;
	}
    if (this.inpkey === 'right' && this.x != 404) {
        this.x = this.x + 101;
    }
    if (this.inpkey === 'up' && this.y != 0) {
        this.y = this.y - 83;
    }
    if (this.inpkey === 'down' && this.y != 415) {
        this.y = this.y + 83;
    }
    this.inpkey = null;

    //player is set to the initial position once it's on water
    if (this.y < 83) {
        this.initialpos();
    }
}

// Handle the input from key presses
Player.prototype.handleInput = function(key) {
	this.inpkey = key;
}

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(playerImages[playerInd]), this.x, this.y);
}
//*********************** End Player Class **********************************************


//*********************** Gem Class *****************************************************
var Gem = function() {
    // The possible image of gems
    this.gemImg = ['images/Gem_Blue.png','images/Gem_Green.png','images/Gem_Orange.png'];

    // The range of x position of enemies
    this.xposPoss = [0,101,202,303,404];

    // The possible y position of gems
    this.yposPoss = [83,166,249]; 

    // Set the position and image of gem
    this.set();
}

// Set the image of gem and position of gem
Gem.prototype.set = function() {
    this.gimg = this.gemImg[Math.floor(Math.random() * 3)];
    this.x = this.xposPoss[Math.floor(Math.random() * 5)];    
    this.y = this.yposPoss[Math.floor(Math.random() * 3)];
}

// Update the image/position of gem when it is collected by the player
Gem.prototype.update = function() {
    if (this.x === player.x && this.y === player.y){
        this.set();
        score.increase();
    }
}

// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.gimg), this.x, this.y);
}
//*********************** End Gem Class *************************************************


//*********************** Life Class ****************************************************
var Life = function() {
    // The image of life
    this.limg = 'images/Heart.png';

    // The initial number of life 
    this.lifeNum = 5;
}

// Draw life on the screen and draw game over when no life left
Life.prototype.render = function() {
    var x = 0; 
    if (this.lifeNum > 0) {
        for (var i = 0; i < this.lifeNum; i++) {
            ctx.drawImage(Resources.get(this.limg), x, 570);  
            x=x+50;
        }
    } else {
        ctx.lineWith = 3;
        ctx.fillStyle = "black";
        ctx.fillRect(0,20,505,600);
        ctx.strokeRect(0,20,505,600);
        ctx.fillStyle = "white";
        ctx.lineWith = 3;
        ctx.textAlign = "center";
        ctx.font = "36pt Impact";
        ctx.fillText('Game Over', 250, 275);
        ctx.fillText("Total score: " + score.score, 250, 400);
    }
}

// decrease the number of life
Life.prototype.decrease = function() {
    this.lifeNum = this.lifeNum - 1;
}
//*********************** End Life Class ************************************************


//*********************** Score Class ***************************************************
var Score = function() {
    this.score = 0;
}

// increase the score
Score.prototype.increase = function() {
    this.score = this.score + 1;
}

// Draw score on the screen when game is not over
Score.prototype.render = function() {
    if (life.lifeNum > 0) {
        ctx.font = "24pt Impact";
        ctx.font = "24pt"
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score.score,350,620);
    }
}
//*********************** End Score Class ***********************************************

//*********************** Other helper functions ****************************************
//Select the player by click the image of player before game start
//Parameter: imgId, ID of image (defined in index.html)
//Parameter: imgInd, image Index (0-4 defined in index.html)
function playerSelector (imgId, imgInd) {
    playerInd = imgInd;
    userSelections=true;
    for (var i=0; i<5; i++) {
        document.getElementById("player"+i).style.border = 'solid white 2px';
    }
    document.getElementById(imgId).style.border = 'solid red 2px';
}

//Start the game when player selection is complete by clicking the start button 
function startSelector () {
    if (userSelections === true) {
        document.getElementById('selection').style.display = "none";
        renderFlag = true;
    } else {
        alert('Please select a player to start the game.');
    }
}

//*********************** Now instantiate the objects ***********************************
// Place all enemy objects in an array called allEnemies
var bug1 = new Enemy();
var bug2 = new Enemy();
var bug3 = new Enemy();
var allEnemies = [bug1,bug2,bug3];
// Place the player object in a variable called player
var player = new Player();
// Place the gem object in a variable called gem
var gem = new Gem();
// Place the life object in a variable called life
var life = new Life();
// Place the score object in a variable called score
var score = new Score();

// This listens for key presses and sends the keys to 
// Player.handleInput() method. 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This listens for key presses and presvents default scroll behavior
document.addEventListener('keydown', function(e) {
  if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }  
}, false);
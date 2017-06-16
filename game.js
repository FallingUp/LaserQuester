var game = new Phaser.Game(800, 600, Phaser.AUTO, 'lazerquester', {preload: preload, create: create, update: update, render: render});

var player;
var starfield;
var cursors;
var bank;
var shipTrail;
var bullets;
var fireButton;

var ACCELERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

function preload() {
    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('ship', 'assets/player.png');
    game.load.image('bullet', 'assets/bullet.png');
}

function create() {
    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
    // Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
    player.body.drag.setTo(DRAG, DRAG);
    
    // And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    // Add an emitter for the ship's trail
    shipTrail = game.add.emitter(player.x, player.y + 10, 400);
    shipTrail.width = 10;
    shipTrail.makeParticles('bullet');
    shipTrail.setXSpeed(30, -30);
    shipTrail.setYSpeed(200, 180);
    shipTrail.setRotation(50, -50);
    shipTrail.setAlpha(1, 0.01, 800);
    shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
    shipTrail.start(false, 5000, 10);
}

function update() {
    // Scroll the background
    starfield.tilePosition.y += 2;
    
    // Reset the player, then check for movement keys
    player.body.acceleration.x = 0;
    
    if (cursors.left.isDown) {
            player.body.acceleration.x = -ACCELERATION;
        }
    else if (cursors.right.isDown) {
            player.body.acceleration.x = ACCELERATION;
        }
    
    // Stop at screen edge
    if (player.x > game.width - 50) {
        player.x = game.width - 50;
        player.body.acceleration.x = 0;
    }
    if (player.x < 50) {
        player.x = 50;
        player.body.acceleration.x = 0;
    }
    
    // Fire bullet
    if (fireButton.isDown || game.input.activePointer.isDown) {
        firebullet();
    }
    
    // Move ship towards mouse pointer
    if (game.input.x < game.width - 20 &&
        game.input.x > 20 &&
        game.input.y > 20 &&
        game.input.y < game.height - 20) {
        var minDist = 200;
        var dist = game.input.x - player.x;
        player.body.velocity.x = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);
    }
    
function fireBullet() {
    // Grab the first bullet we can from the pool
    var bullet = bullets.getFirstExists(false);
    
    if (bullet) {
            // And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
        }
}
    
    // Squish and rotate ship for illusion of "banking"
    bank = player.body.velocity.x / MAXSPEED;
    player.scale.x = 1 - Math.abs(bank) / 2;
    player.angle = bank * 30;
    
    // Keep the shipTrail lined up with the ship
    shipTrail.x = player.x;
}

function render() {

}
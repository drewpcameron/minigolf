
const COURSE_WIDTH = 800;
const COURSE_HEIGHT = 1200;

// Welcome Screen Scene
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        this.button = this.add.rectangle(0, 0, 200, 0x007bff).setInteractive();
        this.button.on('pointerdown', () => alert('Clicked!'));

        this.scale.on('resize', this.handleResize, this);
        this.handleResize(this.scale.gameSize);
    }
    
    handleResize(gameSize) {
        const { width, height } = gameSize
        this.cameras.main.setViewport(0, 0, width, height);
        this.button.setPosition(width / 2, height / 2);
    }
}


const LEVELS = [
    { // Hole 1
        ballPos: { x: 200, y: 200},
        holePos: { x: 400, y: 100 },
        walls: [
            { x: 300, y: 300, w: 200, h: 20 },
            { x: 500, y: 300, w: 20, h: 200 }
        ]
    },
    { // Hole 2
        ballPos: { x: 200, y: 200},
        holePos: { x: 700, y: 300 },
        walls: [
            { x: 400, y: 0, w: 20, h: 400 },
            { x: 400, y: 600, w: 20, h: 400 }
        ]
    }
];

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.currentLevel = 0;
        this.ball = null;
        this.hole = null;
        this.barriers = null;
    }

    create() {
        this.cameras.main.setBackgroundColor('#57b954');

        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // Create the Ball once
        this.ball = this.add.circle(400, 500, 12, 0xffffff);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true).setBounce(0.5).setDamping(true).setDrag(0.98).setCircle(12);

        // Create the Hole and Barriers groups
        this.hole = this.add.circle(400,100,18,0x000000);
        this.physics.add.existing(this.hole, true);
        this.physics.add.overlap(this.ball, this.hold, this.handleHoleIn, null, this); 

        this.barriers = this.physics.add.staticGroup();

        // Colliders
        this.physics.add.collider(this.ball, this.barriers);
        this.physics.add.overlap(this.ball, this.hole, this.handleHoleIn, null, this);

        // Load the first hole
        this.loadLevel(this.currentLevel);

        // Input logic (Drag and Shoot)
        this.input.on('pointerup', (pointer) => {
            const velocityX = (pointer.upX - pointer.downX) * 2;
            const velocityY = (pointer.upY - pointer.downY) * 2;
            this.ball.body.setVelocity(velocityX, velocityY);

            this.cameras.main.startFollow(this.ball, true, 0.1, 0.1);
        });

        // Camera Pan Logic
        this.input.on('pointermove', (pointer) => {
            if (!pointer.isDown) return;

            const dragThreshhold = 10;
            if (pointer.getDistance() > dragThreshold) {
                this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x);
                this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y);
            }
        })
    }

    loadLevel(levelIndex) {
        const data = LEVELS[levelIndex];

        // 1. Reset Ball
        this.ball.setPosition(data.ballPos.x, data.ballPos.y);
        this.ball.body.setVelocity(0, 0);

        // 2. Position the Hole
        this.hole.setPosition(data.holePos.x, data.holePos.y);
        this.hole.body.updateFromGameObject();

        // 3. Clear old walls and build new ones
        this.barriers.clear(true, true);
        data.walls.forEach(w => {
            let wall = this.add.rectangle(w.x, w.y, w.w, w.h, 0x8b4513);
            this.barriers.add(wall);
        });
    }

    handleHoleIn() {
        this.currentLevel++;
        if (this.currentLevel < LEVELS.length) {
            this.loadLevel(this.currentLevel);
        } else {
            // End of game / Gender Reveal Logic!
            this.add.text(400, 300, 'GENDER REVEAL TIME!', { fontSize: '48px' }).setOrigin(0.5);
        }
    }
}

// Game Configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scene: [TitleScene, GameScene], 

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,  
        width: 800;
        height: 1200;
    },

    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    }
};

const game = new Phaser.Game(config);


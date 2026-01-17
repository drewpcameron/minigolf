//To Fix Tomorrow
//Fix level 7
//Make sure it works on a phone

// Welcome Screen Scene
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const { width, height } = this.scale;

        // 1. Create Space Background (Dark Gradient)
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x00050a, 0x00050a, 0x011627, 0x011627, 1);
        bg.fillRect(0, 0, width, height);

        // 2. Add a subtle Grid
        const grid = this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x00ffff, 0.05);
        grid.setOutlineStyle(0x00ffff, 0.1);

        // 3. Main Title Text
        const titleText = this.add.text(width / 2, height * 0.4, 'COSMIC PUTT', {
            fontSize: '72px',
            fontFamily: 'Arial Black',
            fill: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add a "Glow" effect to the title
        titleText.setShadow(0, 0, '#00ffff', 15, true, true);

        // 4. Subtitle Text
        this.add.text(width / 2, height * 0.48, 'A Mini-Golf Baby Reveal', {
            fontSize: '28px',
            fill: '#ff00ff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setShadow(0, 0, '#ff00ff', 10, true, true);

        // 5. Create Neon Launch Button
        const btnX = width / 2;
        const btnY = height * 0.75;
        
        // Button Glow (Graphic)
        const btnGlow = this.add.graphics();
        btnGlow.lineStyle(4, 0x00ff88, 0.5);
        btnGlow.strokeRoundedRect(btnX - 155, btnY - 45, 310, 90, 40);

        // Actual Interactive Button
        const btnShape = this.add.graphics();
        btnShape.lineStyle(4, 0x00ff88, 1);
        btnShape.strokeRoundedRect(btnX - 150, btnY - 40, 300, 80, 40);

        const btnText = this.add.text(btnX, btnY, 'LAUNCH GAME', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Make it interactive
        btnText.setInteractive({ useHandCursor: true });

        btnText.on('pointerup', () => {
            this.scene.start('GameScene');
        });

        // Hover effects
        btnText.on('pointerover', () => {
            btnShape.clear();
            btnShape.lineStyle(6, 0x00ff88, 1);
            btnShape.strokeRoundedRect(btnX - 150, btnY - 40, 300, 80, 40);
            btnText.setScale(1.1);
        });

        btnText.on('pointerout', () => {
            btnShape.clear();
            btnShape.lineStyle(4, 0x00ff88, 1);
            btnShape.strokeRoundedRect(btnX - 150, btnY - 40, 300, 80, 40);
            btnText.setScale(1);
        });

        // 6. Footer Text
        this.add.text(width / 2, height - 50, 'BY DREW & PARTNER', {
            fontSize: '16px',
            fill: '#ffffff',
            alpha: 0.6
        }).setOrigin(0.5);
    }
}
const LEVELS = [
    { ballPos: { x: 100, y: 1000 }, holePos: { x: 400, y: 150 }, walls: [{ x: 400, y: 600, w: 400, h: 20 }] }, // Hole 1: The Jump
    { ballPos: { x: 400, y: 1000 }, holePos: { x: 400, y: 100 }, walls: [{ x: 200, y: 500, w: 20, h: 600 }, { x: 600, y: 500, w: 20, h: 600 }] }, // Hole 2: The Hallway
    { ballPos: { x: 100, y: 1000 }, holePos: { x: 700, y: 100 }, walls: [{ x: 400, y: 400, w: 20, h: 800 }, { x: 400, y: 900, w: 500, h: 20 }] }, // Hole 3: Zig-Zag
    { ballPos: { x: 400, y: 1000 }, holePos: { x: 400, y: 200 }, walls: [{ x: 400, y: 500, w: 100, h: 100 }, { x: 200, y: 300, w: 200, h: 20 }, { x: 600, y: 300, w: 200, h: 20 }] }, // Hole 4: The Diamond
    { ballPos: { x: 700, y: 1000 }, holePos: { x: 100, y: 100 }, walls: [{ x: 0, y: 600, w: 1200, h: 20 }] }, // Hole 5: The Long Shot
    { ballPos: { x: 100, y: 1000 }, holePos: { x: 700, y: 200 }, walls: [{ x: 300, y: 300, w: 20, h: 400 }, { x: 500, y: 800, w: 20, h: 400 }] }, // Hole 6: Splitter
    { ballPos: { x: 400, y: 600 }, holePos: { x: 400, y: 100 }, walls: [{ x: 400, y: 400, w: 600, h: 20 }, { x: 100, y: 200, w: 20, h: 400 }, { x: 700, y: 200, w: 20, h: 400 }] }, // Hole 7: The Box
    { ballPos: { x: 100, y: 1000 }, holePos: { x: 700, y: 1100 }, walls: [{ x: 400, y: 1100, w: 20, h: 200 }, { x: 400, y: 600, w: 800, h: 20 }] }, // Hole 8: The U-Turn
    { ballPos: { x: 400, y: 1000 }, holePos: { x: 400, y: 100 }, walls: [] } // Hole 9: The Final Stretch
];

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.currentLevel = 0;
        this.aimLine = null;
        this.totalStrokes = 0;
    }

    create() {
        const { width, height } = this.scale;
        const MAX_PULL = 250;
        this.totalStrokes = 0;

        // Add this in create() after width/height are defined
        this.inputOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0);
        this.inputOverlay.setInteractive();

        // 1. Cosmic Background & Grid
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x00050a, 0x00050a, 0x011627, 0x011627, 1);
        bg.fillRect(0, 0, width, height);
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x00ffff, 0.05).setOutlineStyle(0x00ffff, 0.1);

        // 2. Physics & Bounds
        this.cameras.main.setBounds(0, 0, width, height);
        this.physics.world.setBounds(0, 0, width, height);

        // 3. The Ball (Neon White)
        this.ball = this.add.circle(0, 0, 12, 0xffffff);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true).setBounce(0.4).setDamping(true).setDrag(0.6).setCircle(12);

        // Add glow to ball
        const ballGlow = this.add.graphics();
        ballGlow.fillStyle(0xffffff, 0.3);
        ballGlow.fillCircle(0, 0, 18);
        this.ballGlow = ballGlow;

        // 4. The Hole (Black Hole effect)
        this.hole = this.add.circle(0, 0, 20, 0x000000);
        this.physics.add.existing(this.hole, true);
        this.hole.setStrokeStyle(4, 0x00ffff); // Neon rim

        // 5. Groups
        this.barriers = this.physics.add.staticGroup();
        this.physics.add.collider(this.ball, this.barriers);
        this.physics.add.overlap(this.ball, this.hole, this.handleHoleIn, null, this);

        // 6. Level UI
        this.levelText = this.add.text(20, 20, `HOLE: 1 / ${LEVELS.length}`, { fontSize: '24px', fill: '#00ffff', fontFamily: 'Arial Black' });
        // Add this in create() near your levelText
        this.scoreText = this.add.text(this.scale.width - 20, 20, `STROKES: 0`, { 
            fontSize: '24px', 
            fill: '#ff00ff', // Pink neon to contrast the cyan hole text
            fontStyle: 'bold' 
        }).setOrigin(1, 0);

            this.loadLevel(this.currentLevel);

        // 7. Controls (Slingshot Style)
        this.inputOverlay.on('pointerdown', (pointer) => {
            if (this.ball.body.speed < 5) {
                // Create an aiming line graphics object if it doesn't exist
                if (!this.aimLine) this.aimLine = this.add.graphics();
            }
        });


        this.inputOverlay.on('pointermove', (pointer) => {
            if (pointer.isDown && this.ball.body.speed < 5) {
                this.aimLine.clear();
                
                // 1. Calculate the raw distance and angle
                let diffX = pointer.downX - pointer.x;
                let diffY = pointer.downY - pointer.y;
                
                const distance = Math.sqrt(diffX * diffX + diffY * diffY);
                const angle = Math.atan2(diffY, diffX);

                // 2. Apply the Cap
                const cappedDistance = Math.min(distance, MAX_PULL);

                // 3. Calculate capped coordinates for the line
                const targetX = this.ball.x + Math.cos(angle) * cappedDistance;
                const targetY = this.ball.y + Math.sin(angle) * cappedDistance;

                // 4. Draw the Dotted Line using capped coordinates
                const tempLine = new Phaser.Geom.Line(this.ball.x, this.ball.y, targetX, targetY);
                const points = Phaser.Geom.Line.GetPoints(tempLine, 0, 15);

                this.aimLine.fillStyle(0x00ffff, 1);
                for (let i = 0; i < points.length; i++) {
                    this.aimLine.fillCircle(points[i].x, points[i].y, 2);
                }
            }
        });

        this.inputOverlay.on('pointerup', (pointer) => {
            if (this.aimLine) this.aimLine.clear(); 

            if (this.ball.body.speed < 5) {
                let diffX = pointer.downX - pointer.upX;
                let diffY = pointer.downY - pointer.upY;
                
                const distance = Math.sqrt(diffX * diffX + diffY * diffY);
                const angle = Math.atan2(diffY, diffX);
                const cappedDistance = Math.min(distance, MAX_PULL);

                const powerMultiplier = 8.0; 

                const velocityX = Math.cos(angle) * cappedDistance * powerMultiplier;
                const velocityY = Math.sin(angle) * cappedDistance * powerMultiplier;

                // 1. Increment strokes
                this.totalStrokes++;

                // 2. FIXED: Removed .text and changed ' ' to ` `
                this.scoreText.setText(`STROKES: ${this.totalStrokes}`);

                // 3. Set velocity
                this.ball.body.setVelocity(velocityX, velocityY);
            }
        });
    }

    update() {
        // Keep glow following the ball
        this.ballGlow.x = this.ball.x;
        this.ballGlow.y = this.ball.y;

        // Hard stop logic: if moving slower than 10px/sec, just stop it
        if (this.ball.body.speed > 0 && this.ball.body.speed < 15) {
            this.ball.body.setVelocity(0, 0);
        }
    }

    loadLevel(levelIndex) {
        const data = LEVELS[levelIndex];
        this.levelText.setText(`HOLE: ${levelIndex + 1} / ${LEVELS.length}`);

        this.ball.setPosition(data.ballPos.x, data.ballPos.y);
        this.ball.body.setVelocity(0, 0);

        this.hole.setPosition(data.holePos.x, data.holePos.y);
        this.hole.body.reset(data.holePos.x, data.holePos.y);

        this.barriers.clear(true, true);
        data.walls.forEach(w => {
            // Neon Purple Walls
            let wall = this.add.rectangle(w.x, w.y, w.w, w.h, 0xff00ff, 0.8);
            wall.setStrokeStyle(2, 0xffffff);
            this.barriers.add(wall);
        });
    }

    handleHoleIn() {
        this.currentLevel++;
        if (this.currentLevel < LEVELS.length) {
            this.loadLevel(this.currentLevel);
        } else {
            this.triggerReveal();
        }
    }

    triggerReveal() {
        this.ball.setVisible(false);
        this.ballGlow.setVisible(false);
        const { width, height } = this.scale;
        
        this.add.text(width / 2, height / 2 - 50, 'GENDER REVEAL!', { 
            fontSize: '64px', fill: '#00ffff', fontFamily: 'Arial Black' 
        }).setOrigin(0.5).setShadow(0, 0, '#00ffff', 10, true, true);

        // Change this color based on your reveal!
        const resultColor = '#ff00ff'; // Pink for Girl, #00ffff for Boy
        const resultText = 'IT\'S A GIRL!'; 

        this.add.text(width / 2, height / 2 + 50, resultText, { 
            fontSize: '82px', fill: resultColor, fontFamily: 'Arial Black' 
        }).setOrigin(0.5).setShadow(0, 0, resultColor, 20, true, true);
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
        width: 800,
        height: 1200
    },

    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    }
};

const game = new Phaser.Game(config);


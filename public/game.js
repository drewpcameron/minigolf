//To Fix Tomorrow
//Fix level 7
//Make sure it works on a phone


//Fix levels
//fix colision
//Reveal screen.

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
    }
}
const LEVELS = [
    { ballPos: { x: 100, y: 1000 }, holePos: { x: 400, y: 150 }, walls: [{ x: 400, y: 600, w: 400, h: 20 }] }, // Hole 1: The Jump
    
    // Hole 2: The Corridor - Forces a straight shot through a narrow vertical lane.
    { ballPos: { x: 400, y: 1000 }, holePos: { x: 400, y: 100 }, walls: [{ x: 340, y: 550, w: 20, h: 700 }, { x: 460, y: 550, w: 20, h: 700 }] }, 
    
    { ballPos: { x: 100, y: 1000 }, holePos: { x: 700, y: 100 }, walls: [{ x: 400, y: 400, w: 20, h: 800 }, { x: 400, y: 900, w: 500, h: 20 }] }, // Hole 3: Zig-Zag
    { ballPos: { x: 400, y: 1000 }, holePos: { x: 400, y: 200 }, walls: [{ x: 400, y: 500, w: 100, h: 100 }, { x: 200, y: 300, w: 200, h: 20 }, { x: 600, y: 300, w: 200, h: 20 }] }, // Hole 4: The Diamond
    { ballPos: { x: 700, y: 1000 }, holePos: { x: 100, y: 100 }, walls: [{ x: 0, y: 600, w: 1200, h: 20 }] }, // Hole 5: The Long Shot
    
    // Hole 6: The Slalom - Requires two precise diagonal shots to clear offset pillars.
    { ballPos: { x: 100, y: 1000 }, holePos: { x: 700, y: 200 }, walls: [{ x: 250, y: 700, w: 400, h: 20 }, { x: 550, y: 400, w: 400, h: 20 }] }, 
    
    // Hole 7: The Funnel - A wide entrance that narrows significantly near the hole. Move hole down to the bottom of the box
    { ballPos: { x: 400, y: 900 }, holePos: { x: 400, y: 400 }, walls: [{ x: 250, y: 300, w: 20, h: 400 }, { x: 550, y: 300, w: 20, h: 400 }, { x: 400, y: 500, w: 300, h: 20 }] }, 
    
    { ballPos: { x: 100, y: 1000 }, holePos: { x: 700, y: 1100 }, walls: [{ x: 400, y: 1100, w: 20, h: 200 }, { x: 400, y: 600, w: 800, h: 20 }] }, // Hole 8: The U-Turn
    
    // Hole 9: The Gauntlet - The final challenge. A central block with tiny gaps on the sides.
    { ballPos: { x: 400, y: 1000 }, holePos: { x: 400, y: 100 }, walls: [{ x: 400, y: 550, w: 650, h: 40 }] } 
];

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.currentLevel = 0;
        this.aimLine = null;
        this.totalStrokes = 0;
    }

    preload() {
        this.load.image('reveal-image', 'assets/baby_photo.jpg')
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
        const { width, height } = this.scale;

        // 1. Clean up the Game Screen
        this.ball.setVisible(false);
        this.ballGlow.setVisible(false);
        this.hole.setVisible(false);
        this.barriers.clear(true, true); // Removes all walls
        this.levelText.setVisible(false);
        this.scoreText.setVisible(false);

        // 2. Create a "Clean Slate" Background
        const cleanBG = this.add.graphics();
        cleanBG.fillGradientStyle(0x00050a, 0x00050a, 0x011627, 0x011627, 1);
        cleanBG.fillRect(0, 0, width, height);
        cleanBG.setDepth(10); // Bring to front

        // 3. Victory Heading
        const header = this.add.text(width / 2, height * 0.15, 'MISSION COMPLETE', { 
            fontSize: '42px', fill: '#ffffff', fontFamily: 'Arial Black' 
        }).setOrigin(0.5).setDepth(11);

        // 4. The Big Message (Cyan for Boy)
        const resultColor = '#00ffff'; 
        const resultText = "IT'S A BOY!"; 

        const revealText = this.add.text(width / 2, height * 0.25, resultText, { 
            fontSize: '90px', fill: resultColor, fontFamily: 'Arial Black' 
        }).setOrigin(0.5).setShadow(0, 0, resultColor, 20, true, true).setDepth(11);

        // 5. IMAGE PLACEHOLDER (Centered)
        const imageY = height * 0.55;
        const revealImage = this.add.image(width / 2, imageY, 'reveal-image').setDepth(11);
        
        if (!this.textures.exists('reveal-image')) {
            const box = this.add.graphics().setDepth(11);
            box.lineStyle(6, resultColor, 1);
            box.strokeRoundedRect(width / 2 - 200, imageY - 200, 400, 400, 20);
            
            this.add.text(width / 2, imageY, 'PLACE PHOTO HERE', { 
                fontSize: '24px', fill: '#ffffff', fontFamily: 'Arial' 
            }).setOrigin(0.5).setDepth(11);
        } else {
            // This scales your photo to fit nicely in the center
            revealImage.setDisplaySize(500, 500); 
        }

        // 6. Final Stats Footer
        this.add.text(width / 2, height * 0.85, `TOTAL STROKES: ${this.totalStrokes}`, { 
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial Black' 
        }).setOrigin(0.5).setDepth(11);

        // Optional: Add a simple "Play Again" button
        const restartBtn = this.add.text(width / 2, height * 0.92, 'RESTART', { 
            fontSize: '24px', fill: resultColor, backgroundColor: '#000000', padding: 10
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setDepth(11)
        .on('pointerup', () => window.location.reload());
    }
}

// Game Configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scene: [TitleScene, GameScene], 
    pixelArt: false,
    roundPixels: true,
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


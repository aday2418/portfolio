import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private tileSize: number = 32;      // Desert tiles are 32x32
  private mapWidth: number = 50;      // 50 tiles wide (about 1.5 screens)
  private mapHeight: number = 50;     // 50 tiles high (about 1.5 screens)
  private playerSpeed: number = 300;  // Player movement speed

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load assets
    this.load.spritesheet('player', 
      'https://labs.phaser.io/assets/sprites/character.png',
      { frameWidth: 32, frameHeight: 48 }
    );

    // Load desert tileset
    this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/tmw_desert_spacing.png');
  }

  create() {
    // Create a custom tilemap
    this.createCustomTilemap();
    
    // Get the map dimensions
    const mapWidthPixels = this.map.widthInPixels;
    const mapHeightPixels = this.map.heightInPixels;
    
    // Set world bounds to match the map size
    this.physics.world.setBounds(0, 0, mapWidthPixels, mapHeightPixels);
    
    // Create player in the center of the map
    this.player = this.physics.add.sprite(mapWidthPixels / 2, mapHeightPixels / 2, 'player');
    this.player.setCollideWorldBounds(true);

    // Setup camera to follow player
    this.cameras.main.setBounds(0, 0, mapWidthPixels, mapHeightPixels);
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setZoom(1);

    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add collision between player and ground
    this.physics.add.collider(this.player, this.groundLayer);
    
    // Add debug text to show movement instructions
    this.add.text(10, 10, 'Use arrow keys to move in all directions', {
      color: '#ffffff',
      fontSize: '16px',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);
    
    // Add debug text to show map dimensions
    this.add.text(10, 40, `Map size: ${mapWidthPixels}x${mapHeightPixels}`, {
      color: '#ffffff',
      fontSize: '16px',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);
  }

  private createCustomTilemap() {
    // Create a blank tilemap
    this.map = this.make.tilemap({
      tileWidth: this.tileSize,
      tileHeight: this.tileSize,
      width: this.mapWidth,
      height: this.mapHeight
    });
    
    // Add the tileset - the second parameter must match the key used in preload
    this.tileset = this.map.addTilesetImage('desert', 'tiles', 32, 32, 1, 1)!;
    
    // Create a blank layer
    this.groundLayer = this.map.createBlankLayer('Ground', this.tileset, 0, 0)!;
    
    // Fill the layer with tiles
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        // Skip the edges to create boundaries
        if (x === 0 || y === 0 || x === this.mapWidth - 1 || y === this.mapHeight - 1) {
          // Use wall tiles for boundaries (index 46 in desert tileset)
          this.groundLayer.putTileAt(46, x, y);
        } else {
          // Use sand tiles for the interior (index 29 in desert tileset)
          this.groundLayer.putTileAt(29, x, y);
        }
      }
    }
    
    // Set collision for boundary tiles
    this.groundLayer.setCollisionByProperty({ index: 46 });
  }

  update() {
    if (!this.player || !this.cursors) return;

    // Handle player movement
    let vx = 0;
    let vy = 0;

    // Horizontal movement
    if (this.cursors.left.isDown) {
      vx = -this.playerSpeed;
    } else if (this.cursors.right.isDown) {
      vx = this.playerSpeed;
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      vy = -this.playerSpeed;
    } else if (this.cursors.down.isDown) {
      vy = this.playerSpeed;
    }

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071; // 1/√2
      vy *= 0.7071;
    }

    // Apply velocity
    this.player.setVelocity(vx, vy);
  }
} 
 // ライブラリを読み込んで実行
enchant();

/*
 * 定数
 */

const SCREEN_WIDTH = 380;
const SCREEN_HEIGHT= 550;
const BUTTLE_AREA = 440;

// プレイヤー
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;
let PLAYER_SPEED = 5;

// 敵
const ENEMY_WIDTH = 32;
const ENEMY_HEIGHT = 32;
const ENEMY_SPEED = 0.5;
const ENEMY_CREATE_INTERVAL = 5;

/*
 * 銃弾
 */
const BULLET_WIDTH = 16;
const BULLET_HEIGHT = 16;
const BULLET_SPEED = 10;

/*
 * 敵の攻撃
 */
const FIRE_WIDTH = 16;
const FIRE_HEIGHT = 16;
const FIRE_SPEED = 10;

/*
 * 爆発
 */
const EXPLOSION_WIDTH = 16;
const EXPLOSION_HEIGHT = 16;

/*
 * ライフ
 */
const LIFE_WIDTH = 16;
const LIFE_HEIGHT = 16;

/*
 * BGM
 */
const BATTLE_BGM = 'bgm/Swordland.mp3';
const PLAYER_BULLET_BGM = 'bgm/player_bullet.mp3';
const GAMEOVER_BGM = 'bgm/failed.mp3';
const DAMAGE_BGM = 'bgm/damage.mp3';

/*
 * IMAGE
 */
const START_IMAGE = 'images/start.png';
const END_IMAGE = 'images/end.png';
const CLEAR_IMAGE = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/clear.png';
const MAP_IMAGE01 = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/map.png';
const BULLET_IMAGE = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/icon0.png';
const LIFE_IMAGE = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/icon0.png';
const PLAYER_IMAGE = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/player.png';
const ENEMY_IMAGE01 = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/enemy01.png';
const EXPLOSION_IMAGE = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/effect0.png';
const FIRE_IMAGE = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/icon0.png';
const PAD = 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/images/pad.png';

/*
 * 素材配列
 */
const ASSETS = [
	START_IMAGE,
	END_IMAGE,
	CLEAR_IMAGE,
	MAP_IMAGE01,
	BULLET_IMAGE,
	PLAYER_IMAGE,
	ENEMY_IMAGE01,
	FIRE_IMAGE,
	LIFE_IMAGE,
	PAD,
	BATTLE_BGM,
	EXPLOSION_IMAGE,
	PLAYER_BULLET_BGM,
	GAMEOVER_BGM,
	DAMAGE_BGM
];


let game = null;
let player = null;
let bulletList = null;
let enemyList = null;
let fireList = null;

// Array 拡張
Array.prototype.erase = function(elm) {
	let index = this.indexOf(elm);
	this.splice(index, 1);
	return this;
};

// ランダム値生成
let randfloat = (min, max) => {
	return Math.random() * (max-min) + min;
};

/*
 * コントローラー接続確認
 */
if(window.GamepadEvent){
	// ゲームパッドを接続すると実行されるイベント
	window.addEventListener("gamepadconnected",(e) => {
		console.log("接続されました。");
		console.log(e.gamepad);
	});
	// ゲームパッドの接続を解除すると実行されるイベント
	window.addEventListener("gamepaddisconnected",(e) => {
		console.log("接続が解除されました。");
		console.log(e.gamepad);
	});
}


const gamepad = navigator.getGamepads && navigator.getGamepads()[0];


/*
 * メイン処理
 */
window.onload = () => {


	/*
	 * 汎用処理
	 */
    enchant.Sound.enabledInMobileSafari = true;


    /*
     * ゲームオーバー処理
     */
	function GameOver() {
		(() => {
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/api.php',
				data: {
					score: game.score
				}
			}).done(data => {
				  console.log("Done!");
				  console.log(data);
			}).fail((XMLHttpRequest, textStatus, errorThrown) => {
				errorLog();
			});
			let pageMove = () => {
				location.href = 'http://yuyake0084.sakura.ne.jp/wp/?page_id=372';
			};
			setTimeout(pageMove, 5000);
		});
	}


	/*
	 * エラーログ表示
	 */
	function errorLog() {
		console.log("Fail!");
		console.log(XMLHttpRequest.status);
       	console.log(textStatus);
	}


	/*
	 * 裏技
	 */
	function KONAMI() {
		var GF60 = () => {
			game.fps = 60;
		}

		$(window).keyup( (e) => {
			let input = [];
			let konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
			input.push(e.keyCode);
			if (input.toString().indexOf(konami) >= 0) {
				PLAYER_SPEED = 15;
				game.fps = 10;
				console.log(game.fps);
				return;
 			}
		});
		setTimeout(GF60, 5000);
		console.log(game.fps);
	}


	let game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.preload(ASSETS);
	game.keybind(32, 'space');
	game.fps = 60;
	game.onload = () => {

		/*
		 * スコア表示
		 */
		game.score = 0;

		let scoreLabel = new Label();
		scoreLabel.font = "20px Tahoma";
		scoreLabel.color = "#fff";
		scoreLabel.x = 20;
		scoreLabel.y = 20;
		scoreLabel.text = "SCORE : " + game.score;

		/*
		 * ライフ表示
		 */
		let lifeMeter = new Group();
		lifeMeter.value = 3;
		lifeMeter.x = 250;
		lifeMeter.y = 20;

		let life = new Array(lifeMeter.value);
		for (let i = 0; i < lifeMeter.value; i++ ){
			life[i] = new Sprite(16,16);
			life[i].image = game.assets[LIFE_IMAGE];
			life[i].frame = 10;
			life[i].x = i * 16;
			lifeMeter.addChild(life[i]);
		}

		/*
		 * プレイヤークラス
		 */
		const Player = Class.create(Sprite, {
			initialize: function(x, y) {
				Sprite.call(this, PLAYER_WIDTH, PLAYER_HEIGHT);
				this.image = game.assets[PLAYER_IMAGE];
				this.x = x;
				this.y = y;
				this.frame = 1;
				this.on('enterframe', () => {
					let input = game.input;
					let [vx, vy] = [0, 0];

					pad.frame = 1;

					if (!gamepad) {
						if (input.left) {
							pad.frame = 1;
							pad.rotation = 270;
							this.x -= PLAYER_SPEED;
							this.frame = this.age % 3 + 9;
						}
						if (input.right) {
							pad.frame = 1;
							pad.rotation = 90;
							this.x += PLAYER_SPEED;
							this.frame = this.age % 3 + 18;
						}
						if (input.up) {
							pad.frame = 1;
							pad.rotation = 0;
							this.y -= PLAYER_SPEED;
							this.frame = this.age% 3 + 27;
						}
						if (input.down) {
							pad.frame = 1;
							pad.rotation = 180;
							this.y += PLAYER_SPEED;
							this.frame = this.age % 3;
						}
						if (pad.isTouched) {
							this.x += pad.vx * PLAYER_SPEED;
							this.y += padvy * PLAYER_SPEED;
						}
					} else {
						if (gamepad.axes[0] < -0.5) {
							pad.frame = 1;
							pad.rotation = 270;
							this.x -= PLAYER_SPEED;
							this.frame = this.age % 3 + 9;
						}
						if (gamepad.axes[0] > 0.5) {
							pad.frame = 1;
							pad.rotation = 90;
							this.x += PLAYER_SPEED;
							this.frame = this.age % 3 + 18;
						}
						if (gamepad.axes[1] < -0.5) {
							pad.frame = 1;
							pad.rotation = 0;
							this.y -= PLAYER_SPEED;
							this.frame = this.age % 3 + 27;
						}
						if (gamepad.axes[1] > 0.5) {
							pad.frame = 1;
							pad.rotation = 180;
							this.y += PLAYER_SPEED;
							this.frame = this.age % 3;
						}
					}
					// 斜めの移動補正
					if (vx !== 0 && vy !== 0) {
						let length = Math.sqrt(vx * vx + vy * vy);
						vx /= length;
						vy /= length;
						vx *= PLAYER_SPEED;
						vy *= PLAYER_SPEED;
					}
					// 画面からはみ出さないさないように制御
					let left = 0;
					let right = SCREEN_WIDTH - this.width;
					let top = 0;
					let bottom = BUTTLE_AREA - this.height;

					if (this.x < left) this.x = left;
					else if (this.x > right) this.x = right;
					if (this.y < top) this.y = top;
					else if (this.y > bottom) this.y = bottom;
				});
			}
		});

		/*
		 * 敵クラス
		 */
		const Enemy = Class.create(Sprite, {
			initialize: function(x, y)  {
				Sprite.call(this,ENEMY_WIDTH, ENEMY_HEIGHT);
				this.image = game.assets[ENEMY_IMAGE01];
				this.destroy = false;
				this.x = x;
				this.y = y;
				this.frame = 4;
				this.time = 0 ;
				this.on('enterframe', function() {
					this.x -= Math.sin(this.age * 0.1);
					this.y += ENEMY_SPEED;
					this.frame = this.age % 3 + 3;

					// 削除処理
					if (this.destroy === true) {
						this.parentNode.removeChild(this);
						enemyList.erase(this);
					}
					if (this.time++ % 5 == 0) {
						let s = new Fire(this.x, this.y);
					}
					if (this.y > BUTTLE_AREA) {
						game.assets[BATTLE_BGM].stop();
						game.assets[GAMEOVER_BGM].play();
						game.end();

						if (game.end) {
							let resultText = new Label('自エリアに侵入されて<br />なんか死にました。<br /><br />5秒後にランキング表に移動します。');
							resultText.moveTo(resultText.width - SCREEN_WIDTH / 2, 360);
							resultText.color = '#fff';
							resultText.font = '16px monospace';
							game.rootScene.addChild(resultText);
							GameOver();
						}
					}

					// 画面からはみ出さないさないように制御
					let left = 0;
					let right = SCREEN_WIDTH - this.width;
					let top = 0;
					let bottom = SCREEN_HEIGHT - this.height;

					if (this.x < left) this.x = left;
					else if (this.x > right) this.x = right;
					if (this.y < top) this.y = top;
				});

				// 敵の弾を生成
				if (game.frame % 1 < 20 && game.frame % 15 == 0) {
					let fire = new Fire();
					fire.moveTo(this.x - ENEMY_WIDTH / 2 - FIRE_WIDTH / 2, this.y - 20);
					fireList.push(fire);
					game.rootScene.addChild(fire);
				}
			},
		});

		/*
		 * 銃弾クラス
		 */
		const Bullet = Class.create(Sprite, {
			// 初期化処理
			initialize: function() {
				Sprite.call(this, BULLET_WIDTH, BULLET_HEIGHT);
				this.image = game.assets[BULLET_IMAGE];
				this.frame = 48;
				this.destroy = false;
				this.on('enterframe', () => {
					this.y -= BULLET_SPEED;

					// 削除処理
					if (this.y < -20 || this.destroy === true) {
						this.parentNode.removeChild(this);
						bulletList.erase(this);
					}
				});
			},
		});

		/*
		 * 攻撃ボタン
		 */
		const attackBtn = {
			normal : {
                color : '#fff',
                background: { type: 'linear-gradient', start: '#666', end: '#200c37' },
                border: { color: '#f99', width: 1, type: 'solid' },
                textShadow: { offsetX: 0, offsetY: 0, blur: '0', color: '#F00' },
                boxShadow: { offsetX: 2, offsetY: 2, blur: '5px', color: 'rgba(0, 0, 0, 0)' }
            },
            active : { //　ボタンを押したときのボタンの設定
                color : '#fff',
                background: { type: 'linear-gradient', start: '#666', end: '#200c37' },
                border: { color: '#fbb', width: 1, type: 'solid' },
                textShadow: { offsetX: 0, offsetY: 0, blur: '0', color: '#F00' },
                boxShadow: { offsetX: 2, offsetY: 2, blur: '0', color: 'rgba(0, 0, 0, 0.3)' }
            }
		};
		const AttackBtn = new Button('A', attackBtn, 50, 80);
		AttackBtn.x = 220;
		AttackBtn.y = 440;
		AttackBtn.font = '25px Ariar';
		AttackBtn.on('touchstart', () => {
			let bullet = new Bullet();
			bullet.moveTo(player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, player.y - 10);
			bulletList.push(bullet);
			game.assets[PLAYER_BULLET_BGM].clone().play();
			game.rootScene.addChild(bullet);
		});
		game.rootScene.addChild(AttackBtn);

		/*
		* 敵の弾クラス
		*/
		const Fire = Class.create(Sprite, {
			// 初期化処理
			initialize: function() {
				Sprite.call(this, FIRE_WIDTH, FIRE_HEIGHT);
				this.image = game.assets[FIRE_IMAGE];
				this.frame = 60;
				this.destroy = false;
				this.on('enterframe', () => {
					this.y += FIRE_SPEED;

					if(this.y < -20 || this.destroy === true) {
						this.parentNode.removeChild(this);
						fireList.erase(this);
					}

					// 敵の弾がプレイヤーに当たった時の処理
					if (player.intersect(this, 8)) {

						lifeMeter.removeChild(life[lifeMeter.value]);
						lifeMeter.value --;
						lifeMeter.parentNode.removeChild(this);

						if (lifeMeter.value === 0) {
							game.assets[BATTLE_BGM].stop();
							game.assets[GAMEOVER_BGM].play();
							game.end();

							if (game.end) {
								let resultText = new Label("撃たれて死にました。<br /><br />5秒後にランキング登録をします。");
								resultText.moveTo(resultText.width - SCREEN_WIDTH / 2, 360);
								resultText.color = '#fff';
								resultText.font = '16px monospace';
								game.rootScene.addChild(resultText);
								GameOver();
							}
						}
					}
				});
			}
		});

		/*
		* 爆発クラス
		*/
		const Explosion = Class.create(Sprite, {
			initialize: function() {
				Sprite.call(this, EXPLOSION_WIDTH, EXPLOSION_HEIGHT);
				this.image = game.assets[EXPLOSION_IMAGE];
				this.frame = 0;
				this.scale(2);
				this.on('enterframe', () => {
					this.frame += 1;

					if (this.frame > 4) {
						this.parentNode.removeChild(this);
					}
				});
			}
		});

		// MAP生成
		var map = new Map(16, 16);
		map.image = game.assets[MAP_IMAGE01];
		var baseMap = [
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 161, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 168, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 161, 161, 162, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
			[80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 168, 168, 168, 161, 161, 161, 80, 80, 80, 80, 80, 80, 80],
		];
		map.loadData(baseMap);
		game.rootScene.addChild(map);

		// 建造物
		var map = new Map(16, 16);
		map.image = game.assets[MAP_IMAGE01];
		var baseMap = [
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 60, 61, 256, 256, 256, 256, 256, 256, 60, 61, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 76, 77, 256, 256, 256, 256, 256, 256, 76, 77, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 60, 61, 256, 256, 256, 256, 256, 256, 60, 61, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 76, 77, 256, 256, 256, 256, 256, 256, 76, 77, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 60, 61, 256, 256, 256, 256, 256, 256, 60, 61, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 76, 77, 256, 256, 256, 256, 256, 256, 76, 77, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 60, 61, 256, 256, 256, 256, 256, 256, 60, 61, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 76, 77, 256, 256, 256, 256, 256, 256, 76, 77, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 60, 61, 256, 256, 256, 256, 256, 256, 60, 61, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 76, 77, 256, 256, 256, 256, 256, 256, 76, 77, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 60, 61, 256, 256, 256, 256, 256, 256, 60, 61, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 76, 77, 256, 256, 256, 256, 256, 256, 76, 77, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 60, 61, 256, 256, 256, 256, 256, 256, 60, 61, 256],
			[256, 256, 256, 256, 256, 256, 256, 256, 256, 76, 77, 256, 256, 256, 256, 256, 256, 76, 77, 256],

		];
		map.loadData(baseMap);

		// 障害物判定
		var colMap = [
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0],
			[  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0],
			[  0,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
			[  0,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
		];
		map.collisionData = colMap;
		if (map.hitTest(0,0) === true) {
			console.log("DEATH");
		}
		game.rootScene.addChild(map);


		/*
		* プレイヤーを生成
		*/
		let player = new Player(SCREEN_WIDTH / 2, 400);
		game.rootScene.addChild(player);


		/*
		* 敵リスト
		*/
		enemyList = [];


		/*
		* 敵の攻撃リスト
		*/
		fireList = [];


		/*
		* パッド生成
		*/
		let pad = new Pad();
		pad.x = 30;
		pad.y = 420;
		game.rootScene.addChild(pad);


		/*
		* 銃弾リスト
		*/
		bulletList = [];

		/* ------------------------------------------------------------
		* シーン切り替え
		* ------------------------------------------------------------*/
		game.rootScene.on('enterframe', () => {
			game.assets[BATTLE_BGM].play();
			game.rootScene.addChild(lifeMeter);
			game.rootScene.addChild(scoreLabel);

			KONAMI();

 	 		/*
	  		 * 弾を生成、表示
	 　　　   */
			function bulletFire() {
				const bullet = new Bullet();
				bullet.moveTo(player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, player.y - 20);
				bulletList.push(bullet);
				game.assets[PLAYER_BULLET_BGM].clone().play();
				game.rootScene.addChild(bullet);
			}

			let gamepad = navigator.getGamepads && navigator.getGamepads()[0];

			if (gamepad) {
				if (gamepad.buttons[1].pressed) {
					bulletFire();
				};
			}
			if (game.input.space) {
				bulletFire();
			};

			/*
			 * 敵を生成
			 */
			if (game.frame % ENEMY_CREATE_INTERVAL == 0) {
				let enemy = new Enemy(rand(SCREEN_WIDTH), rand(0));
				let x = randfloat(0, SCREEN_WIDTH-ENEMY_WIDTH);
				let y = -20;
				enemy.moveTo(x, y);
				enemyList.push(enemy);
				game.rootScene.addChild(enemy);
			}

			// プレイヤーと敵の衝突判定
			for (let i = 0,len = enemyList.length; i < len; i++) {
				let enemy = enemyList[i];
				if (enemy.intersect(player)) {
					lifeMeter.removeChild(life[lifeMeter.value]);
					lifeMeter.value --;
					enemy.destroy = true;

					if (lifeMeter.value === 0) {
						game.rootScene.onenterframe = null;
						game.assets[BATTLE_BGM].stop();
						game.assets[GAMEOVER_BGM].play();
						game.end();

						if (game.end) {
							let resultText = new Label("タックルされて死にました。<br /><br />5秒後に自動更新されます。");
							resultText.moveTo(resultText.width - SCREEN_WIDTH / 2, 360);
							resultText.color = '#fff';
							resultText.font = '16px monospace';
							game.rootScene.addChild(resultText);
							GameOver();
						}
					}
				}
			}

			// 弾と敵の衝突判定　　
			for (let i = 0,len = enemyList.length; i < len; i++) {
				let enemy = enemyList[i];
				for (let j = 0,len2 = bulletList.length; j < len2; j++) {
					let bullet = bulletList[j];

					if (bullet.intersect(enemy) === true) {
						// 爆発生成
						let explosion = new Explosion();
						explosion.moveTo(enemy.x, enemy.y);
						game.rootScene.addChild(explosion);

						game.assets[DAMAGE_BGM].play();
						bullet.destroy = true;
						enemy.destroy = true;

						if (enemy.destroy = true) {
							game.score += 100;
							scoreLabel.text = "SCORE : " + game.score;
						}
						break;
					}
				}
			}
		});
	};
	game.start();
};

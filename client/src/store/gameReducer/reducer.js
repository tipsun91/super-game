/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
import { v4 as uuidv4 } from 'uuid';
import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    player: {
      x: 0, // горизонталь
      y: 0, // вертикаль
      w: 30, // высота
      h: 30, // ширина
      speed: 3, // скорость передвижения
      hp: 100, // здоровье
      weapon: ['trunk'],
      ammunition: [{ // боезапас
        trunk: 0,
      }],
    },
    enemies: [{
      id: 1,
      w: 30, // высота
      h: 30, // ширина
      x: 600, // горизонталь
      y: 30, // вертикаль
      hp: 100, // здоровье
      damage: 5, // урон
      coolDown: 30, // скорость удара
    }, {
      id: 2,
      w: 30, // высота
      h: 30, // ширина
      x: 600, // горизонталь
      y: 80, // вертикаль
      hp: 100, // здоровье
      damage: 5, // урон
      coolDown: 30,
    }, {
      id: 3,
      w: 30, // высота
      h: 30, // ширина
      x: 400, // горизонталь
      y: 150, // вертикаль
      hp: 100, // здоровье
      damage: 5, // урон
      coolDown: 30,
    }],
    weapon: {
      name: 'trunk', // название
      damage: 20, // урон
      clip: 30, // обойма
      rateOfFire: 0.5, // скорострельность
      recharge: 1500, // время перезарядки
    },
    bullets: [],
    gameLoop: 0,
    calcEnemiesFlag: false,
    calcEnemiesFlag1: false,
  },
  reducers: {
    updateFrame(state, action) {
      function upGameLoop() {
        state.gameLoop += 1;
      }
      function calcPlayer() {
        if (action.payload.player.includes('ArrowRight')) {
          state.player.x += state.player.speed; // идем вправо
        }
        if (action.payload.player.includes('ArrowLeft')) {
          state.player.x -= state.player.speed; // идем влево
        }
        if (action.payload.player.includes('ArrowUp')) {
          state.player.y -= state.player.speed; // идем вверх
        }
        if (action.payload.player.includes('ArrowDown')) {
          state.player.y += state.player.speed; // идем вниз
        }
        if (action.payload.player.includes(' ')) {
          state.bullets.push({
            id: uuidv4(),
            x: state.player.x,
            y: state.player.y - state.player.h / 2,
            speed: 50,
            damage: state.weapon.damage,
          });
        }
        if (action.payload.player.includes('enemy')) {
          state.enemies.push({
            id: uuidv4(),
            x: Math.floor(Math.random() * (1400 - 1200)) + 1200, // горизонталь
            y: Math.floor(Math.random() * (300 - 100)) + 50, // вертикаль
            w: 30, // высота
            h: 30, // ширина
            hp: 100, // здоровье
            damage: 5, // урон
            coolDown: 30, // скорость удара
          });
        }
      }
      function calcBullets() {
        state.bullets.forEach((el) => {
          el.x += el.speed;
          if (el.x >= (state.player.x + 900)) {
            state.bullets.splice(el.id, 1);
          }
        });
      }
      function calcEnemies(arr, hero) {
        function randomFlag() {
          const arrFlag = [true, false];
          const flag = Math.floor(Math.random() * arrFlag.length);
          return arrFlag[flag];
        }
        arr.forEach((el) => {
          // if (hero.x <= el.x) {
          // let q = false;
          //   const time = 400;
          //   const distances = el.x - hero.x;
          //   const wave = 10;
          //   const waveAmount = distances / wave;
          //   const timeLoop = state.gameLoop;
          //   el.x -= 1;
          function randomNumLoop() {
            const arrr = [70, 110, 150];
            const flag = Math.floor(Math.random() * arrr.length);
            return arrr[flag];
          }
          function randomCord(heroXY) {
            const arrCord = [
              [heroXY.x, heroXY.y - heroXY.w * 2],
              [heroXY.x + heroXY.w, heroXY.y - heroXY.w],
              [heroXY.x, heroXY.y],
              [heroXY.x - heroXY.h, heroXY.y - heroXY.w]];
            const cord = Math.floor(Math.random() * arrCord.length);
            return arrCord[cord];
          }
          if ((hero.x - el.x) < -50) {
            if (state.gameLoop % randomNumLoop() === 0) {
              state.calcEnemiesFlag = !state.calcEnemiesFlag;
            }
            if (state.calcEnemiesFlag) {
              if (state.calcEnemiesFlag1) {
                el.y += 0.95;
                if (randomFlag()) {
                  state.calcEnemiesFlag1 = !state.calcEnemiesFlag1;
                }
              } else {
                el.y -= 0.95;
                if (randomFlag()) {
                  state.calcEnemiesFlag1 = !state.calcEnemiesFlag1;
                }
              }
            } else {
              if (hero.y > el.y) {
                el.y += 0.35;
              }
              if (hero.y < el.y) {
                el.y -= 0.35;
              }
            }
            if (hero.x >= el.x) {
              el.x += 1;
            }
            if (hero.x <= el.x) {
              el.x -= 1;
            }
          } else {
            const cord = randomCord(state.player);
            if (cord[0] >= el.x) {
              el.x += 0.7;
            }
            if (cord[0] <= el.x) {
              el.x -= 0.7;
            }
            if (cord[1] > el.y) {
              el.y += 0.7;
            }
            if (cord[1] < el.y) {
              el.y -= 0.7;
            }
          }
          // if (hero.y > el.y) {
          //   el.y += 0.35;
          // }
          // if (hero.y < el.y) {
          //   el.y -= 0.35;
          // }
        });
      }

      function calcCollisionsEnemie(arr, hero) {
        function randomDamage(arrX) {
          const num = Math.floor(Math.random() * arrX.length);
          return arrX[num];
        }
        arr.forEach((enemie) => {
          if ((hero.x + hero.w / 2 >= enemie.x - enemie.w / 2)
            && (hero.x - hero.w / 2 <= enemie.x + enemie.w / 2)
            && (hero.y - hero.h <= enemie.y + enemie.h)
            && (hero.y >= enemie.y)) {
            // hero.hp -= randomDamage([0, 0, 0, 0, enemie.damage, 0, 0, 0, 0]);
            if (state.gameLoop % enemie.coolDown === 0) {
              hero.hp -= enemie.damage;
            }
          }
        });
      }
      function calcCollisionBullets() {
        state.bullets.forEach((bullet) => {
          state.enemies.forEach((enemy) => {
            if (enemy.x > state.player.x) {
              if (bullet.x >= enemy.x
                && bullet.y >= enemy.y
                && bullet.y <= (enemy.y + state.player.w)) {
                enemy.hp -= bullet.damage;
                console.log(enemy.hp);
                state.bullets.splice(state.enemies.findIndex((el) => el.id === bullet.id), 1);
                if (enemy.hp <= 0) {
                  state.enemies.splice(state.enemies.findIndex((el) => el.id === enemy.id), 1);
                }
              }
            }
          });
        });
      }
      upGameLoop();
      calcEnemies(state.enemies, state.player);
      calcPlayer();
      calcBullets();
      calcCollisionsEnemie(state.enemies, state.player);
      calcCollisionBullets();
    },
  },
  extraReducers: {},
});

export const { updateFrame } = gameSlice.actions;

export default gameSlice.reducer;

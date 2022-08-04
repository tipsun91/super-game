/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../Hero/Hero';
import GameBar from '../GameBar/GameBar';
import Bullet from '../Bullet/Bullet';
import Enemy from '../Enemy/Enemy';
import GoldCoin from '../GoldCoin/GoldCoin';
import './App.css';
import {
  getPlayer,
  display,
  updateFrame,
  sendStatistic,
  updateWaves,
  updateEnemies,
  updateBackgroundWaves2,
  updateBackgroundWaves3,
  updatePositionPlayer,
  deleteAllEnemies,
  deleteAllGolds,
} from '../../store/gameReducer/reducer';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useRef();
  const {
    enemies,
    bullets,
    player,
    game,
    backgroundPositionLeft,
    golds,
    gamePlay,
  } = useSelector((state) => state.game);
  const [passageWaves, setPassageWaves] = useState(1);
  const [countWaves, setCountWaves] = useState(1);
  const [playGame, setPlayGame] = useState('play');
  const [arrowRight, setArrowRight] = useState(false);
  const [arrowLeft, setArrowLeft] = useState(false);
  const [arrowUp, setArrowUp] = useState(false);
  const [arrowDown, setArrowDown] = useState(false);
  const [bullet, setBullet] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeBullet, seTimeBullet] = useState(Date.now());
  const [timeEnemy, setTimeEnemy] = useState(Date.now());
  const [shoot, setShoot] = useState(false);
  const [cordMouse, setCordMouse] = useState();

  useEffect(() => {
    const mouseClickDown = (event) => {
      setShoot(true);
      setCordMouse([event.clientX - 36, event.clientY - 35]);
    };
    const mouseClickUp = (event) => {
      setShoot(false);
    };

    const funtion1 = (event) => {
      if (event.key === 'd') {
        setArrowRight(true);
      }
      if (event.key === 'a') {
        setArrowLeft(true);
      }
      if (event.key === 'w') {
        setArrowUp(true);
      }
      if (event.key === 's') {
        setArrowDown(true);
      }
      if (event.key === ' ') {
        setBullet(true);
      }
    };

    const function2 = (event) => {
      if (event.key === 'd') {
        setArrowRight(false);
      }
      if (event.key === 'a') {
        setArrowLeft(false);
      }
      if (event.key === 'w') {
        setArrowUp(false);
      }
      if (event.key === 's') {
        setArrowDown(false);
      }
      if (event.key === ' ') {
        setBullet(false);
      }
    };

    document.addEventListener('mousedown', mouseClickDown);
    document.addEventListener('mouseup', mouseClickUp);

    dispatch(getPlayer());

    dispatch(
      display({
        width: app.current.offsetWidth,
        height: app.current.offsetHeight,
      }),
    );

    document.addEventListener('keydown', funtion1);
    document.addEventListener('keyup', function2);

    return () => {
      document.removeEventListener('mousedown', mouseClickDown);
      document.removeEventListener('mouseup', mouseClickUp);
      document.removeEventListener('keydown', funtion1);
      document.removeEventListener('keyup', function2);
    };
  }, []);

  const [timeoutFlag, setTimeoutFlag] = useState(false);
  useEffect(() => {
    const pressedButtons = [];
    const mouseCord = [];

    if (shoot) {
      if (Date.now() - timeBullet > 300) {
        mouseCord.push(cordMouse[0], cordMouse[1]);
        seTimeBullet(Date.now);
      }
    }

    if (arrowRight && playGame === 'play') {
      pressedButtons.push('d');
    }
    if (arrowLeft && playGame === 'play') {
      pressedButtons.push('a');
    }
    if (arrowUp && playGame === 'play') {
      pressedButtons.push('w');
    }
    if (arrowDown && playGame === 'play') {
      pressedButtons.push('s');
    }
    if (!arrowRight && !arrowLeft && !arrowUp && !arrowDown) {
      pressedButtons.push('stop');
    }
    // логика скорострельности
    if (bullet && playGame === 'play') {
      if (Date.now() - timeBullet > 30) {
        pressedButtons.push(' ');
        seTimeBullet(Date.now);
      }
    }
    // логика появления врагов
    if (Date.now() - timeEnemy > 600 && playGame === 'play') {
      pressedButtons.push('enemy');
      setTimeEnemy(Date.now());
    }

    // логика завершения игры
    if (player.hp <= 0) {
      setPlayGame('game-over');
    }
    // логика смены волн врагов
    if (playGame === 'play') {
      if (game.countEnemies === gamePlay.waves1 && passageWaves === 1 && player.x > 1050) {
      // if (game.countEnemies === 2 && passageWaves === 1) {
        // меняем стейт для ожидание смены локации
        setPlayGame('waiting');
        // увеличеваем волну
        dispatch(updateWaves());
        // увеличиваем характеристики врагов
        dispatch(updateEnemies());
        // стейт чтобы предотвартить заход в этот if каждыем 20 млск
        setPassageWaves(2);
      }

      if (game.countEnemies === gamePlay.waves2 + gamePlay.waves1
        && passageWaves === 2 && player.x > 1050) {
        // if (game.countEnemies === 4 && passageWaves === 2) {

        // меняем стейт для ожидание смены локации
        setPlayGame('waiting');
        // увеличеваем волну
        dispatch(updateWaves());
        // увеличиваем характеристики врагов
        dispatch(updateEnemies());
        // стейт чтобы предотвартить заход в этот if каждыем 20 млск
        setPassageWaves(3);
      }
      // логика выгрыша
      if (game.countEnemies === gamePlay.waves2 + gamePlay.waves1
        + gamePlay.waves3 + gamePlay.boss) {
        setPlayGame('vin');
      }
    }
    // главный диспатчэ
    dispatch(updateFrame({ player: pressedButtons, mouseCord }));

    // логика для смены локации при прохождении первой волны
    if (playGame === 'waiting' && game.countWaves === 2) {
      // dispatch(deleteAllEnemies());
      dispatch(deleteAllGolds());
      // переходт на вторую локацию
      dispatch(updateBackgroundWaves2());
      // меняем позицию героя для прохождения в ворота
      dispatch(updatePositionPlayer());
      // когда анимация смены локации закончилась меням стейт снова на 'play'
      if (backgroundPositionLeft === -2600) {
        setPlayGame('play');
      }
    }
    // логика для смены локации при прохождении первой волны
    if (playGame === 'waiting' && game.countWaves === 3) {
      // dispatch(deleteAllEnemies());
      dispatch(deleteAllGolds());
      // переходт на третью локацию
      dispatch(updateBackgroundWaves3());
      // меняем позицию героя для прохождения в ворота
      dispatch(updatePositionPlayer());
      // когда анимация смены локации закончилась меням стейт снова на 'play'
      if (backgroundPositionLeft === -5600) {
        setPlayGame('play');
      }
    }
    // перерендриваем компонет каждые 20 млск при смене локации
    if (playGame === 'waiting') {
      setTimeout(() => {
        setTimeoutFlag((prev) => !prev);
      }, 20);
    }

    // перерендриваем компонет каждые 20 млск чтобы играть
    if (playGame === 'play') {
      setTimeout(() => {
        setTimeoutFlag((prev) => !prev);
      }, 20);
    }
  }, [timeoutFlag]);

  useEffect(() => {
    // логика завершения игры
    if (playGame === 'game-over' || playGame === 'vin') {
      // записываем время проведенное в игре
      const time = (+Date.now() - +startTime) / 1000;
      // диспатч для сбора статистики за игру
      dispatch(
        sendStatistic({
          countEnemies: game.countEnemies,
          countMoney: game.countMoney,
          countDamage: game.countDamage,
          countWaves,
          timeGame: time,
        }),
      );
    }
  }, [playGame]);

  return (
    <div
      style={{ backgroundPosition: backgroundPositionLeft }}
      className="app-back"
    >
      <div ref={app} className="App">
        {playGame === 'play' && (
          <div>
            <GameBar />
            <Hero />
            {bullets && bullets.map((el) => <Bullet key={el.id} bullet={el} />)}
            {enemies && enemies.map((el) => <Enemy key={el.id} enemy={el} />)}
            {golds && golds.map((el) => <GoldCoin key={el.id} coin={el} />)}
          </div>
        )}
        {playGame === 'game-over' && (
          <div className="gameOver">
            <h1>GAME OVER</h1>
            <Link className="nes-btn is-primary" to="/game">
              Играть еще раз
            </Link>
            <Link className="nes-btn is-warning" to="/">
              Вернуться в главное меню
            </Link>
          </div>
        )}
        {playGame === 'vin' && (
          <div className="gameOver">
            <h1>VINNER</h1>
            <Link className="nes-btn is-primary" to="/game">
              Играть еще раз
            </Link>
            <Link className="nes-btn is-warning" to="/">
              Вернуться в главное меню
            </Link>
          </div>
        )}
        {playGame === 'waiting' && (
          <div className="App">
            <GameBar />
            <Hero />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

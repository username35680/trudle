import React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./rpg.css";
import { MAP, TILE_SIZE } from "./map";
import playerSprite from "./sprites/player.png";
import enemySprite from "./sprites/Enemy.png";
import tileset from "./sprites/tileset.png";

const SPRITE_SIZE = 16;
const FRAMES = 4;
const SPEED = 2;
const TILE_SPRITE_SIZE = 16;
const TILE_SCALE = 2;

const ENEMY_FRAME_COUNT = 3;
const ENEMY_SIZE = 16;
const ENEMY_SCALE = 2;
const ENEMY_ANIM_SPEED = 200;

const BLOCKING_TILES = ["#", "&", "é", "(", "è", "ç", "à"];

const TILE_POSITIONS = {
  ".": { x: 1, y: 2 },
  "#": { x: 10, y: 7 },
  "+": { x: 7, y: 1 },
  "-": { x: 33, y: 10 },
  "_": { x: 32, y: 10 },
  "&": { x: 33, y: 11 },
  "é": { x: 32, y: 11 },
  "(": { x: 33, y: 12 },
  "è": { x: 32, y: 12 },
  "ç": { x: 33, y: 13 },
  "à": { x: 32, y: 13 },
  "a": { x: 34, y: 10 },
  "z": { x: 34, y: 11 },
  "e": { x: 34, y: 12 },
  "r": { x: 34, y: 13 }
};

const DIR_ROW = {
  right: 0,
  left: 1,
  up: 2,
  down: 3,
  attackRight: 4,
  attackLeft: 5,
  attackDown: 6,
  attackUp: 7
};

const ATTACK_DIR_MAP = {
  up: "attackUp",
  down: "attackDown",
  left: "attackLeft",
  right: "attackRight"
};

const FLOOR_TILE = { x: 1, y: 2 };

const enemy = {
  x: 6 * TILE_SIZE,
  y: 4 * TILE_SIZE,
  row: 0
};

// Composant mémoïsé pour les tuiles
const Tile = ({ cell, x, y }) => {
  const tilePos = TILE_POSITIONS[cell];
  
  return (
    <div 
      key={`${x}-${y}`} 
      style={{ 
        position: "absolute", 
        left: x * TILE_SIZE, 
        top: y * TILE_SIZE 
      }}
    >
      {/* SOL (toujours) */}
      <div
        className="tile"
        style={{
          width: TILE_SPRITE_SIZE,
          height: TILE_SPRITE_SIZE,
          transform: `scale(${TILE_SCALE})`,
          transformOrigin: "top left",
          backgroundImage: `url(${tileset})`,
          backgroundPosition: `-${FLOOR_TILE.x * TILE_SPRITE_SIZE}px -${FLOOR_TILE.y * TILE_SPRITE_SIZE}px`,
          imageRendering: "pixelated"
        }}
      />

      {/* TILE PAR-DESSUS (si différente de .) */}
      {cell !== "." && tilePos && (
        <div
          className="tile"
          style={{
            width: TILE_SPRITE_SIZE,
            height: TILE_SPRITE_SIZE,
            transform: `scale(${TILE_SCALE})`,
            transformOrigin: "top left",
            backgroundImage: `url(${tileset})`,
            backgroundPosition: `-${tilePos.x * TILE_SPRITE_SIZE}px -${tilePos.y * TILE_SPRITE_SIZE}px`,
            imageRendering: "pixelated"
          }}
        />
      )}
    </div>
  );
};

// Mémoïsation du composant Tile
const MemoizedTile = React.memo(Tile);

export default function AppMiniRPG() {
  const [pos, setPos] = useState({ x: 2 * TILE_SIZE, y: 2 * TILE_SIZE });
  const [targetPos, setTargetPos] = useState(pos);
  const [dir, setDir] = useState("down");
  const [frame, setFrame] = useState(0);
  const [moving, setMoving] = useState(false);
  const [queuedDir, setQueuedDir] = useState(null);
  const [action, setAction] = useState("idle");
  const [enemyFrame, setEnemyFrame] = useState(0);

  const requestRef = useRef();
  const lastTimeRef = useRef(0);
  const frameTimeRef = useRef(0);
  const attackTimerRef = useRef(null);
  const enemyFrameTimeRef = useRef(0);
  const dirRef = useRef(dir);
  const enemyLastTimeRef = useRef(0);
  const attackDirRef = useRef(dir);
  const posRef = useRef(pos);
  const actionRef = useRef(action);
  const movingRef = useRef(moving);

  // Synchroniser les refs
  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    movingRef.current = moving;
  }, [moving]);

  // Fonction de collision avec l'ennemi (useCallback pour éviter les re-créations)
  const collideWithEnemy = useCallback((x, y, enemy) => {
    return !(
      x + SPRITE_SIZE <= enemy.x ||
      x >= enemy.x + ENEMY_SIZE ||
      y + SPRITE_SIZE <= enemy.y ||
      y >= enemy.y + ENEMY_SIZE
    );
  }, []);

  // Fonction de vérification de collision avec les tuiles
  const canMoveTo = useCallback((x, y) => {
    const corners = [
      { x, y },
      { x: x + SPRITE_SIZE, y },
      { x, y: y + SPRITE_SIZE },
      { x: x + SPRITE_SIZE, y: y + SPRITE_SIZE },
    ];

    for (const corner of corners) {
      const tileX = Math.floor(corner.x / TILE_SIZE);
      const tileY = Math.floor(corner.y / TILE_SIZE);

      if (!MAP[tileY] || !MAP[tileY][tileX]) return false;
      const tile = MAP[tileY][tileX];

      if (BLOCKING_TILES.includes(tile)) return false;
    }

    return true;
  }, []);

  // ===============================
  // BOUCLE MOUVEMENT + ANIMATION
  // ===============================
  useEffect(() => {
    if (!moving && action !== "attack") return;

    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Animation des frames
      if (actionRef.current !== "idle") {
        frameTimeRef.current += delta;
        const speed = actionRef.current === "attack" ? 80 : 150;

        if (frameTimeRef.current > speed) {
          setFrame(f => (f + 1) % FRAMES);
          frameTimeRef.current = 0;
        }
      }

      // Mouvement fluide
      if (movingRef.current) {
        setPos(prev => {
          const dx = targetPos.x - prev.x;
          const dy = targetPos.y - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= SPEED) {
            setMoving(false);
            setAction("idle");

            // Direction en attente
            if (queuedDir) {
              let x = Math.round(targetPos.x / TILE_SIZE);
              let y = Math.round(targetPos.y / TILE_SIZE);

              if (queuedDir === "up") y--;
              if (queuedDir === "down") y++;
              if (queuedDir === "left") x--;
              if (queuedDir === "right") x++;

              if (MAP[y][x] === ".") {
                setTargetPos({ x: x * TILE_SIZE, y: y * TILE_SIZE });
                setMoving(true);
                setAction("walk");
              }

              setQueuedDir(null);
            }

            return targetPos;
          }

          return {
            x: prev.x + (dx / dist) * SPEED,
            y: prev.y + (dy / dist) * SPEED
          };
        });
      }

      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current);
  }, [moving, targetPos, queuedDir, action]);

  // ===============================
  // ANIMATION ENNEMI (séparée)
  // ===============================
  useEffect(() => {
    let animationId;
    
    const animateEnemy = (time) => {
      if (!enemyLastTimeRef.current) enemyLastTimeRef.current = time;
      const delta = time - enemyLastTimeRef.current;
      enemyLastTimeRef.current = time;

      enemyFrameTimeRef.current += delta;

      if (enemyFrameTimeRef.current > ENEMY_ANIM_SPEED) {
        setEnemyFrame(f => (f + 1) % ENEMY_FRAME_COUNT);
        enemyFrameTimeRef.current = 0;
      }

      animationId = requestAnimationFrame(animateEnemy);
    };

    animationId = requestAnimationFrame(animateEnemy);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // ===============================
  // CLAVIER (DÉPLACEMENT + ATTAQUE)
  // ===============================
  useEffect(() => {
    const handleKey = (e) => {
      // -------- ATTAQUE --------
      if (e.code === "Space") {
        if (actionRef.current === "attack") return;

        attackDirRef.current = dirRef.current;
        setAction("attack");
        setFrame(0);

        clearTimeout(attackTimerRef.current);
        attackTimerRef.current = setTimeout(() => {
          setAction("idle");
          setFrame(0);
        }, 300);

        return;
      }

      // -------- DIRECTION --------
      let newDir = dirRef.current;
      if (e.key === "ArrowUp") newDir = "up";
      if (e.key === "ArrowDown") newDir = "down";
      if (e.key === "ArrowLeft") newDir = "left";
      if (e.key === "ArrowRight") newDir = "right";

      if (newDir === dirRef.current && !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        return;
      }

      setDir(newDir);
      dirRef.current = newDir;
      
      if (actionRef.current === "attack") return;

      // Nouvelle position cible
      let newX = posRef.current.x;
      let newY = posRef.current.y;

      if (newDir === "up") newY -= TILE_SIZE;
      if (newDir === "down") newY += TILE_SIZE;
      if (newDir === "left") newX -= TILE_SIZE;
      if (newDir === "right") newX += TILE_SIZE;

      if (!canMoveTo(newX, newY)) return;
      if (collideWithEnemy(newX, newY, enemy)) return;

      if (movingRef.current) {
        setQueuedDir(newDir);
        return;
      }

      setTargetPos({ x: newX, y: newY });
      setMoving(true);
      setAction("walk");
      setFrame(1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [canMoveTo, collideWithEnemy]);

  // ===============================
  // CALCULS MÉMOÏSÉS
  // ===============================
  const currentRow = useMemo(() => {
    return action === "attack"
      ? DIR_ROW[ATTACK_DIR_MAP[dir]]
      : DIR_ROW[dir];
  }, [action, dir]);

  const mapDimensions = useMemo(() => ({
    width: MAP[0].length * TILE_SIZE,
    height: MAP.length * TILE_SIZE
  }), []);

  // Pré-calcul des tuiles (ne change jamais)
  const mapTiles = useMemo(() => {
    return MAP.map((row, y) =>
      row.split("").map((cell, x) => ({ cell, x, y, key: `${x}-${y}` }))
    ).flat();
  }, []);

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="rpg-container">
      <div
        className="map"
        style={{
          width: mapDimensions.width,
          height: mapDimensions.height
        }}
      >
        {mapTiles.map(({ cell, x, y, key }) => (
          <MemoizedTile key={key} cell={cell} x={x} y={y} />
        ))}

        <div
          className="enemy"
          style={{
            position: "absolute",
            left: enemy.x,
            top: enemy.y,
            width: ENEMY_SIZE,
            height: ENEMY_SIZE,
            transform: `scale(${ENEMY_SCALE})`,
            transformOrigin: "bottom left",
            backgroundImage: `url(${enemySprite})`,
            backgroundSize: `${ENEMY_SIZE * ENEMY_FRAME_COUNT}px auto`,
            backgroundPosition: `-${enemyFrame * ENEMY_SIZE}px -${enemy.row * ENEMY_SIZE}px`,
            imageRendering: "pixelated"
          }}
        />

        <div
          className="player"
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            transform: "scale(2)",
            transformOrigin: "bottom left",
            backgroundImage: `url(${playerSprite})`,
            backgroundSize: `${SPRITE_SIZE * FRAMES}px auto`,
            backgroundPosition: `-${frame * SPRITE_SIZE}px -${currentRow * SPRITE_SIZE}px`,
            imageRendering: "pixelated"
          }}
        />
      </div>
    </div>
  );
}
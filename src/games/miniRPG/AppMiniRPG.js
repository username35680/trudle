import { useEffect, useState, useRef } from "react";
import "./rpg.css";
import { MAP, TILE_SIZE } from "./map";
import playerSprite from "./sprites/player.png";
import tileset from "./sprites/Tileset_16x16.png";

const SPRITE_SIZE = 16;
const FRAMES = 4;
const SPEED = 2;
const TILESET_SIZE = 16;
const TILESET_COLS = 3;
const TILESET_ROWS = 6;

const TILE_MAP = {
  ".": { col: 0, row: 0 },
  ",": { col: 1, row: 0 },
  "'": { col: 2, row: 0 },

  "~": { col: 0, row: 1 },
  "=": { col: 1, row: 1 },
  "!": { col: 2, row: 1 },

  ":": { col: 0, row: 2 },
  ";": { col: 1, row: 2 },
  "*": { col: 2, row: 2 },

  "#": { col: 0, row: 3 },
  "%": { col: 1, row: 3 },
  "&": { col: 2, row: 3 },

  "+": { col: 0, row: 4 },
  "-": { col: 1, row: 4 },
  "_": { col: 2, row: 4 }
};

export default function AppMiniRPG() {
  const [pos, setPos] = useState({ x: 2 * TILE_SIZE, y: 2 * TILE_SIZE });
  const [targetPos, setTargetPos] = useState(pos);
  const [dir, setDir] = useState("down");
  const [frame, setFrame] = useState(0);
  const [moving, setMoving] = useState(false);
  const [queuedDir, setQueuedDir] = useState(null);
  const [action, setAction] = useState("idle");

  const requestRef = useRef();
  const lastTimeRef = useRef(0);
  const frameTimeRef = useRef(0);
  const attackTimerRef = useRef(null);

  // ===============================
  // BOUCLE MOUVEMENT + ANIMATION
  // ===============================
  useEffect(() => {
    if (!moving && action !== "attack") return;

    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (action !== "idle") {
        frameTimeRef.current += delta;
        const speed = action === "attack" ? 80 : 150;

        if (frameTimeRef.current > speed) {
          setFrame(f => (f + 1) % FRAMES);
          frameTimeRef.current = 0;
        }
      }

      if (moving) {
        setPos(prev => {
          const dx = targetPos.x - prev.x;
          const dy = targetPos.y - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= SPEED) {
            setMoving(false);
            setAction("idle");

            if (queuedDir) {
              let x = Math.round(targetPos.x / TILE_SIZE);
              let y = Math.round(targetPos.y / TILE_SIZE);

              if (queuedDir === "up") y--;
              if (queuedDir === "down") y++;
              if (queuedDir === "left") x--;
              if (queuedDir === "right") x++;

              if (MAP[y][x] !== "#") {
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
  // CLAVIER
  // ===============================
  useEffect(() => {
    const handleKey = e => {
      if (e.code === "Space") {
        if (action === "attack") return;

        setAction("attack");
        setFrame(0);

        clearTimeout(attackTimerRef.current);
        attackTimerRef.current = setTimeout(() => {
          setAction("idle");
          setFrame(0);
        }, 300);
        return;
      }

      let newDir = dir;
      if (e.key === "ArrowUp") newDir = "up";
      if (e.key === "ArrowDown") newDir = "down";
      if (e.key === "ArrowLeft") newDir = "left";
      if (e.key === "ArrowRight") newDir = "right";

      setDir(newDir);
      if (action === "attack") return;

      let x = Math.round(pos.x / TILE_SIZE);
      let y = Math.round(pos.y / TILE_SIZE);

      if (newDir === "up") y--;
      if (newDir === "down") y++;
      if (newDir === "left") x--;
      if (newDir === "right") x++;

      if (MAP[y][x] === "#") return;

      if (moving) {
        setQueuedDir(newDir);
        return;
      }

      setTargetPos({ x: x * TILE_SIZE, y: y * TILE_SIZE });
      setMoving(true);
      setAction("walk");
      setFrame(1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir, pos, moving, action]);

  // ===============================
  // SPRITESHEET PLAYER
  // ===============================
  const dirRow = {
    right: 0,
    left: 1,
    up: 2,
    down: 3,
    attackRight: 4,
    attackLeft: 5,
    attackDown: 6,
    attackUp: 7
  };

  const attackDirMap = {
    up: "attackUp",
    down: "attackDown",
    left: "attackLeft",
    right: "attackRight"
  };

  const currentRow =
    action === "attack"
      ? dirRow[attackDirMap[dir]]
      : dirRow[dir];

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="rpg-container">
      <div
        className="map"
        style={{
          width: MAP[0].length * TILE_SIZE,
          height: MAP.length * TILE_SIZE
        }}
      >
        {MAP.map((row, y) =>
          row.split("").map((cell, x) => {
            const tile = TILE_MAP[cell];
            if (!tile) return null;

            return (
              <div
                key={`${x}-${y}`}
                className="tile"
                style={{
                  left: x * TILE_SIZE,
                  top: y * TILE_SIZE,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  backgroundImage: `url(${tileset})`,
                  backgroundSize: `${TILESET_COLS * TILESET_SIZE}px ${TILESET_ROWS * TILESET_SIZE}px`,
                  backgroundPosition: `-${tile.col * TILESET_SIZE}px -${tile.row * TILESET_SIZE}px`,
                  transform: "scale(2)",
                  transformOrigin: "top left"
                }}
              />
            );
          })
        )}

        <div
          className="player"
          style={{
            left: pos.x,
            top: pos.y,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            transform: "scale(2)",
            transformOrigin: "bottom left",
            backgroundImage: `url(${playerSprite})`,
            backgroundSize: `${SPRITE_SIZE * FRAMES}px auto`,
            backgroundPosition: `-${frame * SPRITE_SIZE}px -${currentRow * SPRITE_SIZE}px`
          }}
        />
      </div>
    </div>
  );
}

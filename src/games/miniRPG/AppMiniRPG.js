import { useEffect, useState, useRef } from "react";
import "./rpg.css";
import { MAP, TILE_SIZE } from "./map";
import playerSprite from "./sprites/player.png";
import tileset from "./sprites/tileset.png";

const SPRITE_SIZE = 16;
const FRAMES = 4;
const SPEED = 2;
const TILE_SPRITE_SIZE = 16;
const TILE_SCALE = 2;

export default function AppMiniRPG() {
  const [pos, setPos] = useState({ x: 2 * TILE_SIZE, y: 2 * TILE_SIZE });
  const [targetPos, setTargetPos] = useState(pos);
  const [dir, setDir] = useState("down");
  const [frame, setFrame] = useState(0);
  const [moving, setMoving] = useState(false);
  const [queuedDir, setQueuedDir] = useState(null);
  const [action, setAction] = useState("idle"); // idle | walk | attack

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

      // Animation des frames
      if (action !== "idle") {
        frameTimeRef.current += delta;
        const speed = action === "attack" ? 80 : 150;

        if (frameTimeRef.current > speed) {
          setFrame(f => (f + 1) % FRAMES);
          frameTimeRef.current = 0;
        }
      }

      // Mouvement fluide
      if (moving) {
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
  // CLAVIER (DÉPLACEMENT + ATTAQUE)
  // ===============================
  useEffect(() => {
    const BLOCKING_TILES = ["#", "&", "é", "(", "è", "ç", "à"];

  function canMoveTo(x, y) {
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
  }
    const handleKey = (e) => {
      // -------- ATTAQUE --------
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

      // -------- DIRECTION --------
      let newDir = dir;
      if (e.key === "ArrowUp") newDir = "up";
      if (e.key === "ArrowDown") newDir = "down";
      if (e.key === "ArrowLeft") newDir = "left";
      if (e.key === "ArrowRight") newDir = "right";

      setDir(newDir);
      if (action === "attack") return;

      // Nouvelle position cible (fluide)
      let newX = pos.x;
      let newY = pos.y;

      if (newDir === "up") newY -= TILE_SIZE;
      if (newDir === "down") newY += TILE_SIZE;
      if (newDir === "left") newX -= TILE_SIZE;
      if (newDir === "right") newX += TILE_SIZE;

      if (!canMoveTo(newX, newY)) return; // collision

      if (moving) {
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
  }, [dir, pos, moving, action]);

  // ===============================
  // SPRITESHEET
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

  const TILE_POSITIONS = {
    ".": { x: 1, y: 2 }, 
    "#": { x: 10, y: 7 },
    "-": { x: 33, y: 10},
    "_": { x: 32, y: 10},
    "&": { x: 33, y: 11},
    "é": { x: 32, y: 11},
    "(": { x: 33, y: 12},
    "è": { x: 32, y: 12},
    "ç": { x: 33, y: 13},
    "à": { x: 32, y: 13},
    "a": { x: 34, y: 10},
    "z": { x: 34, y: 11},
    "e": { x: 34, y: 12},
    "r": { x: 34, y: 13}
  };

  const attackDirMap = {
    up: "attackUp",
    down: "attackDown",
    left: "attackLeft",
    right: "attackRight"
  };

  const FLOOR_TILE = { x: 1, y: 2 }; // ton "."

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
          row.split("").map((cell, x) => (
            <div key={`${x}-${y}`} style={{ position: "absolute", left: x * TILE_SIZE, top: y * TILE_SIZE }}>

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
              {cell !== "." && TILE_POSITIONS[cell] && (
                <div
                  className="tile"
                  style={{
                    width: TILE_SPRITE_SIZE,
                    height: TILE_SPRITE_SIZE,
                    transform: `scale(${TILE_SCALE})`,
                    transformOrigin: "top left",
                    backgroundImage: `url(${tileset})`,
                    backgroundPosition: `-${TILE_POSITIONS[cell].x * TILE_SPRITE_SIZE}px -${TILE_POSITIONS[cell].y * TILE_SPRITE_SIZE}px`,
                    imageRendering: "pixelated"
                  }}
                />
              )}

            </div>
          ))
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
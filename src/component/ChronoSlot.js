import { useDroppable } from "@dnd-kit/core";

export default function ChronoSlot({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`chronoSlot ${isOver ? "over" : ""}`}>
      <div ref={setNodeRef} className="chronoSlotHitbox">
        {children}
      </div>
    </div>
  );
}

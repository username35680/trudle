import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ChronoCard({ event }) {
  const [flipped, setFlipped] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`chronoCard ${flipped ? "flipped" : ""}`}
      onPointerUp={() => setFlipped(f => !f)}
    >
      <div className="chronoCardInner">
        {/* Face avant */}
        <div className="chronoCardFront">
          <div className="chronoTitle">{event.title}</div>
          <div className="chronoCategory">{event.category}</div>
        </div>

        {/* Face arrière */}
        <div className="chronoCardBack">
          <p>{event.fact}</p>
        </div>
      </div>
    </div>
  );
}

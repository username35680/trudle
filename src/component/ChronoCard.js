import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ChronoCard({ event }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`chronoCard simple ${event.status || ""}`}
    >
      <div className="chronoCardInner">
        <div className={`chronoCardFront ${event.status || ""}`}>
          <div className="chronoTitle">{event.title}</div>
          <div className="chronoCategory">{event.category}</div>
        </div>
        <div className="chronoCardBack">
          <p>{event.fact}</p>
        </div>
      </div>
    </div>
  );
}
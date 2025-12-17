// components/ChronoBoard.jsx
import { DndContext, closestCenter } from "@dnd-kit/core";
import { pointerWithin } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import ChronoCard from "./ChronoCard";
import ChronoSlot from "./ChronoSlot";

const SLOTS = [0, 1, 2, 3, 4];

export default function ChronoBoard({ items, setItems }) {
  const topItems = items.filter(e => e.position === null);
  const bottomItems = SLOTS.map(
    slot => items.find(e => e.position === slot) || null
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    setItems(prev => {
      const dragged = prev.find(e => e.id === active.id);
      if (!dragged) return prev;

      // ⬇️ ICI
      if (over.id.startsWith("slot-")) {
        const slotIndex = Number(over.id.split("-")[1]);

        // slot déjà occupé → on ignore
        if (prev.some(e => e.position === slotIndex)) {
          return prev;
        }

        return prev.map(e =>
          e.id === dragged.id
            ? { ...e, position: slotIndex }
            : e
        );
      }

      return prev;
    });
  };

  const sortedDates = [...items]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => new Date(e.date).toLocaleDateString("fr-FR"));
  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd}
    >
      {/* Ligne du haut */}
      <SortableContext items={topItems.map(i => i.id)} strategy={horizontalListSortingStrategy}>
        <div className="chronoBoard">
          {topItems.map(event => (
            <ChronoCard key={event.id} event={event} />
          ))}
        </div>
      </SortableContext>

      <div className="chronoBoard slots">
        {SLOTS.map((slot, index) => (
          <div key={index} className="slotContainer">
            <ChronoSlot id={`slot-${index}`}>
              {bottomItems[index] && <ChronoCard event={bottomItems[index]} />}
            </ChronoSlot>

            {/* Date fixe en dessous comme repère */}
            <div className="chronoSlotDate">{sortedDates[index]}</div>
          </div>
        ))}
      </div>


    </DndContext>
  );
}

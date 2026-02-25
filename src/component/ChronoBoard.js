import { DndContext, pointerWithin } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import ChronoCard from "./ChronoCard";
import ChronoSlot from "./ChronoSlot";

const SLOTS = [0, 1, 2, 3, 4];

export default function ChronoBoard({ items, setItems }) {
  const topItems = items.filter(e => e.position === null);
  const bottomItems = SLOTS.map(slot => items.find(e => e.position === slot) || null);

  // Génère les étiquettes de dates triées chronologiquement pour les slots
  const sortedDates = [...items]
    .sort((a, b) => a.val - b.val)
    .map(e => e.dateLabel);

  const handleDragEnd = ({ active, over }) => {
    // 1. Sécurité : si on lâche dans le vide
    if (!over) return;

    // 2. Conversion forcée pour éviter l'erreur .startsWith
    const activeId = String(active.id);
    const overId = String(over.id);

    setItems((prev) => {
      const dragged = prev.find((e) => String(e.id) === activeId);
      if (!dragged) return prev;

      // Cas 1 : Dépôt sur un slot
      if (overId.startsWith("slot-")) {
        const slotIndex = parseInt(overId.split("-")[1], 10);
        
        // Vérifier si le slot est occupé
        const isOccupied = prev.some(e => e.position === slotIndex && String(e.id) !== activeId);
        if (isOccupied) return prev;

        return prev.map(e => String(e.id) === activeId ? { ...e, position: slotIndex } : e);
      }

      // Cas 2 : Retour à la pioche
      if (overId === "top-area") {
        return prev.map(e => String(e.id) === activeId ? { ...e, position: null } : e);
      }

      return prev;
    });
  };

  return (
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      
      {/* Zone de Pioche (Haut) */}
      <div className="boardSection">
        <SortableContext items={topItems.map(i => i.id)} strategy={horizontalListSortingStrategy}>
          <div className="chronoBoard" id="top-area">
            {topItems.length === 0 && <div className="emptyHint">Toutes les cartes sont placées</div>}
            {topItems.map(event => (
              <ChronoCard key={event.id} event={event} />
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Zone de Classement (Bas) */}
      <div className="chronoBoard slots">
        {SLOTS.map((slot, index) => (
          <div key={index} className="slotContainer">
            <ChronoSlot id={`slot-${index}`}>
              {bottomItems[index] && <ChronoCard event={bottomItems[index]} />}
            </ChronoSlot>
            
            {/* L'indice de la date qui aide le joueur */}
            <div className="chronoSlotDate">{sortedDates[index]}</div>
          </div>
        ))}
      </div>

    </DndContext>
  );
}
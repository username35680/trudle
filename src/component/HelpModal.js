import React from "react";

export default function HelpModal({ onClose }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="helpHeader">
          <h3 style={{margin:0}}>Aide — Règles</h3>
          <button className="ghost" onClick={onClose}>Fermer</button>
        </div>

        <div className="helpContent">
          <p>Devine le pays. Pour chaque tentative tu obtiens :</p>
          <ul>
            <li><strong>Nom</strong> : vert si exact.</li>
            <li><strong>Continent</strong> : vert si identique.</li>
            <li><strong>Population</strong> : arrondie au million ; flèche ↑/↓ indique si la valeur est plus grande ou plus petite. Vert si même million ou exactement identique.</li>
            <li><strong>Superficie</strong> : flèche ↑/↓ ; vert si exactement identique.</li>
            <li><strong>Frontières</strong> : nombre de voisins ; flèche ↑/↓ ; vert si identique.</li>
          </ul>
          <p>Après <strong>5 essais</strong>, l'indice (drapeau) est débloqué — clique la case grise pour le révéler.</p>
          <p>La recherche tolère les accents, majuscules et espaces.</p>
        </div>
      </div>
    </div>
  );
}

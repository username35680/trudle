import { useState } from "react";

export default function SynopsisHint({ fr, en }) {
  const [showOriginal, setShowOriginal] = useState(false);

  const blurKeywords = text =>
    text.replace(
      /(combat|guerre|pouvoir|secret|monde|destin)/gi,
      "<span class='blur'>$1</span>"
    );

  return (
    <div className="synopsisBox">
      <div className="synopsisHeader">
        <span className="badge">🌐 traduit automatiquement</span>
        <button
          className="ghost small"
          onClick={() => setShowOriginal(s => !s)}
        >
          {showOriginal ? "Voir la version traduite" : "Voir version originale"}
        </button>
      </div>

      <p
        className="synopsisText"
        dangerouslySetInnerHTML={{
          __html: blurKeywords(showOriginal ? en : fr)
        }}
      />
    </div>
  );
}

import React from "react";
import "./ComingSoon.css";

const ComingSoon: React.FC = () => {
  const openTypeform = () => {
    window.open("https://r2k2ifpxhy0.typeform.com/to/Y9ChZqNZ", "_blank");
  };

  return (
    <div className="coming-soon-container">
      <div className="canva-embed-wrapper" style={{
        position: "relative",
        width: "100%",
        height: 0,
        paddingTop: "56.2225%",
        paddingBottom: 0,
        boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
        marginTop: "1.6em",
        marginBottom: "0.9em",
        overflow: "hidden",
        borderRadius: "8px",
        willChange: "transform"
      }}>
        <iframe
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            border: "none",
            padding: 0,
            margin: 0,
          }}
          src="https://www.canva.com/design/DAGQLRBmjXI/mzXgE7NW-OwTrwouz-kULg/view?embed"
          allowFullScreen={true}
          allow="fullscreen"
        />
        <button 
          className="early-access-button"
          onClick={openTypeform}
        >
          Get Early Access
        </button>
      </div>
      <div className="attribution">
        <a
          href="https://www.canva.com/design/DAGQLRBmjXI/mzXgE7NW-OwTrwouz-kULg/view?utm_content=DAGQLRBmjXI&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </div>
    </div>
  );
};

export default ComingSoon;
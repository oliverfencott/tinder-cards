import React from 'react';
import './ItsAMatchOverlay.css';

const ItsAMatchOverlay = ({ open, name }) => {
  const classNameSuffix = open ? 'open' : 'closed';

  return (
    <div className={`its-a-match-overlay__container its-a-match-overlay__container--${classNameSuffix}`}>
      It's a match!
      You and {name} have liked each other
    </div>
  );
};

export default ItsAMatchOverlay;

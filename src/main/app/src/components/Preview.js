import React from 'react';

import removeMd from 'remove-markdown';

const Preview = ({ markdown }) => {
  const textAsSentences = removeMd(markdown).match(/[^.!?]+[.!?]+/g);
  const atLeastLetters = 200;
  return (
    <p>
      {textAsSentences.reduce((paragraph, sentence) => {
        return paragraph.length < atLeastLetters &&
          sentence[0].toUpperCase() === sentence[0]
          ? paragraph + sentence
          : paragraph;
      }, '')}
    </p>
  );
};

export default Preview;

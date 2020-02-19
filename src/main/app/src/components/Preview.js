import React from 'react';
import removeMd from 'remove-markdown';
import { observer } from 'mobx-react-lite';

const Preview = observer(({ markdown }) => {
  const sentences = removeMd(markdown).match(/[^\.!\?]+[\.!\?]+/g);
  const atLeastLetters = 200;
  return (
    <p>
      {sentences.reduce((paragraph, sentence) =>
        (paragraph || '').length < atLeastLetters
          ? paragraph + sentence
          : paragraph
      )}
    </p>
  );
});

export default Preview;

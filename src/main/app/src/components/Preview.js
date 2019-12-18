import React from 'react';
import removeMd from 'remove-markdown';
import { makeStyles } from '@material-ui/core';
import { colors } from '../colors';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles({
  highlight: {
    backgroundColor: colors.green,
    color: colors.white,
  },
});

const Preview = observer(({ markdown, keywords }) => {
  const classes = useStyles();
  const sentences = removeMd(markdown).match(/[^\.!\?]+[\.!\?]+/g); //.map(s => s.trim());
  const result = sentences
    .map((sentence) => {
      const l = sentence.toLowerCase();
      const matches = keywords
        .map((kw) => [kw, l.indexOf(kw)])
        .filter(([_, i]) => i !== -1);
      return matches.length !== 0 ? [sentence, matches[0]] : null;
    })
    .filter((r) => r !== null);

  const markSentence = (sentence, keyword, firstIndex, sidx) => {
    const a = sentence.substring(0, firstIndex);
    const b = sentence.substring(firstIndex, keyword.length + firstIndex);
    const c = sentence.substring(keyword.length + firstIndex);
    return (
      <span key={`s-${sidx}-${firstIndex}`}>
        {a}
        <span className={classes.highlight}>{b}</span>
        {c}
      </span>
    );
  };

  return (
    <p>
      {(result || []).map(([sentence, [kw, index]], sidx) => {
        return sentence && kw ? markSentence(sentence, kw, index, sidx) : null;
      })}
    </p>
  );
});

export default Preview;

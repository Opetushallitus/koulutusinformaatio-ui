import { isAfter, isBefore, subMonths } from 'date-fns';

export const isHakuAuki = (hakuajat = []) =>
  hakuajat.some((hakuaika) => {
    const now = new Date();
    const isAfterStart = !hakuaika.alkaa || isAfter(now, new Date(hakuaika.alkaa));
    const isBeforeEnd = !hakuaika.paattyy || isBefore(now, new Date(hakuaika.paattyy));
    return isAfterStart && isBeforeEnd;
  });

// 3 kk sitten päättyneet tai uudemmat ovat relevantteja oppijalle
export const isHakuTimeRelevant = (hakuajat) => {
  const now = new Date();
  return hakuajat.some(
    (aika) => !aika.paattyy || isBefore(subMonths(now, 3), new Date(aika.paattyy))
  );
};

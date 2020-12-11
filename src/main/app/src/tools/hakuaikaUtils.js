import { isAfter, isBefore } from 'date-fns';

export const isHakuAuki = (hakuajat = []) =>
  hakuajat.some((hakuaika) => {
    const now = new Date();
    const isAfterStart = !hakuaika.alkaa || isAfter(now, new Date(hakuaika.alkaa));
    const isBeforeEnd = !hakuaika.paattyy || isBefore(now, new Date(hakuaika.paattyy));
    return isAfterStart && isBeforeEnd;
  });

export const isHakuEndInFuture = (hakuajat) => {
  const now = new Date();
  return hakuajat.some((aika) => !aika.paattyy || isBefore(now, new Date(aika.paattyy)));
};

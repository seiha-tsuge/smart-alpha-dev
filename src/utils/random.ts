import { uuid } from 'uuidv4';

export const createRandomIdString = () => {
  return uuid();
};

export const createRandomIdNumber = () => {
  const min = 1;
  const max = 9999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

import { get, post } from './axios';
import { BASE_URL } from '@env';

export const getName = (name) => {
  name = encodeURIComponent(name);
  return post(`/test/${name}`)
}
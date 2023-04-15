import { BASE_URL } from '@env';

export const imageUriParser = (imgUUID) => {
  return `${BASE_URL}/api/GetItemImage/${imgUUID}`;
}
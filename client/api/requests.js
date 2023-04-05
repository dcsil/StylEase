import { get, post } from './axios';

export const getUserData = (uuid) => { 
  return get(`/GetUser/${uuid}`);
}

export const getOutfitsData = (uuid) => {
  return get(`/Getoutfitcollection/${uuid}`);
}

export const getWardrobeItems = (uuid) => { 
  return get(`/GetWardrobeItems/${uuid}`);
};

export const uploadWardrobeItem = (uuid, base64) => { 
  return post(`/AddNewItem`, {
    userid: uuid,
    item: {
      user: uuid,
      image: base64,
    }
  });
}

export const outfitRecommend = (outfitData, regen=false) => { 
  return post(`/CreateAIOutfit`, {
    outfit: outfitData,
    regenerate: regen,
  });
}

export const uploadOutfit = (outfitData, collectionName) => { 
  // console.log(collectionName);
  return post(`/AddNewOutfit`, {
    outfit: outfitData,
    outfit_collection: collectionName,
  });
}
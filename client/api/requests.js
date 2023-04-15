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
      market: false,
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

export const Login = (email, pswd) => { 
  console.log(email, pswd);
  return post(`/Login`, {
    email: email,
    password: pswd,
  });
}

export const SignUp = (name, email, pswd) => { 

  return post(`/Register`, {
    name: name,
    email: email,
    password: pswd,
  });
}

// APIs for Calendar
export const getOutfit = (uuid, outfitID) => {
  return get(`/GetOutfit/${uuid}/${outfitID}`);
}

export const getAllDays = (uuid) => {
  return get(`/GetAllDays/${uuid}`);
}

export const addPlanToDay = (uuid, name, date, createdTime, planned_outfits, occasion) => {
  return post(`/AddPlanToDay`, {
    user: uuid,
    name: name,
    date: date,
    createdTime: createdTime,
    planned_outfits: planned_outfits,
    occasion: occasion
  })
}

export const getPlan = (plan_id) => {
  return get(`/GetPlan/${plan_id}`);
}

export const updatePlan = (plan, plan_id) => {
  return post(`/UpdatePlan`, {
    plan: plan,
    plan_id: plan_id
  })
}

export const deletePlan = (plan_id, day_id) => {
  return post(`/DeletePlan`, {
    plan_id: plan_id,
    day_id: day_id
  })
}
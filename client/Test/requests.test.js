import { getUserData, getOutfitsData, getWardrobeItems, uploadWardrobeItem, outfitRecommend, uploadOutfit, Login, SignUp, getOutfit, getAllDays, addPlanToDay, getPlan, updatePlan, deletePlan } from '../api/requests';
import { get, post } from '../api/axios';

jest.mock('../api/axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

describe('API functions', () => {
  const uuid = '1234';
  const base64 = 'base64string';
  const outfitData = {
    items: ['item1', 'item2'],
    occasion: 'casual',
    fromMarket: false
  };
  const collectionName = 'My Collection';
  const email = 'test@test.com';
  const password = 'password';
  const name = 'Test User';
  const planId = '5678';
  const dayId = '9876';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserData', () => {
    it('should call the get function with the correct URL', () => {
      getUserData(uuid);
      expect(get).toHaveBeenCalledWith(`/GetUser/${uuid}`);
    });
  });

  describe('getOutfitsData', () => {
    it('should call the get function with the correct URL', () => {
      getOutfitsData(uuid);
      expect(get).toHaveBeenCalledWith(`/Getoutfitcollection/${uuid}`);
    });
  });

  describe('getWardrobeItems', () => {
    it('should call the get function with the correct URL', () => {
      getWardrobeItems(uuid);
      expect(get).toHaveBeenCalledWith(`/GetWardrobeItems/${uuid}`);
    });
  });

  describe('uploadWardrobeItem', () => {
    it('should call the post function with the correct URL and payload', () => {
      uploadWardrobeItem(uuid, base64);
      expect(post).toHaveBeenCalledWith(`/AddNewItem`, {
        userid: uuid,
        item: {
          user: uuid,
          image: base64,
          market: false,
        }
      });
    });
  });

  describe('outfitRecommend', () => {
    it('should call the post function with the correct URL and payload', () => {
      outfitRecommend(uuid, outfitData, false);
      expect(post).toHaveBeenCalledWith(`/CreateAIOutfit`, {
        selected_items: outfitData.items,
        style: outfitData.occasion.toUpperCase(),
        from_market: outfitData.fromMarket,
        userid: uuid,
        regenerate: false,
      });
    });
  });

  describe('uploadOutfit', () => {
    it('should call the post function with the correct URL and payload', () => {
      uploadOutfit(outfitData, collectionName);
      expect(post).toHaveBeenCalledWith(`/AddNewOutfit`, {
        outfit: outfitData,
        outfit_collection: collectionName,
      });
    });
  });

  describe('Login', () => {
    it('should call the post function with the correct URL and payload', () => {
      Login(email, password);
      expect(post).toHaveBeenCalledWith(`/Login`, {
        email: email,
        password: password,
      });
    });
  });

  describe('SignUp', () => {
    it('should call the post function with the correct URL and payload', () => {
      SignUp(name, email, password);
      expect(post).toHaveBeenCalledWith(`/Register`, {
        name: name,
        email: email,
        password: password,
      });
    });
  });

  describe('Outfit API', () => {
    test('getOutfit should fetch outfit data for a user and outfit ID', async () => {
      const user_id = '1234';
      const outfit_id = '5678';
      const mockData = { outfitId: outfit_id, name: 'Outfit 1', items: [1, 2, 3], occasion: 'casual' };
      get.mockResolvedValue(mockData);
  
      const response = await getOutfit(user_id, outfit_id);
  
      expect(get).toHaveBeenCalledWith(`/GetOutfit/${user_id}/${outfit_id}`);
      expect(response).toEqual(mockData);
    });

  describe('getAllDays', () => {
    it('should call the get function with the correct URL', () => {
      const userId = '5678';
      getAllDays(userId);
      expect(get).toHaveBeenCalledWith(`/GetAllDays/${userId}`);
    });
  });

  describe('Calendar API', () => {
    test('addPlanToDay should call the post function with the correct URL and payload', async () => {
      const user_id = '1234';
      const name = 'Plan 1';
      const date = '2023-05-01';
      const created_time = '2023-04-15T09:00:00.000Z';
      const planned_outfits = [1, 2, 3];
      const occasion = 'casual';
      const mockData = { success: true };
      post.mockResolvedValue(mockData);
  
      await addPlanToDay(user_id, name, date, created_time, planned_outfits, occasion);
  
      expect(post).toHaveBeenCalledWith(`/AddPlanToDay`, {
        user: user_id,
        name: name,
        date: date,
        createdTime: created_time,
        planned_outfits: planned_outfits,
        occasion: occasion
      });
    });
  });

  describe('Calendar API', () => {

    test('getPlan should fetch plan data', async () => {
      const plan_id = 'abc123';
      const mockData = { planId: plan_id, name: 'Plan 1', date: '2023-05-01', planned_outfits: [1, 2, 3] };
      get.mockResolvedValue( mockData );
  
      const response = await getPlan(plan_id);
  
      expect(get).toHaveBeenCalledWith(`/GetPlan/${plan_id}`);
      expect(response).toEqual(mockData);
    });
  
    test('updatePlan should update plan data', async () => {
      const plan_id = 'abc123';
      const plan = { name: 'Plan 1', date: '2023-05-01', planned_outfits: [1, 2, 3] };
      const mockResponse = { success: true };
      post.mockResolvedValue( mockResponse );
  
      const response = await updatePlan(plan, plan_id);
  
      expect(post).toHaveBeenCalledWith(`/UpdatePlan`, { plan, plan_id });
      expect(response).toEqual(mockResponse);
    });
  
    test('deletePlan should delete plan data', async () => {
      const plan_id = 'abc123';
      const day_id = 'def456';
      const mockResponse = { success: true };
      post.mockResolvedValue( mockResponse );
  
      const response = await deletePlan(plan_id, day_id);
  
      expect(post).toHaveBeenCalledWith(`/DeletePlan`, { plan_id, day_id });
      expect(response).toEqual(mockResponse);
    });
  
  });
})});
import userReducer from '../stores/UserStore';
import { configureStore } from '@reduxjs/toolkit';
import {
  setUserId,
  fetchUserData,
  fetchWardrobeItems,
  fetchOutfitsData,
} from '../stores/UserStore';

const mockGetWardrobeItems = jest.fn(() => Promise.resolve({ wardrobe: [] }));
const mockGetUserData = jest.fn(() => Promise.resolve({ user: {} }));
const mockGetOutfitsData = jest.fn(() => Promise.resolve({ outfit_collections: [] }));

jest.mock('../api/requests.js', () => ({
  getWardrobeItems: (...args) => mockGetWardrobeItems(args),
  getUserData: (...args) => mockGetUserData(args),
  getOutfitsData: (...args) => mockGetOutfitsData(args),
}));

describe('UserReducer Test', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: userReducer });
  });

  it('should return the initial state', () => {
    // console.log(userReducer(undefined, {}));
    expect(userReducer(undefined, {})).toEqual({ loading: false, userInfo: { _id: null, data: null } })
  });

  it('should handle setUserId', () => {
    expect(userReducer(undefined, { type: setUserId.type, payload: '123' })).toEqual({ loading: false, userInfo: { _id: '123', data: null } })
  });

  it('should handle fetch methods', async () => {
    await store.dispatch(fetchUserData('123', 666)).then(() => {
      const state = store.getState();
      expect(state.userInfo.data).toEqual({ wardrobe: [] });
    });
    await store.dispatch(fetchOutfitsData(666)).then(() => {
      const state = store.getState();
      expect(state.userInfo.data).toEqual({ outfits_collections: [], wardrobe: [] });
    });
    await store.dispatch(fetchWardrobeItems(666)).then(() => {
      const state = store.getState();
      expect(state.userInfo.data).toEqual({ outfits_collections: [], wardrobe: [] });
    });
  });
})
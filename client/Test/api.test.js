import { waitFor } from '@testing-library/react-native';
import * as reqs from '../api/requests';
import axios from 'axios';

const mockGet = jest.fn(() => Promise.resolve({ data: {} }));
const mockPost = jest.fn(() => Promise.resolve({ data: {} }));
const mockPut = jest.fn(() => Promise.resolve({ data: {} }));
const mockDelete = jest.fn(() => Promise.resolve({ data: {} }));

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  get: mockGet,
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
  create: () => ({
    get: (...args) => mockGet(args),
    post: (...args) => mockPost(args),
    put: (...args) => mockPut(args),
    delete: (...args) => mockDelete(args),
  }),
}));


describe('API', () => {
  it('getUserData', async () => {
    await reqs.getUserData(111);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
  });

  it('getOutfitsData', async () => {
    await reqs.getOutfitsData(111);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
  })

  it('getWardrobeItems', async () => {
    reqs.getWardrobeItems(111);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
  })

  it('uploadWardrobeItem', async () => {
    reqs.uploadWardrobeItem(111, 222);
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
  })

  it('outfitRecommend', async () => {
    reqs.outfitRecommend(111, { items: [], occasion: 'Causual', fromMarket: true });
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
  })

  it('uploadOutfit', async () => {
    reqs.uploadOutfit({ items: [], occasion: 'Causual', fromMarket: true }, 'aaa');
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
  })

  it('Login', async () => {
    reqs.Login('aaa', 'bbb');
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
  });

  it('SignUp', async () => {
    reqs.SignUp('aaa', 'bbb', 'ccc');
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
  });

  it('getOutfit', async () => {
    reqs.getOutfit(111, 222);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
  });

  it('getAllDays', async () => {
    reqs.getAllDays(111);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
  });

  it('addPlanToDay', async () => {
    reqs.addPlanToDay(111, 'aaa', 111, 111, 111, 'aa');
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
  });

  it('getPlan', async () => {
    reqs.getPlan(111);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
  });

  it('updatePlan', async () => {
    reqs.updatePlan(111, 111);
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
  });

  it('deletePlan', async () => {
    reqs.deletePlan(111, 1111);
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
  });
});
import axios from 'axios';
import { BASE_URL } from '@env';
import { get, post, put, deleteMethod, patch} from '../api/axios';


jest.mock('axios');

describe('axios get function', () => {

    it('should return data when API call is successful', async () => {
      const mockResponse = { data:{id: 1, name: 'John Doe' }};
      axios.get.mockResolvedValueOnce(mockResponse.data);
  
      const url = '`${BASE_URL}/users`';
      const params = { id: 1 };
      const config = { timeout: 1000 };
      const response = await axios.get(url, {params}, config);
  
      //expect(get).toHaveBeenCalledWith(url, {params}, config);
      expect(response).toEqual(mockResponse.data);
    });
});

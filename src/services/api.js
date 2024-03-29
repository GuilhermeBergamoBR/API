import { create } from 'apisauce'
import AsyncStorage from '@react-native-community/async-storage'

const api = create({
  baseURL: 'http://localhost:3000'
})

api.addAsyncRequestTransform(request => async () => {
  const token = await AsyncStorage.getItem('@token');

  if (token)
    request.headers['Authorization'] = `Bearer ${token}`;
});

api.addResponseTransform(response => {
  if (!response.ok) throw response
})

export default api 
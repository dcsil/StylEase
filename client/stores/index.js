import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './UserStore';

export default configureStore({
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  //   serializableCheck: {

  //   }
  // }),
  reducer: {
    user: UserReducer,
  }
});
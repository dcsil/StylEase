import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getWardrobeItems,
  getUserData
} from "../api/requests";

export const fetchWardrobeItems = createAsyncThunk("user/fetchWardrobeItems",
  async (userId) => {
    if (!userId) return;
    const data = await getWardrobeItems(userId);
    return data;
  }
);

export const fetchUserData = createAsyncThunk("user/fetchUserData",
  async (userId) => {
    if (!userId) return;
    const data = await getUserData(userId);
    return data;
  }
);

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    userInfo: {
      _id: '64237961038602a02a81cd92',
      data: null
    }
  },
  reducers: {

  },
  extraReducers: (builder) => {
    // #region fetchUserInfo
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.userInfo.data = action.payload.user;
      state.loading = false;
    });
    builder.addCase(fetchUserData.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(fetchUserData.rejected, (state, _action) => {
      console.log("failed");
      state.loading = false;
    });
    // #endregion

    // #region fetchWardrobeItems
    builder.addCase(fetchWardrobeItems.fulfilled, (state, action) => {
      if (!action.payload) return;
      if (state.userInfo.data == null) return;
      state.userInfo.data.wardrobe = action.payload.wardrobe;
      state.loading = false;
    });
    builder.addCase(fetchWardrobeItems.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(fetchWardrobeItems.rejected, (state, _action) => {
      console.log("failed");
      state.loading = false;
    });
    // #endregion
  }

});

export const {

} = UserSlice.actions;
export default UserSlice.reducer;
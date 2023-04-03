import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getWardrobeItems,
  getUserData,
  getOutfitsData
} from "../api/requests";

export const fetchWardrobeItems = createAsyncThunk("user/fetchWardrobeItems",
  async (userId) => {
    if (!userId) return;
    const data = await getWardrobeItems(userId);
    return data;
  }
);

export const fetchOutfitsData = createAsyncThunk("user/fetchOutfitsData",
  async (userId) => {
    if (!userId) return;
    const data = await getOutfitsData(userId);
    return data;
  }
);

export const fetchUserData = createAsyncThunk("user/fetchUserData",
  async (userId) => {
    if (!userId) return;
    const data = await getUserData(userId);
    const wardrobeData = await getWardrobeItems(userId);
    return { data: data, wardrobeData: wardrobeData};
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
      state.userInfo.data = action.payload.data.user;
      state.userInfo.data.wardrobe = action.payload.wardrobeData;
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

    // #region fetchOutfitData
    builder.addCase(fetchOutfitsData.fulfilled, (state, action) => {
      if (!action.payload) return;
      if (state.userInfo.data == null) return;
      state.userInfo.data.outfits_collections = action.payload.outfit_collections;
      state.loading = false;
    });
    builder.addCase(fetchOutfitsData.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(fetchOutfitsData.rejected, (state, _action) => {
      console.log("failed");
      state.loading = false;
    });
    
  }

});

export const {

} = UserSlice.actions;
export default UserSlice.reducer;
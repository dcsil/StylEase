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
    // const data = {
    //   outfit_collections: [
    //     {
    //       _id: "5f9b5b0b0b9b0b0b0b0b0b0b",
    //       name: "Outfit 1",
    //       created_time: "2020-10-29T09:00:00.000Z",
    //       outfits: [
    //         {
    //           _id: "000000001",
    //           name: "Outfit 1",
    //           created_time: "2020-10-29",
    //           items: [
    //             {
    //               _id: "64237aef7bd7fa3c355dda94",
    //             },
    //             {
    //               _id: "64237df5ad0c1edddca0f8dc",
    //             },
    //             {
    //               _id: "64237f08a1204d530d6a5ac3",
    //             },
    //             {
    //               _id: "6423ceeccceaaf521dfe74b6",
    //             }
    //           ]
    //         },
    //         {
    //           _id: "000000002",
    //           name: "Outfit 2",
    //           created_time: "2020-10-30",
    //           items: [
    //             {
    //               _id: "6423ceeccceaaf521dfe74b6",
    //             },
    //             {
    //               _id: "64237df5ad0c1edddca0f8dc",
    //             }
    //           ]
    //         },
    //       ]
    //     }
    //   ]
    // };
    // return new Promise((resolve, reject) => {
    //   resolve(data);
    // });
    return data;
  }
);

export const fetchUserData = createAsyncThunk("user/fetchUserData",
  async (userId) => {
    if (!userId) return;
    const data = await getUserData(userId);
    const wardrobeData = await getWardrobeItems(userId);
    return { data: data, wardrobeData: wardrobeData };
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
      state.userInfo.data.wardrobe = action.payload.wardrobeData.wardrobe;
      // console.log(state.userInfo.data);
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
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Lấy danh sách font yêu thích và tên cô dâu chú rể
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/favorites?deviceId=${deviceId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể tải danh sách yêu thích");
      }
      return {
        favoriteFonts: data.favoriteFonts || [],
        brideGroomName: data.brideGroomName || "",
        pagination: data.pagination || {}
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thêm font vào danh sách yêu thích
export const addFavoriteFont = createAsyncThunk(
  "favorites/addFavoriteFont",
  async ({ deviceId, font }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ font, deviceId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể thêm font vào danh sách yêu thích");
      }
      return font;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Xóa font khỏi danh sách yêu thích
export const removeFavoriteFont = createAsyncThunk(
  "favorites/removeFavoriteFont",
  async ({ deviceId, font }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ font, deviceId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể xóa font khỏi danh sách yêu thích");
      }
      return font;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cập nhật tên cô dâu chú rể
export const updateBrideGroomName = createAsyncThunk(
  "favorites/updateBrideGroomName",
  async ({ deviceId, brideGroomName }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brideGroomName, deviceId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể cập nhật tên cô dâu chú rể");
      }
      return brideGroomName;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux slice quản lý state font yêu thích và tên cô dâu chú rể
const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favoriteFonts: [],
    brideGroomName: "",
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false
    },
    status: "idle",
    error: null,
  },
  reducers: {
    resetFavorites: (state) => {
      state.favoriteFonts = [];
      state.brideGroomName = "";
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      };
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Đảm bảo không có duplicate fonts
        const uniqueFonts = [...new Set(action.payload?.favoriteFonts || [])];
        state.favoriteFonts = uniqueFonts;
        state.brideGroomName = action.payload?.brideGroomName || "";
        state.pagination = action.payload?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: uniqueFonts.length,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        };
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(addFavoriteFont.fulfilled, (state, action) => {
        // Chỉ thêm nếu font chưa tồn tại
        if (!state.favoriteFonts.includes(action.payload)) {
          state.favoriteFonts.push(action.payload);
          state.pagination.totalItems = state.favoriteFonts.length;
          state.pagination.totalPages = Math.ceil(state.favoriteFonts.length / state.pagination.itemsPerPage);
        }
        toast.success(`Đã thêm ${action.payload} vào danh sách yêu thích`);
      })
      .addCase(addFavoriteFont.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(removeFavoriteFont.fulfilled, (state, action) => {
        state.favoriteFonts = state.favoriteFonts.filter((font) => font !== action.payload);
        state.pagination.totalItems = Math.max(0, state.favoriteFonts.length);
        state.pagination.totalPages = Math.ceil(state.favoriteFonts.length / state.pagination.itemsPerPage);
        toast.info(`Đã xóa ${action.payload} khỏi danh sách yêu thích`);
      })
      .addCase(removeFavoriteFont.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateBrideGroomName.fulfilled, (state, action) => {
        state.brideGroomName = action.payload;
        toast.success("Đã cập nhật tên cô dâu chú rể");
      })
      .addCase(updateBrideGroomName.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
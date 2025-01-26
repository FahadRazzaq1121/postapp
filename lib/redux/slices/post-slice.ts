import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchPosts } from "../../../services/post";
interface AuthorType {
  _id: string;
  name: string;
  email: string;
}

interface PostType {
  _id: string;
  title: string;
  content: string;
  image: string;
  author_id:AuthorType
}

const initialState: { post: PostType[], total: number } = {
  post: [],
  total: 0
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost(state, action) {
      const post = action.payload;
      state.post = post;
    },
    setTotalPost(state, action) {
      const total = action.payload;
      state.total = total
    }
  },
});

export const { setPost, setTotalPost } = postSlice.actions;
export const selectPost = (state: RootState) => state.post.post;
export const selectTotalPost = (state: RootState) => state.post.total;
export default postSlice.reducer;

export function   getPost(page: number, limit: number, search: string) {
  return async (dispatch: Dispatch) => {
    const post = await fetchPosts(page, limit, search);
    dispatch(setPost(post.posts));
    dispatch(setTotalPost(post.totalPosts))
  };
}

import { combineReducers } from "redux";
import userReducer from "./slices/user-slice";
import PostReducer from "./slices/post-slice";
import userProfileReducer from "./slices/userProfile-slice";    

const rootReducer = combineReducers({
    user: userReducer,
    post: PostReducer,
    userProfile: userProfileReducer

});

export default rootReducer;

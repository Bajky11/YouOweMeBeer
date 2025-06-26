import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice"
import appReducer from "./slice/app/appSlice"
import {authApi} from "./api/auth/authApi";
import {tasksApi} from "./api/tasks/tasksApi";
import { groupApi } from "./api/group/groupApi";
import { beerApi } from "./api/beer/beerApi";
import { userApi } from "./api/user/userApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        app: appReducer,
        [authApi.reducerPath]: authApi.reducer,
        [tasksApi.reducerPath]: tasksApi.reducer,
        [groupApi.reducerPath]: groupApi.reducer,
        [beerApi.reducerPath]: beerApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    }, middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(tasksApi.middleware)
        .concat(groupApi.middleware)
        .concat(beerApi.middleware)
        .concat(userApi.middleware),
});
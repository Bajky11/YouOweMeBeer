import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BE_URL = process.env.REACT_APP_API_URL

export const publicFetchBaseQuery = fetchBaseQuery({
    baseUrl: BE_URL,
});

export const authenticatedFetchBaseQuery = fetchBaseQuery({
    baseUrl: BE_URL,
    prepareHeaders: (headers, { getState }) => {
       
        const user = getState().auth.user
    
        if (user) {
            headers.set("X-USER-ID", user.id);
        }
        return headers;
    }
});

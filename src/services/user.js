import { emptySplitApi } from "./emptySplit";

export const userApi = emptySplitApi.injectEndpoints({
  endpoints: builder => ({
    getUserInfo: builder.query({
      query: email => `users/email?value=${email}`,
    }),
  }),
  overrideExisting: true,
});

export const { useGetUserInfoQuery } = userApi;

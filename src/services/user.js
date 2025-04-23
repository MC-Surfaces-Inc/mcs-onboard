import { emptySplitApi } from "./emptySplit";

export const userApi = emptySplitApi.injectEndpoints({
  endpoints: builder => ({
    getUserInfo: builder.query({
      query: email => `users/email?attribute=${email}`,
    }),
  }),
  overrideExisting: true,
});

export const { useGetUserInfoQuery } = userApi;

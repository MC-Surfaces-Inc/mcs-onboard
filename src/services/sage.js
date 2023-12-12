import { emptySplitApi } from "./emptySplit";

export const sageApi = emptySplitApi.injectEndpoints({
  endpoints: builder => ({
    getAllSageClients: builder.query({
      query: () => `sage/clients?company=MCS - TESTING`,
    }),
    getSagePartClasses: builder.query({
      query: () => `sage/partClasses?company=MCS - TESTING`,
    }),
    createSageClient: builder.mutation({
      query: ({ body }) => ({
        url: `sage/clients?company=MCS - TESTING`,
        method: "POST",
        body: body
      })
    })
  }),
  overrideExisting: true,
});

export const {
  useGetAllSageClientsQuery,
  useGetSagePartClassesQuery,
  useCreateSageClientMutation
} = sageApi;

import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedFetchBaseQuery, publicFetchBaseQuery } from '../../configuration';

export const beerApi = createApi({
    reducerPath: 'beerApi',
    baseQuery: authenticatedFetchBaseQuery,
    tagTypes: ['Beers', 'BeerDebts', 'BeersReceived', 'BeersByGroup'],
    endpoints: (builder) => ({
        // GET /api/beers - všechny záznamy o pivech
        getAllBeers: builder.query({
            query: () => '/beers',
            providesTags: ['Beers'],
        }),
        // GET /api/beers/{id} - detail piva
        getBeerById: builder.query({
            query: (id) => `/beers/${id}`,
            providesTags: (result, error, id) => [{ type: 'Beers', id }],
        }),
        // POST /api/beers - vytvoření piva
        createBeer: builder.mutation({
            query: (beer) => ({
                url: '/beers',
                method: 'POST',
                body: beer,
            }),
            invalidatesTags: ['Beers', 'BeerDebts', 'BeersReceived', 'BeersByGroup'],
        }),
        // PUT /api/beers/{id} - update piva
        updateBeer: builder.mutation({
            query: ({ id, ...beer }) => ({
                url: `/beers/${id}`,
                method: 'PUT',
                body: beer,
            }),
            invalidatesTags: (result, error, { id }) => [
                'Beers',
                { type: 'Beers', id },
                'BeerDebts',
                'BeersReceived',
                'BeersByGroup',
            ],
        }),
        // DELETE /api/beers/{id} - smazání piva
        deleteBeer: builder.mutation({
            query: (id) => ({
                url: `/beers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                'Beers',
                { type: 'Beers', id },
                'BeerDebts',
                'BeersReceived',
                'BeersByGroup',
            ],
        }),
        // GET /api/beers/debts/{groupId} - dluhy ve skupině
        getDebtsByGroup: builder.query({
            query: (groupId) => `/beers/debts/${groupId}`,
            providesTags: ['BeerDebts'],
        }),
        // GET /api/beers/received/{groupId} - kolik kdo dostal piv
        getTotalBeersReceivedByUser: builder.query({
            query: (groupId) => `/beers/received/${groupId}`,
            providesTags: ['BeersReceived'],
        }),
        // GET /api/beers/group/{groupId} - všechna piva pro skupinu
        getBeersByGroupId: builder.query({
            query: (groupId) => `/beers/group/${groupId}`,
            providesTags: ['BeersByGroup'],
        }),
    }),
});

export const {
    useGetAllBeersQuery,
    useGetBeerByIdQuery,
    useCreateBeerMutation,
    useUpdateBeerMutation,
    useDeleteBeerMutation,
    useGetDebtsByGroupQuery,
    useGetTotalBeersReceivedByUserQuery,
    useGetBeersByGroupIdQuery,
} = beerApi;

/*
  const { data: beers, isLoading, error } = useGetAllBeersQuery();
  if (isLoading) return <p>Načítání...</p>;
  if (error) return <p>Chyba při načítání</p>;

  const { data: beer, isLoading: beerLoading, error: beerError } = useGetBeerByIdQuery(1);
  if (beerLoading) return <p>Načítání detailu...</p>;
  if (beerError) return <p>Chyba při načítání detailu</p>;

  const [createBeer] = useCreateBeerMutation();
  const handleCreate = async () => {
    await createBeer({
      group: { id: 1 },
      fromUser: { id: 2 },
      toUser: { id: 3 },
      count: 1,
      createdAt: "2025-06-24T12:00:00"
    });
  };

  const [updateBeer] = useUpdateBeerMutation();
  () => updateBeer({ id: 1, count: 2 });

  const [deleteBeer] = useDeleteBeerMutation();
  () => deleteBeer(1);

  const { data: debts, isLoading: debtsLoading } = useGetDebtsByGroupQuery(1);
  const { data: received, isLoading: receivedLoading } = useGetTotalBeersReceivedByUserQuery(1);
  const { data: beersByGroup, isLoading: beersByGroupLoading } = useGetBeersByGroupIdQuery(1);
*/

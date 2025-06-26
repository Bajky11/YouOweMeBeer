import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedFetchBaseQuery, publicFetchBaseQuery } from '../../configuration';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: authenticatedFetchBaseQuery,
    tagTypes: ['Users', 'UserDetail', 'CurrentUser'],
    endpoints: (builder) => ({
        // GET /api/users - všichni uživatelé
        getAllUsers: builder.query({
            query: () => '/users',
            providesTags: ['Users'],
        }),
        // GET /api/users/{id} - detail uživatele
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'UserDetail', id }],
        }),
        // POST /api/users - vytvoření uživatele
        createUser: builder.mutation({
            query: (user) => ({
                url: '/users',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),
        // PUT /api/users/{id} - update uživatele
        updateUser: builder.mutation({
            query: ({ id, ...user }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: (result, error, { id }) => [
                'Users',
                { type: 'UserDetail', id },
            ],
        }),
        // DELETE /api/users/{id} - smazání uživatele
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                'Users',
                { type: 'UserDetail', id },
            ],
        }),
        // GET /api/users/me - aktuální uživatel
        getCurrentUser: builder.query({
            query: () => '/users/me',
            providesTags: ['CurrentUser'],
        }),
        // GET /api/users/username/{username} - detail uživatele podle username
        getUserByUsername: builder.query({
            query: (username) => `/users/username/${username}`,
            providesTags: (result, error, username) => [{ type: 'UserDetail', id: username }],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetCurrentUserQuery,
    useGetUserByUsernameQuery, // přidán export hooku
} = userApi;

/*
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  if (isLoading) return <p>Načítání...</p>;
  if (error) return <p>Chyba při načítání</p>;

  const { data: user, isLoading: userLoading, error: userError } = useGetUserByIdQuery(1);
  if (userLoading) return <p>Načítání detailu...</p>;
  if (userError) return <p>Chyba při načítání detailu</p>;

  const [createUser] = useCreateUserMutation();
  const handleCreate = async () => {
    await createUser({ username: "petr" });
  };

  const [updateUser] = useUpdateUserMutation();
  () => updateUser({ id: 1, username: "novyuzivatel" });

  const [deleteUser] = useDeleteUserMutation();
  () => deleteUser(1);

  const { data: currentUser, isLoading: currentUserLoading } = useGetCurrentUserQuery();

  const { data: userByUsername, isLoading: userByUsernameLoading, error: userByUsernameError } = useGetUserByUsernameQuery("petr");
  if (userByUsernameLoading) return <p>Načítání uživatele podle username...</p>;
  if (userByUsernameError) return <p>Chyba při načítání uživatele podle username</p>;
*/

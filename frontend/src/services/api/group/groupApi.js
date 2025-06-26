import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedFetchBaseQuery, publicFetchBaseQuery } from '../../configuration';

export const groupApi = createApi({
    reducerPath: 'groupApi',
    baseQuery: authenticatedFetchBaseQuery,
    tagTypes: ['Groups', 'GroupDetail', 'MyGroups'],
    endpoints: (builder) => ({
        // GET /api/groups - všechny skupiny
        getAllGroups: builder.query({
            query: () => '/groups',
            providesTags: ['Groups'],
        }),
        // GET /api/groups/{id} - detail skupiny
        getGroupById: builder.query({
            query: (id) => `/groups/${id}`,
            providesTags: (result, error, id) => [{ type: 'GroupDetail', id }],
        }),
        // POST /api/groups - vytvoření skupiny
        createGroup: builder.mutation({
            query: (group) => ({
                url: '/groups',
                method: 'POST',
                body: group,
            }),
            invalidatesTags: ['Groups', 'MyGroups'],
        }),
        // PUT /api/groups/{id} - update skupiny
        updateGroup: builder.mutation({
            query: ({ id, ...group }) => ({
                url: `/groups/${id}`,
                method: 'PUT',
                body: group,
            }),
            invalidatesTags: (result, error, { id }) => [
                'Groups',
                { type: 'GroupDetail', id },
                'MyGroups',
            ],
        }),
        // DELETE /api/groups/{id} - smazání skupiny
        deleteGroup: builder.mutation({
            query: (id) => ({
                url: `/groups/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                'Groups',
                { type: 'GroupDetail', id },
                'MyGroups',
            ],
        }),
        // POST /api/groups/{groupId}/add-user - přidání uživatele do skupiny
        addUserToGroup: builder.mutation({
            query: (groupId) => ({
                url: `/groups/${groupId}/add-user`,
                method: 'POST',
            }),
            invalidatesTags: ['Groups', 'GroupDetail', 'MyGroups'],
        }),
        // DELETE /api/groups/{groupId}/remove-user?userId=2 - odebrání uživatele ze skupiny
        removeUserFromGroup: builder.mutation({
            query: ({ groupId, userId }) => ({
                url: `/groups/${groupId}/remove-user?userId=${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Groups', 'GroupDetail', 'MyGroups'],
        }),
        // GET /api/groups/my - skupiny aktuálního uživatele
        getMyGroups: builder.query({
            query: () => '/groups/my',
            providesTags: ['MyGroups'],
        }),
    }),
});

export const {
    useGetAllGroupsQuery,
    useGetGroupByIdQuery,
    useCreateGroupMutation,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
    useAddUserToGroupMutation,
    useRemoveUserFromGroupMutation,
    useGetMyGroupsQuery,
} = groupApi;

/*
  const { data: groups, isLoading, error } = useGetAllGroupsQuery();
  if (isLoading) return <p>Načítání...</p>;
  if (error) return <p>Chyba při načítání</p>;

  const { data: group, isLoading: groupLoading, error: groupError } = useGetGroupByIdQuery(1);
  if (groupLoading) return <p>Načítání detailu...</p>;
  if (groupError) return <p>Chyba při načítání detailu</p>;

  const [createGroup] = useCreateGroupMutation();
  const handleCreate = async () => {
    await createGroup({ name: "Pivní parta" });
  };

  const [updateGroup] = useUpdateGroupMutation();
  () => updateGroup({ id: 1, name: "Nový název" });

  const [deleteGroup] = useDeleteGroupMutation();
  () => deleteGroup(1);

  const [addUserToGroup] = useAddUserToGroupMutation();
  () => addUserToGroup(1);

  const [removeUserFromGroup] = useRemoveUserFromGroupMutation();
  () => removeUserFromGroup({ groupId: 1, userId: 2 });

  const { data: myGroups, isLoading: myGroupsLoading } = useGetMyGroupsQuery();
*/

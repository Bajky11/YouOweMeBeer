import {createApi} from '@reduxjs/toolkit/query/react';
import {publicFetchBaseQuery} from "../../configuration";

export const tasksApi = createApi({
    reducerPath: 'tasksApi',
    baseQuery: publicFetchBaseQuery,
    tagTypes: ['Tasks', 'Summary', 'ActiveTask'],
    endpoints: (builder) => ({
        // ✅ Získání seznamu úkolů
        getTasks: builder.query({
            query: ({filter} = {}) => {
                let queryString = '';
                if (filter === "week") queryString = '?week=true';
                if (filter === "month") queryString = '?month=true';
                if (filter === "year") queryString = '?year=true';
                return `/tasks${queryString}`;
            },
            providesTags: ['Tasks', 'ActiveTask', 'Summary'],
        }),

        // ✅ Získání aktivního úkolu
        getActiveTask: builder.query({
            query: () => '/tasks/active',
            providesTags: ['ActiveTask'],
        }),

        // ✅ Vytvoření úkolu
        createTask: builder.mutation({
            query: (task) => ({
                url: '/tasks',
                method: 'POST',
                body: task,
            }),
            invalidatesTags: ['Tasks', 'Summary', 'ActiveTask'],
        }),

        // ✅ Odstranění úkolu
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Tasks', 'Summary', 'ActiveTask'],
        }),

        // ✅ Spuštění úkolu
        startTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}/start`,
                method: 'POST',
            }),
            invalidatesTags: ['Tasks', 'ActiveTask'],
        }),

        // ✅ Pozastavení úkolu
        pauseTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}/pause`,
                method: 'POST',
            }),
            invalidatesTags: ['Tasks', 'ActiveTask'],
        }),

        // ✅ Dokončení úkolu
        completeTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}/complete`,
                method: 'POST',
            }),
            invalidatesTags: ['Tasks', 'ActiveTask', 'Summary'],
        }),

        // ✅ Úprava totalTime a earnings
        adjustTaskTime: builder.mutation({
            query: ({id, timeAdjustment}) => ({
                url: `/tasks/${id}/adjust-time?timeAdjustment=${timeAdjustment}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Tasks', 'Summary'],
        }),

        // ✅ Získání souhrnných statistik
        getTaskSummary: builder.query({
            query: ({filter} = {}) => {
                let queryString = '';
                if (filter === "week") queryString = '?week=true';
                if (filter === "month") queryString = '?month=true';
                if (filter === "year") queryString = '?year=true';
                return `/tasks/summary${queryString}`;
            },
            providesTags: ['Summary'],
        }),
        updateTaskTotalTime: builder.mutation({
            query: ({id, newTotalTime}) => ({
                url: `/tasks/${id}/set-time?newTotalTime=${newTotalTime}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Tasks', 'Summary'],
        })
    }),
});

// ✅ Export jednotlivých hooků pro komponenty
export const {
    useGetTasksQuery,
    useGetActiveTaskQuery,
    useCreateTaskMutation,
    useDeleteTaskMutation,
    useStartTaskMutation,
    usePauseTaskMutation,
    useCompleteTaskMutation,
    useAdjustTaskTimeMutation,
    useGetTaskSummaryQuery,
    useUpdateTaskTotalTimeMutation,
} = tasksApi;

/*
  const { data: tasks, isLoading, error } = useGetTasksQuery({ month: true });
  if (isLoading) return <p>Načítání...</p>;
  if (error) return <p>Chyba při načítání</p>;



  const { data: task, isLoading, error } = useGetActiveTaskQuery();
  if (isLoading) return <p>Načítání...</p>;
  if (error) return <p>Žádný aktivní úkol</p>;



  const [createTask] = useCreateTaskMutation();
  const handleCreate = async () => {
    await createTask({
      name: "Nový úkol",
      hourlyRate: 500,
      tag: "work",
      status: "RUNNING"
    });
  };



  const [deleteTask] = useDeleteTaskMutation();
  () => deleteTask(taskId)



  const [startTask] = useStartTaskMutation();
  const [pauseTask] = usePauseTaskMutation();
  const [completeTask] = useCompleteTaskMutation();
  () => startTask(taskId)



  const [adjustTaskTime] = useAdjustTaskTimeMutation();
  () => adjustTaskTime({ id: taskId, timeAdjustment: 300 })



  const { data, isLoading, error } = useGetTaskSummaryQuery({ month: true });
  if (isLoading) return <p>Načítání...</p>;
  if (error) return <p>Chyba při načítání</p>;

 */
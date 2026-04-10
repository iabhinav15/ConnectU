// this is for the RTK Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getUser = () => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://localhost:8800", 
    prepareHeaders: (headers) => {
      const token = getUser().token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 

  tagTypes: ['Post'],

  endpoints: (builder) => ({

    fetchPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
    }),

    fetchComments: builder.query({
      query: (id) => "/posts/comments/" + id,
    }),

    handleLike: builder.mutation({
      query: (url) => ({
        url: `${url}`,
        method: 'POST',
        // headers: {
        //   "content-type": "application/json",
        //   Authorization: token ? `Bearer ${token}` : '',
        // },
      }),
      invalidatesTags: ['Post'],
      async onQueryStarted ( url , { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('fetchPosts', undefined, (draft) => {
            const post = draft?.data.find((post) => post._id === url.split('/')[3]);
            if (post) {
              const userId = getUser()._id;
              if(post.likes.includes(userId)) {
                post.likes = post.likes.filter((id) => id !== userId);
              } else {
                post.likes.push(userId);
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback in case of failure
          patchResult.undo();
        }
      },
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
    }),

    getUserInfo: builder.query({
      query: (id) => `/users/get-user/${id}`,
    }),
  }),
});

export const { useFetchPostsQuery, useFetchCommentsQuery, useHandleLikeMutation, useDeletePostMutation, useGetUserInfoQuery } = apiSlice;


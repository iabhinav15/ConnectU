import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserType } from './userSlice';

const getUser = (): UserType | null => {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8800",
        prepareHeaders: (headers) => {
            const user = getUser();
            if (user && user.token) {
                headers.set('Authorization', `Bearer ${user.token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Post'],
    endpoints: (builder) => ({
        fetchPosts: builder.query<any, void>({
            query: () => '/posts',
            providesTags: ['Post'],
        }),
        fetchComments: builder.query<any, string>({
            query: (id) => "/posts/comments/" + id,
        }),
        handleLike: builder.mutation<any, string>({
            query: (url) => ({
                url: `${url}`,
                method: 'POST',
            }),
            invalidatesTags: ['Post'],
            async onQueryStarted(url, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('fetchPosts', undefined, (draft: any) => {
                        const splits = url.split('/');
                        const postId = splits[3]; // assuming URL format matches
                        const post = draft?.data?.find((post: any) => post._id === postId);
                        if (post) {
                            const user = getUser();
                            if (user) {
                                const userId = user._id;
                                if (post.likes.includes(userId)) {
                                    post.likes = post.likes.filter((id: string) => id !== userId);
                                } else {
                                    post.likes.push(userId);
                                }
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deletePost: builder.mutation<any, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
            }),
        }),
        getUserInfo: builder.query<any, string>({
            query: (id) => `/users/get-user/${id}`,
        }),
    }),
});

export const { useFetchPostsQuery, useFetchCommentsQuery, useHandleLikeMutation, useDeletePostMutation, useGetUserInfoQuery } = apiSlice;

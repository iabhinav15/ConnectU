import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FriendsCard, Loading, PostCard, ProfileCard, TopBar } from '../components';
import { deletePost, fetchPosts, getUserInfo, likePost, viewUserProfile } from '../utils';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const Profile = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const [userInfo, setUserInfo] = useState<any>(user);
    const { posts } = useAppSelector(state => state.posts);
    const [loading, setLoading] = useState(false);

    const uri = "/posts/get-user-post/" + id;

    const getUser = async () => {
        if (!user || (!user.token && !id)) return;
        if (!id) return;
        const res = await getUserInfo(user.token as string, id as string);
        setUserInfo(res);
    }
    const getPosts = async () => {
        if (!user || user.token === undefined) return;
        await fetchPosts(user.token, dispatch, uri);
        setLoading(false);
    }
    const handleDelete = async (postId: string) => {
        if (!user || user.token === undefined) return;
        await deletePost(postId, user.token);
        await getPosts();
    };
    const handleLikePost = async (uriLike: string) => {
        if (!user || user.token === undefined) return;
        await likePost({ uri: uriLike, token: user.token });
        await getPosts();
    };

    const profileView = async () => {
        if (!id) return;
        if (user && id !== user._id) {
            await viewUserProfile(user?.token as string, id as string);
        }
    }

    useEffect(() => {
        setLoading(true);
        getUser();
        getPosts();
        profileView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <>
            <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden '>
                <TopBar />
                <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                    {/* LEFT */}
                    <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto '>
                        <ProfileCard user={userInfo} />
                        {/* <div className='block lg:hidden'>
            <FriendsCard friends={userInfo?.friends} />
          </div> */}
                    </div>
                    {/* CENTER */}
                    <div className='flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
                        {/* yaha sirf tumhara post aayega kyon ki tumhara profile hai */}
                        {
                            loading ? (<Loading />) : (posts && posts.length > 0) ? (
                                posts.map((post: any) => (<PostCard key={post?._id} post={post} user={user} deletePost={handleDelete} likePost={handleLikePost} />))) : (
                                <div className='w-full flex items-center justify-center'>
                                    <p className='text-lg text-ascent-1'>No Post Yet</p>
                                </div>)
                        }
                    </div>
                    {/* RIGHT */}
                    <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
                        <FriendsCard friends={userInfo?.friends} handleRemoveFriend={()=>{}} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;
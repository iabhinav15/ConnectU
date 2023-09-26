import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FriendsCard, Loading, PostCard, ProfileCard, TopBar } from '../components';
import { posts } from '../assets/data';

const Profile = () => {
  const {id} = useParams();
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch(); 
  const [userInfo, setUserInfo] = useState(user);
  // const {posts} = useSelector(state => state.posts);
  const [loading, setLoading] = useState(false);
  const handleDelete = () => {};
  const handleLikePost = () => {};
  return (
    <>
    <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden '>
      <TopBar/>
      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
        {/* LEFT */}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto '>
          <ProfileCard user={userInfo} />
          <div className='block lg:hidden'>
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
        {/* CENTER */}
        <div className='flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto'>
          {/* yaha sirf tumhara post aayega na kyon ki tumhara profile hai */}
          {
            loading ? (<Loading />) : posts?.length > 0 ? (
              posts?.map((post) => ( <PostCard key={post?._id} post={post} user={user} deletePost={handleDelete} likePost={handleLikePost} /> ))) : (
                <div className='w-full flex items-center justify-center'>
                  <p className='text-lg text-ascent-1'>No Post Yet</p>
                </div>)
          }
          </div>
        {/* RIGHT */}
        <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
          <FriendsCard friends={userInfo?.friends} />
        </div>
      </div>
    </div> 
    </>
  )
}

export default Profile;
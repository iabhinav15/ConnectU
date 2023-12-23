import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {CustomButton, Loading, TextInput, TopBar, ProfileCard, FriendsCard, PostCard, EditProfile, ConfirmAction } from '../components'
import { Link } from 'react-router-dom'
import { NoProfile } from '../assets'
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs'
import { BiImages, BiSolidVideo } from 'react-icons/bi'
import { useForm } from 'react-hook-form'
import { apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, likePost, sendFriendRequest } from '../utils'
import { AddFriend, UserLogin } from '../redux/userSlice'


const Home = () => {
  const {user, edit} = useSelector(state => state.user);
  const {posts} = useSelector(state => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [friendRequestsent, setFriendRequestsent] = useState([]);
  const [suggestedFriends, setsuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const dispatch = useDispatch();
  const { register, reset, handleSubmit, formState: { errors }, setError } = useForm();

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setErrMsg("");
    try {
      const uri = file && (await handleFileUpload(file));
      const description = data?.description.trim();
      
      if(description === "" && !uri){
        setPosting(false);
        setError("description", {message:"You can not go empty🗑", type:"validate"})
        return;
      } 
      const newData = uri ? { description, image: uri }: {description};

      const res = await apiRequest({
        url: "/posts/create-post",
        data: newData,
        method: "POST",
        token: user?.token,
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else{
        reset({
          description: "",
        })
        setFile(null);
        setErrMsg("");
        await fetchPost();
      }
      setPosting(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };

  const handleLikePost = async (uri) => {
    await likePost({uri: uri, token: user?.token});
    await fetchPost();
  };

  const confirmDelete = async (status) => {
    setShowModal(false);
    if(status){
      await deletePost(postIdToDelete, user.token);
      await fetchPost();
      // alert("Post deleted");
    }
  };
  
  const handleDelete = (id) => {
    setShowModal(true);
    setPostIdToDelete(id);
  }; 

  const closeModal = () => {
    setShowModal(false);
  };
  
  const fetchFriendRequests = async () => {
    try {
      const res = await apiRequest({
        url: "/users/get-friend-request",
        token: user?.token,
        method: "POST",
      });
      setFriendRequest(res?.dataRec);
      setFriendRequestsent(res?.dataSent);
    } catch (error) {
      console.log(error)
    }
  };
 
  const fetchSuggestedFriends = async () => {
    try {
      const res = await apiRequest({
        url: "/users/suggested-friends",
        token: user?.token,
        method: "POST",
      });
      setsuggestedFriends(res?.data);
    } catch (error) {
      console.log(error)
    }
  };
  
  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
      await fetchSuggestedFriends();
      alert("friend request sent");
    } catch (error) {
      console.log(error.message);
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        url: "/users/accept-request",
        token: user?.token,
        method: "POST",
        data: {rid: id, status },
      });
      setFriendRequest(res?.data);
      if(status !== 'Denied'){
        dispatch(AddFriend(res?.friend));
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const removeSentrequest = async (id) => {
    try {
      const res = await apiRequest({
        url: "/users/remove-sentrequest",
        token: user?.token,
        method: "POST",
        data: {rid: id},
      });
      setFriendRequestsent(res?.data);
      // fetchSuggestedFriends();
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    const res = await getUserInfo(user?.token);
    const newData =  {token: user?.token, ...res}
    dispatch(UserLogin(newData));
  };

  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
    fetchFriendRequests();
    fetchSuggestedFriends();
    setLoading(false);
  }, []);

  return (
    <>
    <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden '>
      <TopBar/>
      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
        {/* LEFT */}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto '>
          <ProfileCard user={user}/>
          <FriendsCard friends={user?.friends}/>
        </div>
        {/* CENTER */}
        <div className='h-full flex-1 px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
          <form onSubmit={handleSubmit(handlePostSubmit)} 
          className='bg-primary px-4 rounded-lg'>   
            <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
              <img src={user?.profileUrl ?? NoProfile} alt="" className='w-14 h-14 rounded-full object-cover' />
              <TextInput styles='w-full rounded-full py-5' placeholder="What's on your mind..." name='description' register={
                register( 'description', {required: false})} 
                error={errors.description?.message}
              /> 
            </div>
            {
              file && <img src={URL.createObjectURL(file)} alt="media" className='m-auto mt-2' />
            }
            {
              errMsg?.message && <span role='alert' className={`text-sm ${errMsg?.status === "failed" ? "text-[#f64949f3]" : "text:[#2ba150fe]"} mt-0.5`} >{errMsg?.message}</span>
            }
            <div className='flex items-center justify-between py-4'>
              <label htmlFor="imgUpload" className='flex items-center gap-1 text-base text-ascent-2  hover:text-ascent-1 cursor-pointer'>
                <input type="file" id="imgUpload" className='hidden' onChange={(e)=>setFile(e.target.files[0])}  data-max-size='5120' accept='.jpg, .png, .jpeg'/>
                <BiImages />
                <span>Image</span>
              </label>

              <label className='flex items-center gap-1 text-base text-ascent-2  hover:text-ascent-1 cursor-pointer' htmlFor='videoUpload'>
                <input type="file" id="videoUpload" className='hidden' onChange={(e)=>setFile(e.target.files[0])}  data-max-size='5120' accept='.mp4, .mkv, .avi, .wav'/>
                <BiSolidVideo />
                <span>Video</span>
              </label>

              <label className='flex items-center gap-1 text-base text-ascent-2  hover:text-ascent-1 cursor-pointer' htmlFor='vgifoUpload'>
                <input type="file" id="vgifoUpload" className='hidden' onChange={(e)=>setFile(e.target.files[0])}  data-max-size='5120' accept='.gif'/>
                <BsFiletypeGif />
                <span>Gif</span>
              </label>
              <div>
                {
                  posting? (<Loading />) :( <CustomButton type='submit' title='Post' containerStyles='bg-[#0444a4] text-sm text-white px-6 py-1 rounded-full font-semibold' />)
                }
              </div>
            </div>
          </form>
          {
            loading ? (<Loading />) : posts?.length > 0 ? (
              posts?.map((post) => (  <PostCard key={post?._id} post={post} user={user} deletePost={handleDelete} likePost={handleLikePost} /> ))) : (
                <div className='w-full flex items-center justify-center'>
                  <p className='text-lg text-ascent-1'>No Post Yet</p>
                </div>)
          }
        </div>
        {/* RIGHT */}
        <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
         {/* FRIEND REQUEST RECEIVED*/}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Request Received</span>
                <span>{friendRequest?.length}</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {
                  friendRequest?.map(({ _id, requestFrom: from } ) =>(
                    <div key={_id} className='flex items-center justify-between'>
                      <Link to={`/profile/${from._id}`} className='w-full flex  items-center cursor-pointer gap-4'>
                        <img src={from?.profileUrl ?? NoProfile} alt="" className='w-10 h-10 rounded-full object-cover'/>
                        <div className='flex-1'>
                          <p className='text-base font-medium text-ascent-1'>
                            {from?.firstName} {from?.lastName}
                          </p>
                          <span className='text-sm text-ascent-2'>
                            {from?.profession ?? 'No Profession'}
                          </span>
                        </div>
                      </Link>
                      <div className='flex gap-1'>
                        <CustomButton 
                          title='Accept' onClick={()=> acceptFriendRequest(_id, "Accepted")} containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                        />
                        <CustomButton 
                          title='Deny' onClick={()=> acceptFriendRequest(_id, "Denied")} containerStyles='border border-[#666]  text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          {/* FRIEND REQUEST SENT*/}  
          <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Request Sent</span>
                <span>{friendRequestsent?.length}</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {
                  friendRequestsent?.map(({ _id, requestTo: to } ) =>(
                    <div key={_id} className='flex items-center justify-between'>
                      <Link to={`/profile/${to._id}`} className='w-full flex  items-center cursor-pointer gap-4'>
                        <img src={to?.profileUrl ?? NoProfile} alt="" className='w-10 h-10 rounded-full object-cover'/>
                        <div className='flex-1'>
                          <p className='text-base font-medium text-ascent-1'>
                            {to?.firstName} {to?.lastName}
                          </p>
                          <span className='text-sm text-ascent-2'>
                            {to?.profession ?? 'No Profession'}
                          </span>
                        </div>
                      </Link>
                      {/* there will be a button here which will cancel the request */}
                      <div className='flex gap-1'>
                        <CustomButton 
                          title='remove' onClick={()=> {removeSentrequest(_id)}} containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {
                  suggestedFriends?.map((friend) =>(
                    <div key={friend?._id} className='flex items-center justify-between'>
                      <Link to={`/profile/${friend?._id}`}  key={friend?._id} className='w-full flex items-center cursor-pointer gap-4'>
                        <img src={friend?.profileUrl ?? NoProfile} alt={friend?.firstName} className='w-10 h-10 object-cover rounded-full' />
                        <div className='flex-1'>
                          <p className='text-base font-medium text-ascent-1'>
                            {friend?.firstName} {friend?.lastName}
                          </p>
                          <span className='text-sm text-ascent-2'>
                            {friend?.profession ?? "No Profession"}
                          </span>
                        </div>
                      </Link>
                      <div className='flex gap-1'>
                        <button className='text-sm text-white p-1 rounded bg-[#0444a430]' onClick={()=>handleFriendRequest(friend?._id)}>
                          <BsPersonFillAdd title='send friend request' size={20} className='text-[#0f52b6]'/>
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
    { edit && <EditProfile />}
    { showModal && <ConfirmAction closeModal={closeModal} confirmDelete={confirmDelete} />}
    </>
  )
}

export default Home;
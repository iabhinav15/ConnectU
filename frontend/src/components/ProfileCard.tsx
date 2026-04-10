import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import { UpdateProfile } from '../redux/userSlice';
import { LiaEditSolid } from 'react-icons/lia';
import { BsBriefcase, BsInstagram, BsPersonFillAdd, BsFacebook } from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';
import { FaTwitterSquare } from 'react-icons/fa';
import moment from 'moment';
import AddSocialLink from './AddSocialLink';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const ProfileCard = ({ user }: { user: any }) => {
    const { user: data } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const addLink = () => {
        setOpen(true);
    }
    const closeModal = () => {
        setOpen(false);
    }

    return (
        <>
            <div>
                <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
                    <div className='w-full flex items-center justify-between border-b pb-5 border-[#66666645]'>
                        <Link to={'/profile/' + user?._id} className='flex gap-2'>
                            <img src={user?.profileUrl ?? NoProfile} alt={user?.email} className='h-14 w-14 rounded-full object-cover' />

                            <div className='flex flex-col justify-center'>
                                <p className='text-lg font-medium text-ascent-1'>
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <span className='text-ascent-2'>
                                    {user?.profession ?? 'No Profession'}
                                </span>
                            </div>
                        </Link>

                        <div>
                            {user?._id === data?._id ? (
                                <LiaEditSolid title='Edit Profile' size={20}
                                    className='cursor-pointer text-blue' onClick={() => dispatch(UpdateProfile(true))} />
                            ) : (
                                <button className='text-sm text-white p-1 rounded bg-[#0444a430]' onClick={() => { }}>
                                    <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-2 border-b py-4 border-[#66666645]'>
                        <div className='flex gap-2 items-center text-ascent-2 '>
                            <CiLocationOn className='text-xl text-ascent-1' />
                            <span>
                                {user?.location ?? 'Add Location'}
                            </span>
                        </div>
                        <div className='flex gap-2 items-center text-ascent-2 '>
                            <BsBriefcase className='text-lg text-ascent-1' />
                            <span>
                                {user?.profession ?? 'Add profession'}
                            </span>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645]'>
                        <p className='text-xl font-semibold text-ascent-1'>
                            {user?.friends?.length ?? 0} Friends
                        </p>
                        <div className='flex items-center justify-between'>
                            <span className='text-ascent-2'>Who viewed your profile</span>
                            <span className='text-ascent-1 text-lg'>{user?.views?.length}</span>
                        </div>
                        <span className='text-base text-blue'>{user?.verified ? "Verified Account" : "Not Verified"}</span>
                        <div className='flex items-center justify-between'>
                            <span className='text-ascent-2'>Joined</span>
                            <span className='text-ascent-1 text-base'>
                                {moment(user?.createdAt).fromNow()}
                            </span>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-4 py-4 pb-6 '>
                        <p className='text-ascent-1 text-lg font-semibold'>Add Links</p>
                        <div className='flex items-center gap-2 text-ascent-2'>
                            <BsInstagram className='text-xl text-ascent-1' />
                            <span>Instagram</span>
                            <button className='text-ascent-1 text-base ml-auto' onClick={addLink}>Add </button>
                        </div>
                        <div className='flex gap-2 items-center text-ascent-2'>
                            <FaTwitterSquare className='text-xl text-ascent-1' />
                            <span>Twitter</span>
                            <button className='text-ascent-1 text-base ml-auto'>Add </button>
                        </div>
                        <div className='flex gap-2 items-center text-ascent-2'>
                            <BsFacebook className='text-xl text-ascent-1' />
                            <span>Facebook</span>
                            <button className='text-ascent-1 text-base ml-auto'>Add </button>
                        </div>
                    </div>
                </div>
            </div>
            {
                open && <AddSocialLink closeModal={closeModal} />
            }
        </>
    )
}

export default ProfileCard;
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { NoProfile } from '../assets'
import { BsPersonFillDash } from 'react-icons/bs'
import { useAppSelector } from '../redux/hooks'
// import { UserType } from '../redux/userSlice' // assuming exported

const FriendsCard = ({ friends, handleRemoveFriend }: { friends: any[], handleRemoveFriend: (id: string) => void }) => {
    const { id } = useParams();
    const { user } = useAppSelector(state => state.user)

    return (
        <div>
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
                <div className='flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]'>
                    <span>Friends</span>
                    <span>{friends?.length}</span>
                </div>
                <div className='w-full flex flex-col gap-4 pt-4'>
                    {friends?.map((friend: any) => {
                        return (
                            <div key={friend?._id} className='flex items-center justify-between'>
                                <Link to={`/profile/${friend?._id}`} className='w-full flex items-center gap-4 cursor-pointer' >
                                    <img src={friend?.profileUrl ?? NoProfile} alt={friend?.firstName} className='w-10 h-10 rounded-full object-cover' />
                                    <div className='flex-1'>
                                        <p className='text-base font-medium text-ascent-1'>{friend?.firstName} {friend?.lastName}</p>
                                        <span className='text-sm text-ascent-2'>{friend?.profession ?? "NoProfession"}</span>
                                    </div>
                                </Link>
                                <div className='flex gap-1'>
                                    {
                                        user?._id === id ? <button className='text-sm text-white p-1 rounded bg-[#0444a430]' onClick={() => handleRemoveFriend(friend._id)}>
                                            <BsPersonFillDash title='Remove friend' size={20} className='text-[#0f52b6]' />
                                        </button> : null
                                    }
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    )
}

export default FriendsCard
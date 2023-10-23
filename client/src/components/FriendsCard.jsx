import React from 'react'
import { Link } from 'react-router-dom'
import { NoProfile } from '../assets'
import { BsPersonFillDash } from 'react-icons/bs'

const FriendsCard = ({friends}) => {

  const handleRemoveFriend = () => {
    // console.log('friend removed');
    // alert("It does not work as of now, Work in progress")
    
  }

  return (
    <div>
      <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
        <div className='flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]'>
          <span>Friends</span>
          <span>{friends?.length}</span>
        </div>
        <div className='w-full flex flex-col gap-4 pt-4'>
          {friends?.map(friend => (
            <div key={friend?._id} className='flex items-center justify-between'>
              <Link to={`/profile/${friend?._id}`} className='w-full flex items-center gap-4 cursor-pointer' >
              <img src={friend?.profileUrl ?? NoProfile} alt={friend?.firstName} className='w-10 h-10 rounded-full object-cover'/>
              <div className='flex-1'>
                <p className='text-base font-medium text-ascent-1'>{friend?.firstName} {friend?.lastName}</p>
                <span className='text-sm text-ascent-2'>{friend?.profession ?? "NoProfession"}</span>
              </div>
              </Link>
              <div className='flex gap-1'>
                <button className='text-sm text-white p-1 rounded bg-[#0444a430]' onClick={handleRemoveFriend}>
                  <BsPersonFillDash size={20} className='text-[#0f52b6]'/>
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

export default FriendsCard
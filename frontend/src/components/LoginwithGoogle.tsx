import React from 'react'
import { getGoogleOAuthURL } from '../utils/getGoogleOAuthURL'
import { googleLogo } from '../assets'

const LoginwithGoogle: React.FC<{ type: string }> = ({ type }) => {

  return (
    <div>
      <a className="inline-flex items-center text-base justify-center rounded-md bg-white px-6 py-2 font-medium text-black outline-none border-[2px] border-solid" href={getGoogleOAuthURL()}>
        {
          type === "Login" ? "Login With Google" : "SignUp With Google"
        }
        <img src={googleLogo} className='w-8 h-8 ml-[0.7rem] rounded-[50%] object-cover' alt="" />
      </a>
    </div>
  )
}

export default LoginwithGoogle
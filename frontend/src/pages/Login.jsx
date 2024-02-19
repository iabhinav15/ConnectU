import React, {useEffect, useState} from 'react'
import { TbSocial } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { TextInput, Loading, CustomButton, LoginwithGoogle } from '../components'
import { BgImage } from '../assets'
import { BsShare } from 'react-icons/bs'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { ImConnection } from 'react-icons/im'
import { AiOutlineInteraction } from 'react-icons/ai'
import { apiRequest } from '../utils'
import { UserLogin } from '../redux/userSlice'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({mode:'onChange'});
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    alert("Use this to login:- email: yabhinav@gmail.com, password: 123456")
  },[])

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: '/auth/login',
        data: data,
        method: 'POST',
      })

      if(res?.status === 'failed'){
        setErrMsg(res);
      } else{
        setErrMsg("");
        const newData = { token: res?.token, ...res?.user };
        // dispatch({ type: 'LOGIN', payload: newData });
        dispatch(UserLogin(newData));
        window.location.replace('/');
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center'>
          <div className='w-full flex gap-2 items-center mb-4'>
            <div className='p-2 bg-[#065ad8] rounded text-white'>
              <TbSocial />
            </div>
            <span className='text-2xl text-[#065ad8] font-semibold'>ConnectU</span>
          </div>
          <p className='text-ascent-1 text-base font-semibold'>Log in to your account</p>
          <span className='text-sm mt-2 text-ascent-2'>
            welcome back
          </span>
          <form className='py-6 flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              name='email' placeholder='email@example.com' type='email'
              label='Email Address' register={ register('email', {required: 'Email is required!'})} 
              error={errors.email? errors.email.message : ""}
              styles='w-full rounded-full'
              labelStyles='ml-2'
            />
            <div className='relative flex items-center gap-2'>
              <TextInput
                name='password' placeholder='password' type={isPasswordVisible ? 'text' : 'password'}
                label='password' register={ register('password', {required: 'Password is required!'})} 
                error={errors.password? errors.password.message : ""}
                styles='w-full rounded-full'
                labelStyles='ml-2'
              />
              <button
                type='button'
                className='absolute top-11 right-4 transform -translate-y-1/64 cursor-pointer'
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <FaRegEyeSlash size={30} color={"#065ad8"} /> : <FaRegEye size={30} color={"#065ad8"}/>}
              </button>
            </div>
          <Link to='/reset-password' className='text-sm text-right text-blue font-semibold'>
            Forgot Password?
          </Link>
          {
            errMsg?.message && (<span className={`text-sm ${errMsg?.status==='failed' ? 'text-[#f64949fe]' :'text-[#2ba150fe]' }`}>{errMsg?.message}</span>)
          }
          {
            isSubmitting ? <Loading /> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-2.5 text-md font-medium text-white outline-none `} title='Login'/>
          }
          </form>
          <div className='inline-flex justify-center'>
            <LoginwithGoogle type={"Login"}/>
          </div>
          <p className='text-ascent-2 pt-6 text-sm text-center'>
            Don't have an account? <Link to='/register' className='text-[#065ad8] font-semibold ml-2 cursor-pointer'>Sign up</Link>
          </p>
        </div>
        {/* RIGHT */} 
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
          <div className='relative w-full flex items-center justify-center'>
            <img src={BgImage} alt='Bg Img' className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover' />

            <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
              <BsShare size={14} />
              <span className='text-xs font-medium'>Share</span>
            </div>

            <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
              <ImConnection />
              <span className='text-xs font-medium'>Connect</span>
            </div>

            <div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
              <AiOutlineInteraction />
              <span className='text-xs font-medium'>Interact</span>
            </div>
          </div>
          <div className='mt-16 text-center'>
            <p className='text-white text-base'>
              Connect with friends & do share for fun
            </p>
            <span className='text-sm text-white/80'>
              Share memories with friends and family and the world
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
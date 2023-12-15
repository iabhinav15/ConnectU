import React, {useEffect, useState} from 'react'
import { TbSocial } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import { TextInput, Loading, CustomButton } from '../components'
import { useNavigate, useParams } from 'react-router-dom' 

const BACKEND_URL = process.env.REACT_APP_API_URL

const EnternewPassword = () => {
  const {userId, token} = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm({mode:'onChange'});
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [verifyingToken, setVerifyingToken] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const verifyToken = async () => {
      setVerifyingToken(true);
      const response = await fetch(`${BACKEND_URL}/users/reset-password/${userId}/${token}`,  {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      });
      const result = await response.json();
      if(response?.status === 201){
        setVerifyingToken(false);
        setIsValid(true);
        setErrMsg(result);
      }else {
        setVerifyingToken(false);
        setIsValid(false);
        setErrMsg(result);
      }
    }
    verifyToken();
  },[])


  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const {password, confirm_password} = data;
    if(password !== confirm_password){
      setIsSubmitting(false);
      const error = {status: "failed", message: "Passwords do not match"};
      setErrMsg(error);
      return;
    }
    const response = await fetch(`${BACKEND_URL}/users/reset-password`,  {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId, password}),
    });
    const result = await response.json();

    if(response?.status === 201){
      setIsSubmitting(false);
      setErrMsg(result);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }else {
      setIsSubmitting(false);
      setErrMsg(result);
    }
  }

  if(verifyingToken) {
    return(
      <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
        <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
            <Loading />
        </div>
      </div>
    )
  }

  if(!verifyingToken && !isValid){ 
    return ( 
      <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
        <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
          <p className='text-[#f64949fe] text-lg font-semibold'>
            Invalid Link
          </p>
          <span className='text-sm text-ascent-2'>
            Reset password link is Invalid! Try again later.
          </span>
        </div>
      </div>
    )
  }


  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      
        <div className='w-full lg:w-1/3 h-full p-10 2xl:px-20 flex flex-col justify-center '>
          <div className='w-full flex gap-2 items-center mb-6'>
            <div className='p-2 bg-[#065ad8] rounded text-white'>
              <TbSocial />
            </div>
            <span className='text-2xl text-[#065ad8] font-semibold'>ConnectU</span>
          </div>
          <p className='text-ascent-1 text-base font-semibold'>Enter new password</p>
         
          <form className='py-8 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)} >
          <TextInput
              name='password' placeholder='password' type='password'
              label='password' register={ register('password', {required: 'Password is required!'})} 
              error={errors.password? errors.password.message : ""}
              styles='w-full rounded-full'
              labelStyles='ml-2'
            />
            <TextInput
              name='confirm_password' placeholder='confirm password' type='password'
              label='confirm password' register={ register('confirm_password', {required: 'Password is required!'})} 
              error={errors.password? errors.password.message : ""}
              styles='w-full rounded-full'
              labelStyles='ml-2'
            />
          
          {
            errMsg?.message && (<span className={`text-sm ${errMsg?.status==='failed' ? 'text-[#f64949fe]' :'text-[#2ba150fe]' }`}>{errMsg?.message}</span>)
          }
          {
            isSubmitting ? <Loading /> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none `} title='Reset Password'/>
          }
          </form>
          
        </div>
        
    </div>
  )
}

export default EnternewPassword
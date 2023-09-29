import React, {useEffect, useState} from 'react'
import { TbSocial } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { TextInput, Loading, CustomButton } from '../components'
import { useNavigate, useParams } from 'react-router-dom'
const URL = 'http://localhost:8800'

const EnternewPassword = () => {
  const {userId, token} = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm({mode:'onChange'});
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const [verifyingToken, setVerifyingToken] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const verifyToken = async () => {
      setVerifyingToken(true);
      const response = await fetch(URL + '/users/reset-password/'+ userId + '/' + token,  {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      });
      if(response.status === 201){
        setVerifyingToken(false);
        setIsValid(true);
      }else {
        setVerifyingToken(false);
        setIsValid(false);
      }
    }
    verifyToken();
  },[])


  const onSubmit = async (data) => {
    const {password, confirm_password} = data;
    if(password !== confirm_password){
      alert("passwords do not match")
      return;
    }
    const response = await fetch(URL + '/users/reset-password',  {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId, password}),
    });
    if(response.status === 201){
      alert("password reset successful")
      navigate('/login');
    }else {
      alert("password reset failed")
    }
  }

  if(verifyingToken) return <Loading />

  if(!verifyingToken && !isValid) return <div>Reset password link is not valid</div>


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
            errMsg?.message && (<span className={`text-sm ${errMsg?.status=='failed' ? 'text-[#f64949fe]' :'text-[#2ba150fe]' }`}>{errMsg?.message}</span>)
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
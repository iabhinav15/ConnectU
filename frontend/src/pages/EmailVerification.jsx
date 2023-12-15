import React, {useState} from 'react'
import { useForm } from 'react-hook-form';
import { CustomButton, Loading } from '../components';
import { useParams } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const EmailVerification = () => {
  const {userId, token} = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit } = useForm({mode:'onChange'});
  
  
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {

      const response = await fetch(`${BACKEND_URL}/users/verify/${userId}/${token}`,  {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      });
      const result = await response.json();

      if(response?.status === 200){
        setErrMsg(result);
        setIsSubmitting(false);
        setTimeout(() => {
          window.location.replace('/login');

        }, 1000);
      }
      else{
        setErrMsg(result);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
    }
    finally{
      setIsSubmitting(false);
    }
  };


  return (
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
      <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
        <p className='text-ascent-1 text-lg font-semibold'>
          Verify Your Email Address
        </p>
        <span className='text-sm text-ascent-2'>
          To Login
        </span>
        <form onSubmit={handleSubmit(onSubmit)} className='py-4 flex flex-col gap-5'>
                    
          {
            errMsg?.message && (<span role='alert' className={`text-sm ${errMsg?.success === false ? 'text-[#f64949fe]' :'text-[#2ba150fe]' } mt-0.5`}>{errMsg?.message}</span>)
          }
          {
            isSubmitting ? <Loading /> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none `} title='Click to Verify'/>
          }
        </form>
      </div>
    </div>
  )
}

export default EmailVerification
import React, {useState} from 'react'
import { TbSocial } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { TextInput, Loading, CustomButton } from '../components'
import { BgImage } from '../assets'
import { BsShare } from 'react-icons/bs'
import { ImConnection } from 'react-icons/im'
import { AiOutlineInteraction } from 'react-icons/ai'
import { apiRequest } from '../utils'

const Register = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({mode:'onChange'});
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: '/auth/register',
        data: data,
        method: 'POST',
      })  

      if(res?.status === 'failed'){
        setErrMsg(res);
      }
      else{
        window.alert("A verification email is sent to your email address");
        setTimeout(() => {
          window.location.replace('/login');
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
    finally{
      setIsSubmitting(false);
    }
  }

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
          <div className='w-full flex gap-2 items-center mb-6'>
            <div className='p-2 bg-[#065ad8] rounded text-white'>
              <TbSocial />
            </div>
            <span className='text-2xl text-[#065ad8] font-semibold'>ConnectU</span>
          </div>
          <p className='text-ascent-1 text-base font-semibold'>Create your account</p>
          <p className='text-[#ff8059] text-base font-semibold'>Use real email address!</p>
          
          <form className='py-8 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
          <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
            <TextInput
                name='firstName' placeholder='First Name' type='text'
                label='First Name' register={ register('firstName', {required: 'First Name is required!'})} 
                error={errors.firstName? errors.firstName.message : ""}
                styles='w-full '
              />

              <TextInput
                placeholder='Last Name' type='text'
                label='Last Name' register={ register('lastName', {required: 'Last Name is required!'})} 
                error={errors.lastName? errors.lastName.message : ""}
                styles='w-full'
              />
          </div>
            <TextInput
              name='email' placeholder='email@example.com' type='email'
              label='Email Address' register={ register('email', {required: 'Email is required!'})} 
              error={errors.email? errors.email.message : ""}
              styles='w-full'
            />
            <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
              <TextInput
                name='password' placeholder='password' type='password'
                label='Password' register={ register('password', {required: 'Password is required!'})} 
                error={errors.password? errors.password.message : ""}
                styles='w-full'
              />
                <TextInput
                name='password' placeholder='Password' type='password'
                label='Confirm Password' register={ register('cPassword', {validate: (value) => {
                  const { password } = getValues();
                  if(password !== value) return 'Passwords do not match!';
                }} )}
                error={errors.cPassword && errors.cPassword.type === 'validate' ? errors.cPassword?.message : ''}
                styles='w-full'
              />
            </div>

          {
            errMsg?.message && (<span className={`text-sm ${errMsg?.status==='failed' ? 'text-[#f64949fe]' :'text-[#2ba150fe]' }`}>{errMsg?.message}</span>)
          }
          {
            isSubmitting ? <Loading /> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none `} title='Create Account'/>
          }
          </form>
          <p className='text-ascent-2 text-sm text-center'>
            Already have an account? <Link to='/login' className='text-[#065ad8] font-semibold ml-2 cursor-pointer'>Login</Link>
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

export default Register;
import React from 'react'
import { MdClose } from 'react-icons/md'
import TextInput from './TextInput'
import { useForm } from 'react-hook-form';

interface AddSocialLinkProps {
    closeModal: () => void;
}

const AddSocialLink: React.FC<AddSocialLinkProps> = ({ closeModal }) => {

    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

    const onSubmit = async (data: any) => {
        console.log(data);
    }

    return (
        <div className='fixed z-50 inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <div className='fixed inset-0 transition-opacity'>
                    <div className='absolute inset-0 bg-[#000] opacity-70'></div>
                </div>
                <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>&#8203;
                <div className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full' role='dialog' aria-modal='true' aria-labelledby='modal-headline'>
                    <div className='pt-3 pb-2 px-6'>
                        <div className='flex justify-between mb-6'>
                            <label htmlFor="name" className='block font-medium text-xl text-ascent-1 text-left'>Add Link</label>
                            <button type='button' className='text-ascent-1' onClick={closeModal}>
                                <MdClose size={22} />
                            </button>
                        </div>
                        <form className='px-4 sm:px-6 flex flex-col gap3 2xl:gap-6' onSubmit={handleSubmit(onSubmit)}>
                            <TextInput
                                name='InstagramLink' placeholder='URL' type='text'
                                label='Add Link' register={register('Instagram Link', { required: false, maxLength: 80 })}
                                error={errors.firstName ? (errors.firstName.message as string) : ""}
                                styles='w-full'
                            />
                            <div className='flex gap-8 justify-end my-4'>
                                <button type='submit' className=' bg-blue px-3 py-2 rounded-md font-medium text-white outline-none'>
                                    Add
                                </button>
                                <button type='button' className='text-ascent-1 px-3 py-2 rounded-md font-medium bg-bgColor' onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>     
                </div>
            </div>
        </div>
    )
}

export default AddSocialLink
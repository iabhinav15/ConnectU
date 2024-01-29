/*This page is for getting google user and send user info to backend and this page will show only loading screen*/
import axios from 'axios';
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../components';
import { dispatch } from '../redux/store';
import { UserLogin } from '../redux/userSlice';

const GoogleRedirect = () => {

  //get code from url
  const [searchParam] = useSearchParams(); 
  const code = searchParam.get("code");

  const googleOAuthHandler = async () => {
      const url = "https://oauth2.googleapis.com/token";
      const values = {
          code,
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.REACT_APP_googleOAuthRedirectURL,
          grant_type: "authorization_code",
      }

      const { data } = await axios.post(url, values, {
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
          },
      });

      const { access_token, id_token } = data;
      //const googleUser = jwt.decode(id_token);
      
      /* we can also find googleUser by making network request using id_token and access_token */
      const { data: googleUser } = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, //access_token to get user info
          {
              headers: {
                  Authorization: `Bearer ${id_token}`,//id_token to verify who we are
              },
          });
      
      //send user info to backend
      const resp = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/data/google`,
        { googleUser },
        {  withCredentials: true }
        );
        console.log("resp", resp)
      if(resp.data.success === true){
        const newData = { token: resp.data?.token, ...resp.data?.user };
        dispatch(UserLogin(newData));
        window.history.pushState({}, '', '/');
        window.location.replace('/');
        // window.addEventListener('popstate', function (event) {
        //   // Redirect to a specific URL when the user goes back
        //   window.location.replace('/login');
        // });
      } else{
        window.history.pushState({}, '', '/login');
        window.location.replace('/login');
        //   window.addEventListener('popstate', function (event) {
        //     // Redirect to a specific URL when the user goes back
        //     window.location.replace('/login');
        // });
      }
  }

  useEffect(() => {
    if(code){
      googleOAuthHandler();
    }
  }, [code])

  return (
    <>
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
        <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
            <Loading />
        </div>
      </div>
    </>
  )
}

export default GoogleRedirect
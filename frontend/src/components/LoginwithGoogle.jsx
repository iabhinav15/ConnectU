import React from 'react'
import { getGoogleOAuthURL } from '../utils/getGoogleOAuthURL'
import { googleLogo } from '../assets'

const LoginwithGoogle = ({type}) => {

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
































































// import React, {useEffect} from 'react'

// const BACKEND_URL = process.env.REACT_APP_API_URL

// const LoginwithGoogle = () => {

//     useEffect(() => {
//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.async = true;
//       document.head.appendChild(script);
  
//       script.onload = () => {
//         window.google.accounts.id.initialize({
//           client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//           context: 'signup',
//           ux_mode: 'popup',
//           login_uri: process.env.REACT_APP_LOGIN_URL,
//           auto_prompt: false,
//           allowed_parent_origin: "http://localhost:8800/auth/registerwithgoogle"
//         });
  
//         window.google.accounts.id.renderButton(
//           document.getElementById('g_id_signin'),
//           {
//             type: 'standard',
//             shape: 'rectangular',
//             theme: 'filled_blue',
//             text: "signin_with",
//             size: 'large',
//             logo_alignment: 'left',
//             allowed_parent_origin: "http://localhost:8800/auth/registerwithgoogle"
//           }
//         );
//       };
//       // Callback for handling the ID token after successful sign-in
//       window.onGoogleYoloLoad = (googleyolo) => {
//         console.log('Google YOLO loaded!');
//         const hintPromise = googleyolo.hint({
//           supportedAuthMethods: ['https://accounts.google.com'],
//           supportedIdTokenProviders: [
//             {
//               uri: 'https://accounts.google.com',
//               clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//             },
//           ],
//         });
//         hintPromise
//           .then((credential) => {
//             const idToken = credential.idToken;
//             console.log('ID Token:', idToken);
//             // Send the idToken to your backend for further processing
//             fetch(`${BACKEND_URL}/auth/registerwithgoogle`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ idToken }),
//             })
//               .then((response) => response.json())
//               .then((data) => {
//                 // Handle the response from the backend if needed
//                 console.log('Backend Response:', data);
//                 // window.location.replace('/');
//               })
//               .catch((error) => {
//                 // Handle errors during the fetch
//                 console.error('Fetch error:', error);
//               });
//           })
//           .catch((error) => {
//             // Handle errors
//             console.error('Google YOLO error:', error);
//           });
//       };

//         return () => {
//           document.head.removeChild(script);
//         };
//       }, []);

//   return (
//     <>
//       <div
//         id="g_id_signin"
//         data-client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
//         data-context="signup"
//         data-ux_mode="popup"
//         data-login_uri={process.env.REACT_APP_LOGIN_URL}
//         data-auto_prompt="false"
//       ></div>

//       <div
//         className=""
//         data-type="standard"
//         data-shape="rectangular"
//         data-theme="filled_blue"
//         data-text="signnup"
//         data-size="large"
//         data-logo_alignment="left"
//       ></div>
//     </>
//   )
// }

// export default LoginwithGoogle
import './App.css';
import Header from './components/Header/Header';
import { Outlet, redirect } from 'react-router';
import { getUserRequest } from './requests';


import loveIllustration from './assets/loveIllustration1.png'
import cartsUsers from './assets/carts_users.png'

import './pages/Singin/SigninPage.css'
import { User } from './types';


export async function authenticateLoader() {
   let user: User;
   try {
      await getUserRequest()
         .then(async res => {
            user = res.data.user;
            user.photos = []
         })
   }
   catch (e) {
      // console.log(e)
      return (redirect("/signin"));
   }
   return ({ user })
}


export function NotAuthenticateSpace() {
   return (
      <div className="App">
         <Header />
         <div style={{
            height: '93vh', width: '100%',
            position: 'relative', overflow:'auto'
         }}>
            <div className='app-c'>
               <div className='app-phoneimg-c'>
                  <img src={loveIllustration} className='app-phoneimg' />
               </div>
               <Outlet />
               <div className='app-usercarts-c'>
                  <div className='app-carts-c'>
                     <p className='app-carts-text'>
                        Online you can see the best profiles that match yours,
                        likes and chat with them to find the person that will share your life.
                     </p>
                     <img src={cartsUsers} className='app-carts' />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}


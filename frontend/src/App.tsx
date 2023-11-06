import './App.css';
import HeaderConnected from './components/Header/HeaderConnected';
import Header from './components/Header/Header';
import { Outlet, redirect, useLoaderData } from 'react-router';
import { getUserPhotoRequest, getUserRequest } from './requests';
import { UserProvider } from './contexts/UserContext';
import BrowserProvider from './contexts/BrowserProvider';
import ViewsProvider from './contexts/ViewsProvider';
import LikesProvider from './contexts/LikesProvider';
import { ChatProvider } from './contexts/ChatProvider';
import UserSocketProvider from './contexts/UserSocketProvider';
import NotificationsProvider from './contexts/NotificationsProvider';


import loveIllustration from './assets/loveIllustration1.jpg'
import cartsUsers from './assets/cartsUsers.svg'

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

         <div style={{ height: '93vh', width: '100%', position: 'relative', overflow: 'hidden' }}>

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

export function AuthenticateSpace() {

   const { user }: { user?: User } = useLoaderData();

   return (
      <UserProvider _user={user}>
         <div className="App">
            <ViewsProvider>
               <LikesProvider>
                  <BrowserProvider>
                     <ChatProvider>
                        <NotificationsProvider>
                           <UserSocketProvider>
                              <HeaderConnected />
                              <div style={{ height: '93vh', width: '100%' }}>
                                 <Outlet context={{ user, salut: "dfwfw" }} />
                              </div>
                           </UserSocketProvider>
                        </NotificationsProvider>
                     </ChatProvider>
                  </BrowserProvider>
               </LikesProvider>
            </ViewsProvider>
         </div>
      </UserProvider>
   );
}


import HeaderConnected from '../components/Header/HeaderConnected';
import { Outlet, useLoaderData } from 'react-router';
import { UserProvider } from '../contexts/UserContext';
import BrowserProvider from '../contexts/BrowserProvider';
import ViewsProvider from '../contexts/ViewsProvider';
import LikesProvider from '../contexts/LikesProvider';
import { ChatProvider } from '../contexts/ChatProvider';
import UserSocketProvider from '../contexts/UserSocketProvider';
import NotificationsProvider from '../contexts/NotificationsProvider';

import { User } from '../types';

export default function AuthenticateSpace() {

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
                                  <Outlet context={{ user }} />
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
 
 
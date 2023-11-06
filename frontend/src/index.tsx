import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { NotAuthenticateSpace, AuthenticateSpace, authenticateLoader } from './App';
import HomePage from './pages/HomePage/HomePage';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SigninPage from './pages/Singin/SigninPage';
import SignupPage, { SignupPageForm } from './pages/Signup/SignupPage';
import SignupInfosPage from './pages/Signup/SignupInfos/SignupInfosPage';
import SignupPhotosPage from './pages/Signup/SignupPhotos/SignupPhotosPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import ProfileCurrentUser from './pages/Profile/ProfileCurrentUser/ProfileCurrentUser';

import Browse from './pages/Browse/Browse';
import Chat, { ChatMessenger } from './pages/Chat/ChatPage';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage';
import ProfileUser from './pages/Profile/ProfileUser/ProfileUser';
import ProfileCurrentUserPage from './pages/Profile/ProfileCurrentUser/Page/ProfileCurrentUserPage';
import ProfileViewsPage from './pages/Profile/ProfileCurrentUser/ProfileViewsPage/ProfileViewsPage'
import ProfileLikesPage from './pages/Profile/ProfileCurrentUser/ProfileLikesPage/ProfileLikesPage'
import ErrorPage from './pages/ErrorPage/ErrorPage';
import ConfirmAccountPage from './pages/Signup/ConfirmAccountPage/ConfirmAccountPage';

const router = createBrowserRouter([
  {
    path: "",
    element: <NotAuthenticateSpace />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />
      },
      {
        path: "signin",
        element: <SigninPage />
      },
      {
        path: "signin/password",
        element: <ForgotPasswordPage />
      },
      {
        path: "signin/resetPassword",
        element: <ResetPasswordPage />
      },
      {
        path: "signup",
        element: <SignupPage />,
        children: [
          {
            path: "",
            element: <SignupPageForm />
          },
          {
            path: "confirmAccount",
            element: <ConfirmAccountPage />
          },
          {
            path: "informations",
            element: <SignupInfosPage />
          },
          {
            path: "photos",
            element: <SignupPhotosPage />
          }
        ]
      }
    ]
  },
  {
    path: "",
    element: <AuthenticateSpace />,
    loader: authenticateLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "profile",
        element: <ProfileCurrentUserPage />,
        children: [
          {
            path: "",
            element: <ProfileCurrentUser />
          },
          {
            path: "likes",
            element: <ProfileLikesPage />
          },
          {
            path: "views",
            element: <ProfileViewsPage />
          }
        ]
      },
      {
        path: "/profile/:id", 
        element: <ProfileUser />
      },
      {
        path: "browse",
        element: <Browse />
      },
      {
        path: "chat",
        element: <Chat />, 
        children: [
          {
            path: ":id", 
            element: <ChatMessenger />
          }
        ]
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);

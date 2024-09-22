import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { NotAuthenticateSpace, authenticateLoader } from './App';
import HomePage from './pages/HomePage/HomePage';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SigninPage from './pages/Singin/SigninPage';
import SignupPage, { SignupPageForm } from './pages/Signup/SignupPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';


import SignupInfosPage from './pages/Signup/SignupInfos/SignupInfosPage';
import SignupPhotosPage from './pages/Signup/SignupPhotos/SignupPhotosPage';

import ConfirmAccountPage from './pages/Signup/ConfirmAccountPage/ConfirmAccountPage';

import ErrorPage from './pages/ErrorPage/ErrorPage';
import LoadingPageFallback from './pages/LoadingPageFallback/LoadingPageFallback';


const Browse = lazy(() => import("./pages/Browse/Browse"))
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword/ResetPasswordPage"))
const ProfileUser = lazy(() => import("./pages/Profile/ProfileUser"))
const ProfileCurrentUserPage = lazy(() => import("./pages/Profile/ProfileCurrentUserPage"))
const ProfileViewsPage = lazy(() => import("./pages/Profile/ProfileViewsPage"))
const ProfileLikesPage = lazy(() => import("./pages/Profile/ProfileLikesPage"))
const ProfileCurrentUser = lazy(() => import("./pages/Profile/ProfileCurrentUser"))
const Chat = lazy(() => import("./pages/Chat/ChatPage"))
const ChatMessenger = lazy(() => import("./pages/Chat/ChatMessenger"))

const AuthenticateSpace = lazy(() => import("./pages/AuthenticateSpace"))


const LoadingPage = ({ fallback, children }: any) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}


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
    element: <LoadingPage fallback={<LoadingPageFallback />} children={<AuthenticateSpace />} />,
    loader: authenticateLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "profile",
        element: <LoadingPage fallback={<LoadingPageFallback />} children={<ProfileCurrentUserPage />} />,
        children: [
          {
            path: "",
            element: <LoadingPage fallback={<LoadingPageFallback />} children={<ProfileCurrentUser />} />
          },
          {
            path: "likes",
            element: <LoadingPage fallback={<LoadingPageFallback />} children={<ProfileLikesPage />} />
          },
          {
            path: "views",
            element: <LoadingPage fallback={<LoadingPageFallback />} children={<ProfileViewsPage />} />
          }
        ]
      },
      {
        path: "/profile/:id",
        element: <LoadingPage fallback={<LoadingPageFallback />} children={<ProfileUser />} />
      },
      {
        path: "browse",
        element: <LoadingPage fallback={<LoadingPageFallback />} children={<Browse />} />
      },
      {
        path: "chat",
        element: <LoadingPage fallback={<LoadingPageFallback />} children={<Chat />} />,
        children: [
          {
            path: ":id",
            element: <Suspense><ChatMessenger /></Suspense>
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

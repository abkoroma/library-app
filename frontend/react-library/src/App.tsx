import Navbar from './layouts/NavBarAndFooter/Navbar';
import './App.css';
import Footer from './layouts/NavBarAndFooter/Footer';
import SearchBooksPage from './layouts/SearchBooksPage/SearchBooksPage';
import HomePage from './layouts/HomePage/HomePage';
import { Route, Routes, useNavigate } from 'react-router-dom';
import BookCheckoutPage from './layouts/BookCheckoutPage/BookCheckoutPage';
import { auth0Config } from './lib/authConfig';
import ReviewListPage from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import ShelfPage from './layouts/ShelfPage/ShelfPage';
import MessagesPage from './layouts/MessagesPage/MessagesPage';
import ManageLibraryPage from './layouts/ManageLibraryPage/ManageLibraryPage';
//import PaymentPage from './layouts/PaymentPage/PaymentPage';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import LoginPage from './Auth/LoginPage';

function Auth0ProviderWithHistory({ children }:  { children: React.ReactNode }) {
  const navigate = useNavigate();

  function onRedirectCallback(appState: any) {
    navigate(appState?.returnTo || '/home');
  }

  return (
    <Auth0Provider 
      domain={auth0Config.issuer} 
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );

} 

/*const SecureRoute = ({component: Component, path, ...args}: { component: React.ComponentType<any>, path: string}) => (

    <Route path={path} element={withAuthenticationRequired(component)} {...args} />
);*/

function App() {

  const ProtectedShelfPage = withAuthenticationRequired(ShelfPage);
  const ProtectedMessagesPage = withAuthenticationRequired(MessagesPage);
  const ProtectedManageLibraryPage = withAuthenticationRequired(ManageLibraryPage);

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Auth0ProviderWithHistory>
        <Navbar />
        <div className='flex-grow-1'>
          <Routes>
            <Route index path='/' element={ <HomePage /> } />
            <Route path='/home' element={ <HomePage /> } />
            <Route path='/search' element={ <SearchBooksPage /> } />
            <Route path='/reviewlist/:bookId' element={ <ReviewListPage /> } />
            <Route path='/checkout/:bookId' element={ <BookCheckoutPage /> } />
            <Route path='/login' element={ <LoginPage /> } />
            <Route path='/shelf' element={<ProtectedShelfPage /> } />
            <Route path='/messages' element={<ProtectedMessagesPage /> } />
            <Route path='/admin' element={<ProtectedManageLibraryPage /> } />
            {/*<Route path='/fees' element={ <PaymentPage /> } />*/}
          </Routes>
        </div>
        <Footer />
      </Auth0ProviderWithHistory>
    </div>
  );
}

export default App;

import Navbar from './layouts/NavBarAndFooter/Navbar';
import './App.css';
import Footer from './layouts/NavBarAndFooter/Footer';
import SearchBooksPage from './layouts/SearchBooksPage/SearchBooksPage';
import HomePage from './layouts/HomePage/HomePage';
import { Route, Routes, useNavigate } from 'react-router-dom';
import BookCheckoutPage from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import ReviewListPage from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import ShelfPage from './layouts/ShelfPage/ShelfPage';
import MessagesPage from './layouts/MessagesPage/MessagesPage';
import ManageLibraryPage from './layouts/ManageLibraryPage/ManageLibraryPage';
import PaymentPage from './layouts/PaymentPage/PaymentPage';

const oktaAuth = new OktaAuth(oktaConfig);

function App() {
  const navigate = useNavigate();

  const customAuthHandler = () => {
    navigate("/login");
  }

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Routes>
            <Route path='/' element={ <HomePage /> } />
            <Route path='/search' element={ <SearchBooksPage /> } />
            <Route path='/reviewlist/:bookId' element={ <ReviewListPage /> } />
            <Route path='/checkout/:bookId' element={ <BookCheckoutPage /> } />
            <Route path='/login' element={ <LoginWidget config={oktaConfig} /> } />
            <Route path='/login/callback' element={ <LoginCallback /> } />
            <Route path='/shelf' element={ <ShelfPage /> } />
            <Route path='/messages' element={ <MessagesPage /> } />
            <Route path='/admin' element={ <ManageLibraryPage /> } />
            <Route path='/fees' element={ <PaymentPage /> } />
          </Routes>
        </div>
        <Footer />
      </Security>
    </div>
  );
}

export default App;

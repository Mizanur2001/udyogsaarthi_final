import Auth from './Components/Auth';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import UserPending from './Components/UserPending';
import SearchEngine from './Components/SearchEngine';
import SearchResults from './Components/SearchResults';
import SingleResume from './Components/SingleResume';
import ForgotPass from './Components/ForgotPass';


function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path='/' element={localStorage.getItem('userInfo') ? <Navigate to='/search' /> : <Auth />} />
          <Route path='/forgotPass' element={localStorage.getItem('userInfo') ? <Navigate to='/search' /> : <ForgotPass />} />
          <Route path='/pending' element={localStorage.getItem('userInfo') ? <Navigate to='/search' /> : <UserPending />} />
          <Route path='/search' element={localStorage.getItem('userInfo') ? <SearchEngine /> : <Navigate to='/' />} />
          <Route path='/searchresults' element={localStorage.getItem('userInfo') ? <SearchResults /> : <Navigate to='/' />} />
          <Route path='/search/resumea' element={localStorage.getItem('userInfo') ? <SingleResume /> : <Navigate to='/' />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;

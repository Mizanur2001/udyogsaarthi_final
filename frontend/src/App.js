import Auth from './Components/Auth';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import SearchEngine from './Components/SearchEngine';
import SearchResults from './Components/SearchResults';
import SingleResume from './Components/SingleResume';
import ForgotPass from './Components/ForgotPass';
import Verify from './Components/Verify';


function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path='/' element={<SearchEngine/>}/>
          {/* <Route path='/' element={localStorage.getItem('userToken') ? <Navigate to='/search' /> : <Auth />} /> */}
          <Route path='/forgotPass' element={localStorage.getItem('userToken') ? <Navigate to='/search' /> : <ForgotPass />} />
          <Route path='/verify' element={localStorage.getItem('userToken') ? <Navigate to='/search' /> : <Verify />} />
          <Route path='/search' element={localStorage.getItem('userToken') ? <SearchEngine /> : <Navigate to='/' />} />
          <Route path='/searchresults' element={localStorage.getItem('userToken') ? <SearchResults /> : <Navigate to='/' />} />
          <Route path='/search/resumea' element={localStorage.getItem('userToken') ? <SingleResume /> : <Navigate to='/' />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;

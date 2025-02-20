import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Action-creators/User';
import Home from './components/Home/Home';
import Account from './components/Account/Account';
import Loader from './components/Loader/Loader';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import NewPost from './components/NewPost/NewPost';


function App() {
  const state = useSelector((state) => state.user)
  console.log(state)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser())
  }, [])
  
  return (
    <div className="App">
      <BrowserRouter>
      {state.usersloding ? <Loader /> : state.isAuthenticated && <Header />}
      {/* {state.isAuthenticated && <Header />} */}
       <Routes>
        <Route path='/' element={state.isAuthenticated ? <Home /> : <Login />} />
        <Route path='/account' element={state.isAuthenticated ? <Account /> : <Login />} />
        <Route path='/update/profile' element={state.isAuthenticated ? <UpdateProfile /> : <Login />} />
        <Route path='/newpost' element={state.isAuthenticated ? <NewPost /> : <Login />} />

       </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

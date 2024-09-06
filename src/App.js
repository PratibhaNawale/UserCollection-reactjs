import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import User from "./pages/user/User";
import AddUser from './component/adduser/AddUser';
import Update from './component/updateuser/Update';
import DarkMode from './component/theme/DarkMode';
import "./App.css"
import SignUp from './pages/signup/SignUp';
import SignIn from './pages/signin/SignIn';

function App() {
    return (
        <div>

            <BrowserRouter>
                <div>
                    <Routes>
                        <Route path="/" element={<SignUp />} />
                        <Route path="/sign-in" element={<SignIn />}></Route>
                        <Route path="/user" element={<User />} />
                        <Route path="/add-user" element={<AddUser />} />
                        <Route path="/update-user" element={<Update />} />


                    </Routes>
                </div>
            </BrowserRouter>

        </div>

    );
}

export default App;

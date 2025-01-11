import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./index.css";
import "./ToggleSwitch.css";
import NavbarMenu from './navbar.js'
import LoginCardImage from './htms-login-card.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext';
import MenuBar from "./menubar";
import ProtectedRoute from './ProtectedRoute';
import Loading from './utils';
import routes from './routes';
import { LoadingProvider } from "./Loader";
import ApiNotificationExample from "./ErrorPop"


function App() {
  const { isLoggedIn  } = useAuth(); // Access login status from context
  const [apiResponse, setApiResponse] = useState(null);
  // if (loading){
  //   return <Loading />;
  // }

  const containerStyle = {
    backgroundImage: isLoggedIn ? 'none' : `url(${LoginCardImage})`,  // Remove background after login
  }

  return (
    <LoadingProvider>
      <Router>
        <header className="header-name">
        <div className="header-left">
          <h5>HTMS</h5>
        </div>
        <div className="header-right">
          {isLoggedIn && <MenuBar />} {/* Conditionally render MenuBar if logged in */}
        </div>
        </header>
        {isLoggedIn && <NavbarMenu />}
        <div className="main-container" style={containerStyle}>
        <Loading />
        <Routes>
          {routes.map(({ path, element, isProtected }, index) => (
            <Route
              key={index}
              path={path}
              element={isProtected ? <ProtectedRoute element={React.cloneElement(element, { setApiResponse })} /> : React.cloneElement(element, { setApiResponse })}
              />
            ))}
        </Routes>
        <ApiNotificationExample response={apiResponse} />
        </div>
        <footer>
          <p>2024 Hero Textile Management System. All rights reserved.</p>
        </footer>
      </Router>
    </LoadingProvider>
  );
}

// const Header = () => {
//   const isLoggedIn = sessionStorage.getItem('isLoggedIn')

//   console.log(isLoggedIn)
  
//   return (
//     <header className="header-name">
//       <h5> HTMS </h5>
//       {isLoggedIn && <MenuBar />}
//     </header>
//   );
// };

export default App

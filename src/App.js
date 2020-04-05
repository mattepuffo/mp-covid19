import React from 'react';
import Home from "./home";
import HttpsRedirect from 'react-https-redirect';

function App() {
    return (
        <React.Fragment>
            <HttpsRedirect>
                <Home/>
            </HttpsRedirect>
        </React.Fragment>
    );
}

export default App;

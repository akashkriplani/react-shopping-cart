import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import AdminScreen from './screens/AdminScreen';
import HomeScreen from './screens/HomeScreen';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="grid-container">
            <header>
              <Link to="/">React Shopping Cart</Link>
            </header>
            <main>
              <Routes>
                <Route path="/admin" element={<AdminScreen />} />
                <Route path="/" element={<HomeScreen />} exact />
              </Routes>
            </main>
            <footer>All rights reserved.</footer>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;

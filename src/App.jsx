import React, { useState, useEffect } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';

// Redux Actions
const login = (user) => ({
  type: 'LOGIN',
  payload: user,
});

const logout = () => ({
  type: 'LOGOUT',
});

const setProducts = (products) => ({
  type: 'SET_PRODUCTS',
  payload: products,
});

const addToCart = (product) => ({
  type: 'ADD_TO_CART',
  payload: product,
});

const removeFromCart = (productId) => ({
  type: 'REMOVE_FROM_CART',
  payload: productId,
});

// Redux Reducers
const authReducer = (state = { user: null, isAuthenticated: false }, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

const productReducer = (state = { items: [] }, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100 p-4">
          <nav className="bg-blue-600 p-4 text-white rounded-lg mb-6">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:text-gray-200">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-gray-200">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-gray-200">Cart</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/products" element={<ProductListComponent />} />
            <Route path="/cart" element={<CartComponent />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

// Components

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    const user = { email, password }; // Dummy user object
    dispatch(login(user));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        onClick={handleLogin}
        className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Login
      </button>
    </div>
  );
};

const ProductListComponent = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);

  useEffect(() => {
    // Fetch products from an external API (Fake Store API)
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleAddToCart = (product) => {
    alert(`${product.title} has been added to your cart!`);
    dispatch(addToCart(product));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
          <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-4 rounded-lg" />
          <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-lg font-bold text-blue-600">${product.price}</p>
          <button
            onClick={() => handleAddToCart(product)}
            className="w-full mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

const CartComponent = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <ul>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          cartItems.map((item, index) => (
            <li key={`${item.id}-${index}`} className="flex justify-between items-center py-4 border-b text-blue-600 border-gray-300">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                {/* Product Name */}
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="t">Price: ${item.price}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);

  // You can select a few products to feature on the homepage
  const featuredProducts = products.slice(0, 6); // Get the first 6 products

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our E-Commerce Store</h1>
        <p className="text-lg mb-6">Shop the best products at amazing prices</p>
        <Link to="/products" className="px-6 py-3 bg-yellow-500 text-gray-800 rounded-lg text-xl hover:bg-yellow-400 transition">
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <img src={product.image} alt={product.title} className="w-full h-56 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-lg font-bold text-blue-600">${product.price}</p>
              <button
                onClick={() => {
                  alert(`${product.title} has been added to your cart!`);
                  dispatch(addToCart(product));
                }}
                className="w-full mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-800 text-white text-center py-16">
        <h2 className="text-3xl font-semibold mb-4">Don't Miss Out on Our Exclusive Offers!</h2>
        <p className="text-lg mb-6">Sign up today to receive special discounts and exclusive deals.</p>
        <Link to="/login" className="px-6 py-3 bg-yellow-500 text-gray-800 rounded-lg text-xl hover:bg-yellow-400 transition">
          Join Now
        </Link>
      </section>
    </div>
  );
};


export default App;

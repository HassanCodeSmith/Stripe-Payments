import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";

function App() {
  const [product, setProduct] = useState({
    name: "React from FB",
    price: 10,
    productBy: "facebook",
  });

  // makePayment method body
  const makePayment = (token) => {
    const body = {
      token,
      product,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    return fetch(`http://localhost:8282/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((responce) => {
        console.log("RESPONCE: ", responce);
        const { status } = responce;
        console.log("STATUS: ", status);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <a
          className="App-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <StripeCheckout
          stripeKey="pk_test_51QDdrWKkE4IsYgPIyihuMwtuHYCR4F9TS3dsI2gFF3UETDQKgG3AIJVaxQ9HWbu21QBf52C6Py3ecg2Qmk4TSb8u00cgZtD2Th"
          token={makePayment}
          name="Buy React"
          amount={product.price * 100}
        >
          <button className="btn-large blue">
            Buy react in just {product.price}$
          </button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;

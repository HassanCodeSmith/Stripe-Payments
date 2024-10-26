const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51QDdrWKkE4IsYgPICSVYss1AgRaWE0CitA6Tyivs3t29IdZfJPZGZJRJLyzADB1Jbpi6GE52ndSDTgJf2sY1MrPv00bqbBSBMt"
);
const { v4: uuid } = require("uuid");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("IT WORKS AT LEARNCODEONLINE");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT: ", product);
  console.log("PRICE: ", product.price);

  const idempotencyKey = uuid();
  console.log("IDEMPOTENCYKEY: ", idempotencyKey);

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100, // convert cetns to dolors
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// listen
app.listen(8282, () => console.log("LISTENING AT PORT 8282"));

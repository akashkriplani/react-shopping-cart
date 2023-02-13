const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.json());

dotenv.config();

// deploy
app.use('/', express.static(__dirname + '/build'));
app.get('/', (req, res) => res.sendFile(__dirname + '/build/index.html'));

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Product = mongoose.model(
  'products',
  new mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    image: String,
    title: String,
    description: String,
    price: Number,
    availableSizes: [String]
  })
);

app.get('/api/products', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.send(savedProduct);
});

app.delete('/api/products/:id', async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deletedProduct);
});

const Order = mongoose.model(
  'order',
  new mongoose.Schema(
    {
      _id: { type: String, default: shortid.generate },
      email: String,
      name: String,
      address: String,
      total: Number,
      cartItems: [
        {
          _id: String,
          title: String,
          price: Number,
          count: Number
        }
      ]
    },
    { timestamps: true }
  )
);

app.post('/api/orders', async (req, res) => {
  const { name, email, address, cartItems, total } = req.body;
  if (!name || !email || !address || !cartItems || !total) {
    return res.send({ message: 'Data is required.' });
  }
  const order = await new Order(req.body).save();
  res.send(order);
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find({});
  res.send(orders);
});

app.delete('/api/orders/:id', async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  res.send(order);
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Serving at http://localhost:${port}`);
});

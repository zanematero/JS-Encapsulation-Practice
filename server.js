const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Fs = require('fs').promises;
const Path = require('path');
const app = express();
const liveServer = require('live-server');

async function main() {

    app.use(cors());

    app.use(bodyParser.json());

    app.get('/cart', async (req, res) => {
        let db = await loadDB()
        res.json(db.cart);
    })

    app.get('/ingredients', async (req, res) => {
        let db = await loadDB()
        res.json(db.ingredients);
    })

    app.patch('/cart/:id', async (req, res) => {
        let db = await loadDB()
        let { cart } = db;
        let cartItem = cart.find(cartItem => cartItem.id === parseInt(req.params.id));
        if (!cartItem) return res.status(404).json({ error: true, message: `Could not find a cartItem with an id of ${req.body.id}` })
        const { name, bread, ingredients } = { ...cartItem, ...req.body };
        Object.assign(cartItem, { name, bread, ingredients });
        await saveDB(db)
        res.json(cartItem)
    })

    app.post('/cart', async (req, res) => {
        let db = await loadDB()
        let { cart } = db;
        if (!req.body.bread) return res.status(400).json({ error: true, message: `'bread' is required in the request body when creating a cartItem. Make sure you're stringifying the body of your request, and sending the appropriate headers.` })
        const { name, bread, ingredients = [] } = req.body;
        const id = cart.reduce((id, cartItem) => Math.max(cartItem.id + 1, id), 1);
        const cartItem = { id, name, bread, ingredients }
        cart.push(cartItem);
        await saveDB(db)
        res.json(cartItem)
    })

    app.delete('/cart/:id', async (req, res) => {
        let db = await loadDB()
        let { cart } = db;
        let cartItem = cart.find(x => x.id === parseInt(req.params.id));
        if (!cartItem) return res.status(404).json({ error: true, message: `Could not find a cartItem with an id of ${req.body.id}` })
        db.cart = cart.filter(x => x !== cartItem);
        await saveDB(db)
        res.json(cartItem)
    })

    app.listen(3001, () => {
        liveServer.start({
            port: 3000,
            logLevel: 0,
            root: './public'
        })
    })
}

const DB_PATH = Path.join(__dirname, 'db.json')

async function loadDB() {
    let result = JSON.parse(await Fs.readFile(DB_PATH))
    return result
}

async function saveDB(data) {
    await Fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

main()
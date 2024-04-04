const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5500; // change the port to whatever the website loads up on your device

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use('/public', express.static('public'));


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });


let connectionrequest = require('./connectionrequest')





function renderPage() {

    async function getNewPageData() {
        conn = connectionrequest()

        let productsPromise = getProducts(conn);
        let adminPromise = getAdmins(conn);
        let customerPromise = getCustomers(conn);
        let shoppingCartPromise = getShoppingCarts(conn);
        let shoppingCartProductsPromise = getShoppingCartProducts(conn);


        return Promise.all([productsPromise, adminPromise, customerPromise, shoppingCartPromise, shoppingCartProductsPromise])
        .then(results => {

            let products;
            results[0] == "" ? products = null : products = results[0]; // if there are no artits, make the variable null so the index.ejs file knows to 

            let admins;
            results[1] == "" ? admins = null : admins = results[1];

            let customers;
            results[2] == "" ? customers = null : customers = results[2];

            let shoppingCarts;
            results[3] == "" ? shoppingCarts = null : shoppingCarts = results[3];

            let productsInCart;
            results[4] == "" ? productsInCart = null : productsInCart = results[4];

            if(productsInCart !== null) {
                for(let i = 0; i < productsInCart.length; i++) {
                    productsInCart[i].productName = products.find(obj => obj.productID === productsInCart[i].productID).productName;
                    productsInCart[i].customerID = shoppingCarts.find(obj => obj.cartID === productsInCart[i].cartID).customerID;
                    productsInCart[i].productPrice = products.find(obj => obj.productID === productsInCart[i].productID).productPrice;
                }
            }   

            return { products, admins, customers, shoppingCarts, productsInCart };
        });
        }

        app.get('/getAllCustomers', (req, res) => {
            let data = getNewPageData();

            data.then(result => {
                console.log("Data retrieved successfully:", result);
                console.log("Customers:", result.customers);
        
                res.send(result.customers);
            })
        })

        app.get('/getAllAdmins', (req, res) => {
            let data = getNewPageData();

            data.then(result => {
                console.log("Data retrieved successfully:", result);
                console.log("Admins:", result.admins);
        
                res.send(result.admins);
            })
        })

        app.get('/getAllProductsInCart', (req, res) => {
            let data = getNewPageData();

            data.then(result => {
                console.log("Data retrieved successfully:", result);
                console.log("ProductsInCart:", result.productsInCart);
        
                if(result.productsInCart === null) {
                    result.productsInCart = [{ empty: true }];
                }
                res.send(result.productsInCart);
            })
        })

        app.get('/getItAll', (req, res) => {
            let data = getNewPageData();

            data.then(result => {
                console.log(result)
                res.render('index', result);

            })
            
            // res.render('index', { artists, albums, songs, playlists, playlistSongs, favoritePlaylists, favoriteArtists, favoriteAlbums, favoriteSongs });
        })

        app.get('/', (req, res) => {
            let data = getNewPageData();

            data.then(result => {
                console.log(result)
                res.render('index', result);

            })
            
            // res.render('index', { artists, albums, songs, playlists, playlistSongs, favoritePlaylists, favoriteArtists, favoriteAlbums, favoriteSongs });
        })


        app.get('/refresh', (req, res) => {
            let data = getNewPageData();

            data.then(result => {
                // result.favoriteArtists = null;
                console.log(result)
                res.render('index', result);

            })
        })
        

        app.post('/removeFromCart', (req, res) => {
            const inputData = req.body.inputData;
   
            let action = inputData[0];
            let query;
            switch(action) {
                case "REMOVE_FROM_CART":
                    // query = `DELETE FROM FAVORITE_ARTISTS
                    //          WHERE FAVORITE_ARTISTS.Username = "MichaelHackmann13" AND FAVORITE_ARTISTS.Artist_id = "${inputData[1]}";`

                    query = `DELETE FROM ShoppingCartProduct
                            WHERE cartID = 1 
                            AND productID = "${inputData[1]}"`

                    break;
            }

            // console.log(inputData)
            // console.log(query);
            let removeFromCartPromise = mysqlQueryRunner(conn, query);
            removeFromCartPromise.then(result => console.log(`${action} SUCCESS: product with ID "${inputData[1]}" succesfully removed from cart`))
            .catch(err => console.log(err))

        })

        // app.post('/addFavorite', (req, res) => {
        app.post('/addToCart', (req, res) => {
            const inputData = req.body.inputData;

            let action = inputData[0];
            let query;
            switch(action) {
                case "ADD_TO_CART":
                    // query = `INSERT INTO FAVORITE_ARTISTS VALUES
                    //          ("MichaelHackmann13", "${inputData[1]}");`

                    query = `INSERT INTO ShoppingCartProduct (cartID, productID)
                            VALUES
                            (1, '${inputData[1]}');`;

                    break;
            }
            let addToCartPromise = mysqlQueryRunner(conn, query);
            addToCartPromise.then(result => console.log(`${action} SUCCESS: product with ID "${inputData[1]}" succesfully added to cart`))
            .catch(err => console.log(err))

        });




async function getProducts(conn) {

    const query = 'SELECT * FROM PRODUCT';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
            return rows;
            })
        //   .then( () => conn.end());

};
async function getAdmins(conn) {

    const query = 'SELECT * FROM ADMINISTRATOR';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
            return rows;
            })
        //   .then( () => conn.end());

};
async function getCustomers(conn) {

    const query = 'SELECT * FROM CUSTOMER';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
            return rows;
            })
        //   .then( () => conn.end());

};
async function getShoppingCarts(conn) {

    const query = 'SELECT * FROM SHOPPINGCART';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
            return rows;
            })
        //   .then( () => conn.end());

};
async function getShoppingCartProducts(conn) {

    const query = 'SELECT * FROM SHOPPINGCARTPRODUCT WHERE cartId = 1';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
            return rows;
            })
        //   .then( () => conn.end());

};
async function mysqlQueryRunner(conn, query) {

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
            return rows;
          })
        //   .then( () => conn.end());

};



// app.get('/artists', (req, res) => {
//     res.render('artists');
// });

}
renderPage();

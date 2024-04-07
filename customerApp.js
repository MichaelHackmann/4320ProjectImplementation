const express = require('express');
const router = express.Router();

let connectionrequest = require('./connectionrequest')

const { getNewPageData, mysqlQueryRunner } = require('./db')





router.get('/getAllCustomers', (req, res) => {

    let data = getNewPageData();

    data.then(result => {
        res.send(result.customers);
    })
})

router.get('/getAllAdmins', (req, res) => {


    let data = getNewPageData();

    data.then(result => {
        res.send(result.admins);
    })
})

router.get('/getAllProductsInCart', (req, res) => {

    console.log("get all products called");
    let data = getNewPageData();

    data.then(result => {

        if(result.productsInCart === null) {
            result.productsInCart = [{ empty: true }];
        }
        res.send(result.productsInCart);
    })

})

router.get('/getItAll', (req, res) => {

    let data = getNewPageData();

    data.then(result => {
        res.render('customer', result);
    })
    
})

router.get('/', (req, res) => {

    let data = getNewPageData();

    data.then(result => {
        res.render('customer', result);

    })
})


router.get('/refresh', (req, res) => {

    let data = getNewPageData();

    data.then(result => {
        res.render('customer', result);
    })
})


router.post('/removeFromCart', async (req, res) => {
    let conn = connectionrequest();

    const inputData = req.body.inputData;

    let action = inputData[0];
    inputData[1] = inputData[1].slice(0,-5)
    let query;
    switch(action) {
        case "REMOVE_FROM_CART":
            query = `DELETE FROM ShoppingCartProduct
                    WHERE cartID = 1 
                    AND productID = "${inputData[1]}"`
            break;
    }

    let removeFromCartPromise = mysqlQueryRunner(conn, query);
    removeFromCartPromise.then(result => console.log(`${action} SUCCESS: product with ID "${inputData[1]}" succesfully removed from cart`))
    .catch(err => console.log(err))

    conn.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.stack);
            return;
        }
        console.log('Database connection closed');
    });


})

router.post('/addToCart', async (req, res) => {
    let conn = connectionrequest();
    
    const inputData = req.body.inputData;

    let action = inputData[0];
    let query;
    switch(action) {
        case "ADD_TO_CART":
            query = `INSERT INTO ShoppingCartProduct (cartID, productID, productQty)
                    VALUES
                    (1, '${inputData[1]}', 1);`;

            break;
    }
    let addToCartPromise = mysqlQueryRunner(conn, query);
    addToCartPromise.then(result => console.log(`${action} SUCCESS: product with ID "${inputData[1]}" succesfully added to cart`))
    .catch(err => console.log(err))

    conn.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.stack);
            return;
        }
        console.log('Database connection closed');
    });
});

router.post('/updateCartQuantity', async (req, res) => {
    let conn = connectionrequest();
    
    const inputData = req.body.inputData;

    let productID = inputData[0];
    let newQty = inputData[1];
    let query;

    query = `UPDATE ShoppingCartProduct
            SET productQty = ${newQty}
            WHERE cartID = 1 AND productID = ${productID}`;

    let addToCartPromise = mysqlQueryRunner(conn, query);
    addToCartPromise.then(result => console.log(`UPDATE_QTY SUCCESS: product quantity with ID "${inputData[0]}" succesfully updated`))
    .catch(err => console.log(err))

    conn.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.stack);
            return;
        }
        console.log('Database connection closed');
    });
});

router.post('/incrementCartQuantity', async (req, res) => {
    let conn = connectionrequest();
    
    const inputData = req.body.inputData;

    let productID = inputData[0];
    let query;

    query = `UPDATE ShoppingCartProduct
            SET productQty = productQty + 1
            WHERE cartID = 1 AND productID = ${productID}`;

    let addToCartPromise = mysqlQueryRunner(conn, query);
    addToCartPromise.then(result => console.log(`INC_QTY SUCCESS: product quantity with ID "${inputData[0]}" succesfully incremented`))
    .catch(err => console.log(err))

    conn.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.stack);
            return;
        }
        console.log('Database connection closed');
    });
});


router.get('/admin', (req, res) => {
    res.render('admin');
});

router.get('/customer', (req, res) => {
    res.render('customer');
});
    

module.exports = router;
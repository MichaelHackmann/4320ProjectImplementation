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
        res.render('admin', result);
    })
    
})

router.get('/', (req, res) => {

    let data = getNewPageData();

    data.then(result => {
        res.render('admin', result);

    })
})


router.get('/refresh', (req, res) => {

    let data = getNewPageData();

    data.then(result => {
        res.render('admin', result);
    })
})


router.post('/removeFromCart', async (req, res) => {
    let conn = connectionrequest();

    const inputData = req.body.inputData;

    let action = inputData[0];
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

router.post('/updateProduct', async (req, res) => {
    let conn = connectionrequest();
    
    const inputData = req.body.inputData;

    let productID = inputData[0];
    let newPrice = inputData[1];
    let newQty = inputData[2];
    // console.log(productID);
    let query = `UPDATE Product
                SET productPrice = ${newPrice}, productQty = ${newQty}
                WHERE productID = '${productID}'`;

    let updatePromise = mysqlQueryRunner(conn, query);
    updatePromise.then(result => console.log(`UPDATE_PRODUCT SUCCESS: product with ID "${inputData[0]}" succesfully updated`))
    .catch(err => console.log(err))

    conn.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.stack);
            return;
        }
        console.log('Database connection closed');
    });
});

router.post('/deleteProduct', async (req, res) => {
    let conn = connectionrequest();
    
    const inputData = req.body.inputData;

    let productID = inputData;

    let query = `DELETE FROM ShoppingCartProduct WHERE productID = '${productID}'`;

    let deleteFromCartsPromise = mysqlQueryRunner(conn, query);
    deleteFromCartsPromise.then(result => console.log(`DELETE_PRODUCT_FROM_CARTS SUCCESS: product with ID "${productID}" succesfully deleted from all shopping carts`))
    .catch(err => console.log(err))

    query = `DELETE FROM Product WHERE productID = '${productID}'`;

    let deletePromise = mysqlQueryRunner(conn, query);
    deletePromise.then(result => console.log(`DELETE_PRODUCT SUCCESS: product with ID "${productID}" succesfully deleted`))
    .catch(err => console.log(err))
    

    conn.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.stack);
            return;
        }
        console.log('Database connection closed');
    });
});

router.post('/addProduct', async (req, res) => {
    let conn = connectionrequest();
    
    const inputData = req.body.inputData;

    let productName = inputData[0];
    let productDescription = inputData[1];
    let productPrice = inputData[2];
    let productQty = inputData[3];
    let department = inputData[4];
    let category = inputData[5];
    let brand = inputData[6];

    console.log(inputData);

    let query = `INSERT INTO Product (productName, productDescription, productPrice, productQty, department, category, brand)
                VALUES ('${productName}', '${productDescription}', ${productPrice}, ${productQty}, '${department}', '${category}', '${brand}')`;

    let addProductPromise = mysqlQueryRunner(conn, query);
    addProductPromise.then(result => console.log(`ADD_PRODUCT SUCCESS: product with ID "${productName}" succesfully added to DB`))
    .catch(err => console.log(err))

    conn.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.stack);
            return;
        }
        console.log('Database connection closed');
    });
});

router.post('/loginAdmin', async (req, res) => {
    let conn = connectionrequest();
    
    const inputData = req.body.inputData;

    let productName = inputData[0];
    let productDescription = inputData[1];
    let productPrice = inputData[2];
    let productQty = inputData[3];
    let department = inputData[4];
    let category = inputData[5];
    let brand = inputData[6];

    console.log(inputData);

    let query = `INSERT INTO Product (productName, productDescription, productPrice, productQty, department, category, brand)
                VALUES ('${productName}', '${productDescription}', ${productPrice}, ${productQty}, '${department}', '${category}', '${brand}')`;

    let addProductPromise = mysqlQueryRunner(conn, query);
    addProductPromise.then(result => console.log(`ADD_PRODUCT SUCCESS: product with ID "${productName}" succesfully added to DB`))
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
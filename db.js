const connectionrequest = require('./connectionrequest');





async function getNewPageData() {
    conn = connectionrequest()

    let productsPromise = getProducts(conn);
    let adminPromise = getAdmins(conn);
    let customerPromise = getCustomers(conn);
    let shoppingCartPromise = getShoppingCarts(conn);
    let shoppingCartProductsPromise = getShoppingCartProducts(conn);
    let brandsPromise = getBrands(conn);
    let departmentsPromise = getDepartments(conn);
    let categoriesPromise = getCategories(conn);
    let loggedInCustomerPromise = getLoggedInCustomer(conn);

    


    return Promise.all([productsPromise, adminPromise, customerPromise, shoppingCartPromise, shoppingCartProductsPromise, brandsPromise, departmentsPromise, categoriesPromise, loggedInCustomerPromise])
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

        let brands;
        results[5] == "" ? brands = null : brands = results[5];

        let departments;
        results[6] == "" ? departments = null : departments = results[6];

        let categories;
        results[7] == "" ? categories = null : categories = results[7];

        let loggedInCustomer = results[8];


        if(productsInCart !== null) {
            for(let i = 0; i < productsInCart.length; i++) {
                productsInCart[i].productName = products.find(obj => obj.productID === productsInCart[i].productID).productName;
                productsInCart[i].customerID = shoppingCarts.find(obj => obj.cartID === productsInCart[i].cartID).customerID;
                productsInCart[i].productPrice = products.find(obj => obj.productID === productsInCart[i].productID).productPrice;
            }
        }   

        conn.end((err) => {
            if (err) {
                console.error('Error closing the database connection:', err.stack);
                return;
            }
            console.log('Database connection closed');
        });

        return { products, admins, customers, shoppingCarts, productsInCart, brands, departments, categories, loggedInCustomer };
    });
}

async function getProducts(conn) {

    const query = 'SELECT * FROM PRODUCT';

    console.log("Connection: " + conn);
    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })
};
async function getAdmins(conn) {

    const query = 'SELECT * FROM ADMINISTRATOR';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })

};
async function getCustomers(conn) {


    const query = 'SELECT * FROM CUSTOMER';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })

};
async function getShoppingCarts(conn) {

    const query = 'SELECT * FROM SHOPPINGCART';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })
};
async function getBrands(conn) {

    const query = 'SELECT * FROM BRAND';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })
};
async function getDepartments(conn) {

    const query = 'SELECT * FROM DEPARTMENT';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })
};
async function getCategories(conn) {

    const query = 'SELECT * FROM CATEGORY';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })
};
async function getShoppingCartProducts(conn) {

    const query = 'SELECT * FROM SHOPPINGCARTPRODUCT WHERE cartId = 1';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })
};
async function getLoggedInCustomer(conn) {

    const query = 'SELECT loggedIn FROM LoggedInCustomer WHERE customerID = "CUST001";';

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
            })
};
async function mysqlQueryRunner(conn, query) {

    return conn.promise().query(query)
        .then( ([rows,fields]) => {
        
            return rows;
        })

};


// module.exports = { getNewPageData, getProducts, getAdmins, getCustomers, getShoppingCarts, getShoppingCartProducts, mysqlQueryRunner };
module.exports = { getNewPageData, mysqlQueryRunner };
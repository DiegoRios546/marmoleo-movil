const express = require('express');
const router = express.Router();
const { ping } = require('../controllers/pingController');
const { login } = require('../controllers/loginController');
const { register } = require('../controllers/registerController');
const { getOrders, updateAdminOrder, assignDriverToOrder, getUserOrders, createUserOrder, updateUserOrder, deleteUserOrder, getAssignedOrders, updateOrderStatusByModerator} = require('../controllers/orderController');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { getUsers, createUser, updateUser, deleteUser, getUsersByRole } = require('../controllers/userController'); 
const { getBusinessInfo, updateBusinessInfo } = require('../controllers/businessInfoController');
const authorizeRoles = require('../middleware/authRoleMiddleware');

router.get('/ping', ping);
router.post('/login', login);
router.post('/register', register);

// Rutas para pedidos (admin)
router.get('/api/orders', authorizeRoles(['admin']), getOrders);
router.put('/api/orders/:orderId', authorizeRoles(['admin']), updateAdminOrder); 
router.put('/api/orders/:orderId/assign-driver', authorizeRoles(['admin']), assignDriverToOrder);

// Rutas para pedidos (moderator/repartidor)
router.get('/api/moderator/orders', authorizeRoles(['moderator']), getAssignedOrders);
router.put('/api/moderator/orders/:orderId', authorizeRoles(['moderator']), updateOrderStatusByModerator);

// Rutas para pedidos (user)
router.get('/api/user/orders', authorizeRoles(['user']), getUserOrders);
router.post('/api/user/orders', authorizeRoles(['user']), createUserOrder);
router.put('/api/user/orders/:orderId', authorizeRoles(['user']), updateUserOrder);
router.delete('/api/user/orders/:orderId', authorizeRoles(['user']), deleteUserOrder);



// Rutas para productos
router.get('/api/products', authorizeRoles(['admin']), getProducts);
router.get('/api/products/:productId', authorizeRoles(['admin']), getProductById);
router.post('/api/products', authorizeRoles(['admin']), createProduct);
router.put('/api/products/:productId', authorizeRoles(['admin']), updateProduct);
router.delete('/api/products/:productId', authorizeRoles(['admin']), deleteProduct);

// Rutas para categorías
router.get('/api/categories', authorizeRoles(['admin']), getCategories);
router.post('/api/categories', authorizeRoles(['admin']), createCategory);
router.put('/api/categories/:categoryId', authorizeRoles(['admin']), updateCategory);
router.delete('/api/categories/:categoryId', authorizeRoles(['admin']), deleteCategory);

// Rutas para usuarios
router.get('/api/users', authorizeRoles(['admin']), getUsers);
router.post('/api/users', authorizeRoles(['admin']), createUser);
router.put('/api/users/:userId', authorizeRoles(['admin']), updateUser);
router.delete('/api/users/:userId', authorizeRoles(['admin']), deleteUser);
router.get('/api/users/role/:role', authorizeRoles(['admin']), getUsersByRole); // Nueva ruta para obtener usuarios por rol

//rutas para business
router.get('/api/business-info', authorizeRoles(['admin']), getBusinessInfo);
router.put('/api/business-info', authorizeRoles(['admin']), updateBusinessInfo);

module.exports = router;
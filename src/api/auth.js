import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

// Funciones para interactuar con la API de pedidos (moderator/repartidor)
export const fetchAssignedOrders = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/moderator/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching assigned orders:", error);
        throw error;
    }
};

export const updateOrderStatusByModerator = async (token, orderId, status) => {
    try {
        const response = await axios.put(`${API_URL}/api/moderator/orders/${orderId}`, { estado: status }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Devuelve la respuesta para manejarla en el frontend si es necesario
    } catch (error) {
        console.error(`Error updating order ${orderId} by moderator:`, error);
        throw error;
    }
};


// Funciones para interactuar con la API de pedidos (admin)
export const fetchOrders = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const updateOrderStatus = async (token, orderId, status) => {
    try {
        await axios.put(`${API_URL}/api/orders/${orderId}`, { estado: status }, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error(`Error updating order ${orderId}:`, error);
        throw error;
    }
};

export const assignDriverToOrder = async (token, orderId, driverId) => {
    try {
        const response = await axios.put(`${API_URL}/api/orders/${orderId}/assign-driver`, { driverId }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error assigning driver ${driverId} to order ${orderId}:`, error);
        throw error;
    }
};

// Funciones para interactuar con la API de pedidos (user)
export const fetchUserOrders = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/user/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error;
    }
};

export const createOrder = async (token, orderData) => {
    try {
        // Decodifica el token para obtener el user_id
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Agrega el user_id a los datos del pedido
        const orderDataWithUserId = { ...orderData, user_id: userId };

        const response = await axios.post(`${API_URL}/api/user/orders`, orderDataWithUserId, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export const updateOrder = async (token, orderId, orderData) => {
    try {
        const response = await axios.put(`${API_URL}/api/user/orders/${orderId}`, orderData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating order ${orderId}:`, error);
        throw error;
    }
};

export const deleteOrder = async (token, orderId) => {
    try {
        await axios.delete(`${API_URL}/api/user/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error);
        throw error;
    }
};



// Funciones para interactuar con la API de productos (actualizadas)
export const fetchProducts = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const createProduct = async (token, productData) => {
    try {
        const response = await axios.post(`${API_URL}/api/products`, {
            nombre: productData.nombre,
            descripcion: productData.descripcion,
            precio: productData.precio,
            unidad_medida: productData.unidad_medida,
            categoria_id: productData.categoria_id,
            imagen_url: productData.imagen_url,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const updateProduct = async (token, productId, productData) => {
    try {
        const response = await axios.put(`${API_URL}/api/products/${productId}`, {
            nombre: productData.nombre,
            descripcion: productData.descripcion,
            precio: productData.precio,
            unidad_medida: productData.unidad_medida,
            categoria_id: productData.categoria_id,
            imagen_url: productData.imagen_url,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${productId}:`, error);
        throw error;
    }
};

export const deleteProduct = async (token, productId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting product with ID ${productId}:`, error);
        throw error;
    }
};

// Funciones para interactuar con la API de categorías
export const fetchCategories = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const createCategory = async (token, categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/api/categories`, { nombre: categoryData.nombre }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const updateCategory = async (token, categoryId, categoryData) => {
    try {
        const response = await axios.put(`${API_URL}/api/categories/${categoryId}`, { nombre: categoryData.nombre }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating category with ID ${categoryId}:`, error);
        throw error;
    }
};

export const deleteCategory = async (token, categoryId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/categories/${categoryId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting category with ID ${categoryId}:`, error);
        throw error;
    }
};

// Funciones para interactuar con la API de usuarios
export const fetchUsers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Nueva función para obtener usuarios por rol (moderadores)
export const fetchUsersByRole = async (token, role) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/role/${role}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching users with role ${role}:`, error);
        throw error;
    }
};

export const createUser = async (token, userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/users`, {
            phone: userData.phone,
            name: userData.name,
            email: userData.email,
            username: userData.username,
            password: userData.password, // Consider hashing on the backend
            role: userData.role,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const updateUser = async (token, userId, userData) => {
    try {
        const response = await axios.put(`${API_URL}/api/users/${userId}`, {
            phone: userData.phone,
            name: userData.name,
            email: userData.email,
            username: userData.username,
            password: userData.password, // Consider allowing empty or specific update logic
            role: userData.role,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error;
    }
};

export const deleteUser = async (token, userId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
};


export const fetchBusinessInfo = async (token) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/business-info`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching business info:", error);
        throw error;
    }
};

export const updateBusinessInfoAPI = async (token, businessInfo) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/business-info`, businessInfo, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating business info:", error);
        throw error;
    }
};

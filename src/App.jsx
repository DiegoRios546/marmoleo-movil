import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ModeratorDashboard from './pages/moderator/ModeratorDashboard';
import UserDashboard from './pages/user/UserDashboard';
import RoleProtectedRoute from './components/RoleProtectedRoute';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                    <Stack.Screen
                        name="AdminDashboard"
                        component={AdminDashboard}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ModeratorDashboard"
                        component={ModeratorDashboard}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="UserDashboard"
                        component={UserDashboard}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
};

export default App;
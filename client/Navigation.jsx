import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginPage } from './views/LoginPage';
import { MainPage } from './views/MainPage';
import { SignupPage } from './views/SignUpPage';
import { WardrobeItemPage } from './views/WardrobeRoute/WardrobeItemPage';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Welcome!' }} />
        <Stack.Screen name="SignUp" component={SignupPage} options={{ title: 'Sign Up Now!' }} />
        <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false, }} />
        
        <Stack.Screen name="Wardrobe-item" component={WardrobeItemPage} options={{ headerShown: false, }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
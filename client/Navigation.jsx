import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginPage } from './views/LoginPage';
import { MainPage } from './views/MainPage';
import { SignupPage } from './views/SignUpPage';
import { WardrobeItemPage } from './views/WardrobeRoute/WardrobeItemPage';
import { OutfitEditPage_wardrobe } from './views/OutfitRoute/OutfitEditPage-wardrobe';
import { OutfitEditPage_ai } from './views/OutfitRoute/OutfitEditPage-ai';
import { OutfitAIConfigPage } from './views/OutfitRoute/OutfitAIConfigPage';
import { OutfitWardrobeConfigPage } from './views/OutfitRoute/OutfitWardrobeConfigPage';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Welcome!' }} />
        <Stack.Screen name="SignUp" component={SignupPage} options={{ title: 'Sign Up Now!' }} />
        <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false, }} />
        
        <Stack.Screen name="Wardrobe-item" component={WardrobeItemPage} options={{ headerShown: false, }} />
        
        <Stack.Screen name="Outfit-new-from_wardrobe_edit" component={OutfitEditPage_wardrobe} options={{ headerShown: false, }} />
        <Stack.Screen name="Outfit-new-from_ai_edit" component={OutfitEditPage_ai} options={{ headerShown: false, }} />
        <Stack.Screen name="Outfit-new-ai_config" component={OutfitAIConfigPage} options={{ headerShown: false, }} />
        <Stack.Screen name="Outfit-new-wardrobe_config" component={OutfitWardrobeConfigPage} options={{ headerShown: false, }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
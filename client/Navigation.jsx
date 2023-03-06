import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {Home} from './views/Home';

const Stack = createNativeStackNavigator();

export const Navigation = () => { 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{title: 'Welcome!'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
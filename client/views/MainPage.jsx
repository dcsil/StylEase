import { Appbar, BottomNavigation, Button } from 'react-native-paper';
import { StatusBar, Text, View } from 'react-native';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSelector } from 'react-redux';

import { WardrobeRoute } from './WardrobeRoute';
import { CalendarRoute } from './CalendarRoute';

const HomeRoute = ({ }) => {
  // const userData = useSelector(state => state.user.userInfo.data);
  // const userId = useSelector(state => state.user.userInfo._id);
  return (
    <View>
      <StatusBar style="auto" />
      <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.Content title="Home" />
      </Appbar.Header>
      <Text>Home</Text>
      {/* <Text>{JSON.stringify(userData)}</Text> */}
    </View>
  )
}


const OutfitRoute = () => (
  <View>
    <StatusBar style="auto" />
    <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
      <Appbar.Content title="Outfit" />
    </Appbar.Header>
    <Text>Outfit</Text>
  </View>
);
// const CalendarRoute = () => (
//   <View>
//     <StatusBar style="auto" />
//     <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
//       <Appbar.Content title="Calendar" />
//     </Appbar.Header>
//     <Text>Hello</Text>
//   </View>
// );
const ProfileRoute = ({ navigation }) => (
  <View>
    <StatusBar style="auto" />
    <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
      <Appbar.Content title="Profile" />
    </Appbar.Header>
    <Text>Profile</Text>
    <Button icon="cursor-pointer" mode="contained" onPress={() => navigation.navigate('Calendar')}>
      To Calendar
    </Button>
    <Button icon="cursor-pointer" mode="contained" onPress={() => navigation.navigate('Login')}>
      To Login
    </Button>
  </View>
);

const Tab = createBottomTabNavigator();

export const MainPage = ({ navigation }) => {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior='history'
      screenOptions={{
        headerShown: false,
      }}
      tabBar={
        ({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            navigationState={state}
            style={{ height: 85 }}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.navigate(route);
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: 24 });
              }

              return null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                    ? options.title
                    : route.title;

              return label;
            }}
          />
        )
      }
    >
      <Tab.Screen
        name="Home"
        component={HomeRoute}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home-outline" size={size} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeRoute}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="wardrobe-outline" size={size} color={color} />,
          tabBarLabel: 'Wardrobe',
        }}
      />
      <Tab.Screen
        name="Outfit"
        component={OutfitRoute}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="hanger" size={size} color={color} />,
          tabBarLabel: 'Outfit',
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarRoute}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="calendar-month-outline" size={size} color={color} />,
          tabBarLabel: 'Calendar',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileRoute}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="account-box-outline" size={size} color={color} />,
          tabBarLabel: 'Me',
        }}
      />
    </Tab.Navigator>
  )
}
import { Appbar, BottomNavigation, Button } from 'react-native-paper';
import { Image, ScrollView, StatusBar, Text, View } from 'react-native';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSelector } from 'react-redux';

import { WardrobeRoute } from './WardrobeRoute';
import { OutfitRoute } from './OutfitRoute';
import { CalendarRoute } from './CalendarRoute';
import { imageUriParser } from '../utils/urlParser';

import { DefaultAppBar } from '../components/DefaultAppbar';

const HomeRoute = ({ }) => {
  const user = useSelector(state => state.user);
  // const userId = useSelector(state => state.user.userInfo._id);
  return (
    <ScrollView testID='HomeRoute'>
      <DefaultAppBar title="Home" />

      <View style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image
          source={{
            uri: imageUriParser("642df77cd1038d49ecfa3983")
          }}
          style={{
            width: 400,
            height: 600,
            resizeMode: 'stretch'
          }}
        />
      </View>
    </ScrollView>
  )
}

const ProfileRoute = ({ navigation }) => (
  <View testID='ProfileRoute'>
    <DefaultAppBar title="Profile" />
    <Text>Profile</Text>
    <Button icon="cursor-pointer" mode="contained" onPress={() => navigation.navigate('Calendar')}>
      To Calendar
    </Button>
    <Button icon="cursor-pointer" mode="contained" onPress={() => navigation.navigate('Login')}>
      To Login
    </Button>
  </View>
);

const ScreenBuilder = (routeName, routeComponent, routeIconName) => {
  return (
    <Tab.Screen
      key={routeName}
      name={routeName}
      component={routeComponent}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name={routeIconName} size={size} color={color} />,
        tabBarLabel: routeName,
      }}
    />
  )
}

const Tab = createBottomTabNavigator();

const Routers = [
  { name: 'Home', component: HomeRoute, iconName: 'home-outline' },
  { name: 'Wardrobe', component: WardrobeRoute, iconName: 'wardrobe-outline' },
  { name: 'Outfit', component: OutfitRoute, iconName: 'hanger' },
  { name: 'Calendar', component: CalendarRoute, iconName: 'calendar-month-outline' },
  { name: 'Profile', component: ProfileRoute, iconName: 'account-box-outline' },
];

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
            testID='lol'
            getTestID={({ route }) => {
              // console.log(route);
              return `${route.name}-tab`;
            }}
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
      { Routers.map((route) => ScreenBuilder(route.name, route.component, route.iconName)) }
      {/* <Tab.Screen
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
      /> */}
    </Tab.Navigator>
  )
}
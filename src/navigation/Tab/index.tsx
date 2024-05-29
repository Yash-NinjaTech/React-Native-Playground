import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image} from 'react-native';
import {HomeScreen, SettingsScreen, ToDoScreen} from '../../pages';

const Tab = createBottomTabNavigator();

const HomeTabIcon = () => (
  <Image
    height={40}
    width={40}
    source={require('../../assets/home.png')}
    style={{width: 20, height: 20}}
  />
);

const ToDoTabIcon = () => (
  <Image
    height={40}
    width={40}
    source={{
      uri: 'https://static.vecteezy.com/system/resources/previews/009/102/019/non_2x/time-icon-fast-time-symbol-isolated-illustration-stock-free-vector.jpg',
    }}
    style={{width: 33, height: 33}}
  />
);

const SettingTabIcon = () => (
  <Image
    height={40}
    width={40}
    source={{
      uri: 'https://png.pngtree.com/element_our/png/20181227/settings-glyph-black-icon-png_292947.jpg',
    }}
    style={{width: 25, height: 25}}
  />
);

const TabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: HomeTabIcon,
        }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ToDoTabIcon,
        }}
        name="ToDo"
        component={ToDoScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          headerShown: false,
          tabBarIcon: SettingTabIcon,
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

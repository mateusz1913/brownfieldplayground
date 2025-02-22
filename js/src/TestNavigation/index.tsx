import type { StaticParamList } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import DetailScreen from './screens/Detail';
import InitialScreen from './screens/Initial';

const RootStack = createNativeStackNavigator({
    screens: {
        Initial: InitialScreen,
        Detail: DetailScreen,
    },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default Navigation;

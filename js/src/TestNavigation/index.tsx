import type { StaticParamList } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import DetailScreen from './screens/Detail';
import DetailImageModalScreen from './screens/DetailImageModal';
import InitialScreen from './screens/Initial';

const RootStack = createNativeStackNavigator({
    screens: {
        Initial: InitialScreen,
        Detail: DetailScreen,
        DetailImageModal: {
            screen: DetailImageModalScreen,
            options: {
                animation: 'slide_from_bottom',
                headerShown: false,
                presentation: 'transparentModal',
            },
        },
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

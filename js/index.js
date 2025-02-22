import { AppRegistry } from 'react-native';

import Test from './src/Test';
import TestEmbedded from './src/TestEmbedded';
import TestNavigation from './src/TestNavigation';

AppRegistry.registerComponent('Test', () => Test);
AppRegistry.registerComponent('TestEmbedded', () => TestEmbedded);
AppRegistry.registerComponent('TestNavigation', () => TestNavigation);

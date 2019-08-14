import { createStackNavigator } from 'react-navigation';

import List from '../container/List/list';
import ListMap from '../container/List/listMap';
import ListMenu from '../container/List/ListMenu/listMenu';
import StoreMap from '../container/List/ListMenu/storeMap';
import Booked from '../container/List/listBooked';
const ListStack = createStackNavigator(
    {
        List,
        ListMap,
        ListMenu,
        StoreMap,
        Booked,
    },
    {
        initialRouteName : 'List',
        headerMode : 'none'
    }
)

/*
ListStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
}
*/

export default ListStack;
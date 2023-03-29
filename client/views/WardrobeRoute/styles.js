import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderColor: 'red',

    // marginHorizontal: 5,
    // backgroundColor: 'transparent',
  },
  searchBarContainer: {
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderColor: 'red',
    marginHorizontal: 15,
    marginTop: 5,
  },
  searchBar: {
    marginVertical: 0,
    borderRadius: 3,
    padding: 0,
    margin: 0,
  },
  listSection: {
    flex: 1,
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
  flatListContainer: {
    // alignItems: 'center',
  },
  image: {
    width: 130,
    height: 130,
    resizeMode: 'stretch',
    margin: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  }
});
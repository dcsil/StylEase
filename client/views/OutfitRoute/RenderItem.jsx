import React from "react";
import { Image, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { imageUriParser } from "../../utils/urlParser";

export const RenderItem = ({ item, setWardrobeItems, imgSize, imgStyle=null }) => {
  const handlePress = React.useCallback(() => {
    item.checked = !item.checked;
    setWardrobeItems(prev => {
      return prev.map((prevItem) => prevItem._id === item._id ? item : prevItem)
    });
  }, []);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={{
        position: 'relative',
        // borderColor: 'blue', borderWidth: 2,
        flex: 1,
      }}>
        <Image
          source={{
            uri: imageUriParser(item._id),
          }}
          style={imgStyle? imgStyle : { width: imgSize, height: imgSize, resizeMode: 'stretch', margin: 3 }} />
        {item.checked && (
          <View style={{ position: 'absolute', top: 5, right: 5 }}>
            <Icon name="check" size={20} color="green" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
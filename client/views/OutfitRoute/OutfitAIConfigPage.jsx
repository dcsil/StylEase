import React from "react";
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, VirtualizedList } from "react-native"
import { Appbar, Button, Chip, List, TextInput, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from "react-redux";
import { imageUriParser } from "../../utils/urlParser";
import { StatusBar } from "expo-status-bar";
import { outfitRecommend } from "../../api/requests";

const IMAGE_SIZE = 100;
const OCCASION_LIST = ["Casual", "Formal", "Sporty", "Work", "Vacation", "Party", "Other"];
const SEASON_LIST = ["Spring", "Summer", "Fall", "Winter"];
const WEATHER_LIST = ["Sunny", "Cloudy", "Rainy", "Snowy"];

export const OutfitAIConfigPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { colors } = useTheme();

  const ogWardrobeItems = React.useMemo(() => user.userInfo.data?.wardrobe?.items ? user.userInfo.data.wardrobe.items : [], [user.userInfo.data?.wardrobe?.items]);
  const [wardrobeItems, setWardrobeItems] = React.useState(ogWardrobeItems.map(item => { return { ...item, checked: false } }));
  const [numColumns, setNumColumns] = React.useState(5);
  const [outfitData, setOutfitData] = React.useState({ name: '', items: [] });
  const [configs, setConfigs] = React.useState({
    occasion: "Casual",
    season: "Spring",
    weather: "Sunny",
  });

  React.useEffect(() => {
    setWardrobeItems(ogWardrobeItems.map(item => { return { ...item, checked: false } }))
  }, [ogWardrobeItems])

  const onLayout = React.useCallback(() => {
    const { width } = Dimensions.get('window');
    const itemWidth = IMAGE_SIZE;
    const numColumns = Math.floor((width - 20) / itemWidth);
    setNumColumns(numColumns);
  }, [])

  const handleSubmit = React.useCallback(async () => { 
    const outfitTBS = {
      ...outfitData,
      ...configs,
    };
    outfitTBS.items = wardrobeItems.filter(item => item.checked).map(item => item._id);
    // TODO: get the outfit data from the backend
    // const rmdOutfit = await outfitRecommend(outfitTBS, false);
    const rmdOutfit = {
      name: "Outfit 1",
      items: [
      ],
      occasion: "Casual",
      season: "Spring",
      weather: "Sunny",
    }

    navigation.navigate('Outfit-new-from-ai-edit', { outfit: rmdOutfit });
  }, [])

  return (
    <View style={{
      flex: 1,
    }}>
      <StatusBar barStyle="auto" />
      <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.BackAction onPress={() => { navigation.goBack() }} />
      </Appbar.Header>

      <ScrollView>
        <View style={{
          display: 'flex', flexDirection: 'column',
          width: '100%',
          // borderColor: 'blue', borderWidth: 2,
          paddingHorizontal: 10,
        }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 5,
              marginTop: 10,
            }}
          >
            Basic Information
          </Text>
          <TextInput
            label="Please give a name to this outfit."
            value={outfitData.name}
            onChangeText={(text) => setOutfitData(prev => { return { ...prev, name: text } })}
            mode="outlined"
          />
          <RenderChipConfig chipList={OCCASION_LIST} curr={configs.occasion} title="Occasion" setConfig={(item) => setConfigs(prev => { return { ...prev, occasion: item } })} />
          <RenderChipConfig chipList={SEASON_LIST} curr={configs.season} title="Season" setConfig={(item) => setConfigs(prev => { return { ...prev, season: item } })} />
          <RenderChipConfig chipList={WEATHER_LIST} curr={configs.weather} title="Weather" setConfig={(item) => setConfigs(prev => { return { ...prev, weather: item } })} />
        </View>

        <View style={{
          display: 'flex', flexDirection: 'column',
          width: '100%',
          // borderColor: 'blue', borderWidth: 2,
          paddingHorizontal: 10,
        }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 5,
              marginTop: 10,
            }}
          >
            Select any item in your wardrobe:
          </Text>
          <ScrollView horizontal={true} scrollEnabled={false} contentContainerStyle={{
            width: '100%',
            display: 'flex', flexDirection: 'column',
            // borderColor: 'green', borderWidth: 2,
          }}>
            <View style={{
              display: 'flex', flexDirection: 'column',
              height: Dimensions.get('window').height * 0.4,
              // borderColor: 'green', borderWidth: 2,
              backgroundColor: colors.onPrimaryContainer,
              borderRadius: 10,
            }}>
              <List.Section
                style={{
                  flex: 1,
                  // borderColor: 'red', borderWidth: 2,
                }}
                onLayout={onLayout}>
                {wardrobeItems.length === 0 ? (
                  <Text style={{ marginTop: 50 }}>No item found.</Text>
                ) : (

                  <FlatList
                    key={`OutfitAIConfigPage-${numColumns}`}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                    }}
                    contentContainerStyle={{
                      display: "flex",
                      // borderColor: 'blue', borderWidth: 2,
                    }}
                    numColumns={numColumns}
                    directionalLockEnabled={true}
                    data={wardrobeItems}
                    renderItem={({ item }) => <RenderItem item={item} setWardrobeItems={setWardrobeItems} />}
                    keyExtractor={(item) => item._id}
                  />
                )}
              </List.Section>
            </View>
          </ScrollView>

        </View>

        <View style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          marginVertical: 20,
        }}>
          <Button
            mode="contained-tonal"
            style={{ borderRadius: 5 }}
            onPress={handleSubmit}
          >
            Generate Outfit
          </Button>
        </View>
      </ScrollView>

    </View>
  )
}

// render item
const RenderItem = ({ item, setWardrobeItems }) => {
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
          style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, resizeMode: 'stretch', margin: 3 }} />
        {item.checked && (
          <View style={{ position: 'absolute', top: 5, right: 5 }}>
            <Icon name="check" size={20} color="green" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// render chip
const RenderChip = ({ item, curr, setConfig }) => {

  return (
    <Chip
      selected={item === curr}
      onPress={() => setConfig(item)}
      style={{
        marginVertical: 5,
        marginRight: 10,
      }}
    >
      {item}
    </Chip>
  )
}

// render chipConfig 
const RenderChipConfig = ({ chipList, curr, title, setConfig }) => {
  const { colors } = useTheme();
  return (
    <View style={{
      display: 'flex', flexDirection: 'column',
      width: '100%',
    }}>
      <List.Section
        style={{
        }}>
        <List.Subheader
          style={{
            color: colors.surface,
            fontSize: 16,
            fontWeight: 'bold',
            paddingLeft: 0,
          }}
        >
          {title}
        </List.Subheader>
        <View style={{
          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        }}>
          {chipList.map((item) => <RenderChip key={item._id} item={item} curr={curr} setConfig={setConfig} />)}
        </View>
      </List.Section>
    </View>
  )
}
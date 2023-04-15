import React from "react";
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, VirtualizedList } from "react-native"
import { Appbar, Button, Chip, List, Switch, TextInput, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from "react-redux";
import { imageUriParser } from "../../utils/urlParser";
import { StatusBar } from "expo-status-bar";
import { outfitRecommend } from "../../api/requests";
import { DefaultAppBar } from "../../components/DefaultAppbar";
import { RenderItem } from "./RenderItem";
import { RenderChipConfig } from "./RenderChipConfig";

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
    fromMarket: true,
  });

  // React.useEffect(() => { 
  //   console.log(`outfitData.name: ${outfitData.name}`);
  // }, [outfitData]);

  React.useEffect(() => {
    setWardrobeItems(ogWardrobeItems.map(item => { return { ...item, checked: false } }))
  }, [ogWardrobeItems])

  const onLayout = React.useCallback(() => {
    const { width } = Dimensions.get('window');
    const itemWidth = IMAGE_SIZE;
    const numColumns = Math.floor((width - 20) / itemWidth);
    setNumColumns(numColumns);
  }, [])

  const handleSubmit = async () => {
    // console.log(outfitData);
    const outfitTBS = {
      ...outfitData,
      ...configs,
    };
    outfitTBS.items = wardrobeItems.filter(item => item.checked).map(item => item._id);
    // console.log(outfitTBS.name);
    // get the outfit data from the backend
    const rmdOutfit = await outfitRecommend(user.userInfo._id, outfitTBS, false);

    navigation.navigate('Outfit-new-from_ai_edit', { outfit: rmdOutfit.ai_outfit });
  }

  return (
    <View style={{
      flex: 1,
    }}>
      <DefaultAppBar title="Outfit AI Config" backActionCallback={() => { navigation.goBack() }} showTitle={false} />

      <ScrollView>
        <View style={{
          display: 'flex', flexDirection: 'column',
          width: '100%',
          // borderColor: 'blue', borderWidth: 2,
          paddingHorizontal: 10,
        }}>
          {/* <Text>{JSON.stringify(outfitData)}</Text> */}
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
          
          <View style={{}}>
            <Switch value={configs.fromMarket} onValueChange={() => setConfigs(prev => {return {...configs, fromMarket: !prev.fromMarket}})}/>
          </View>
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
            Select items from your wardrobe:
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
                    renderItem={({ item }) => <RenderItem item={item} setWardrobeItems={setWardrobeItems} imgSize={IMAGE_SIZE}/>}
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
            disabled={outfitData.name === ''}
          >
            Generate Outfit
          </Button>
        </View>
      </ScrollView>

    </View>
  )
}
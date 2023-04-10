import React from "react";
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, VirtualizedList } from "react-native"
import { Appbar, Button, Chip, Divider, List, TextInput, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from "react-redux";
import { imageUriParser } from "../../utils/urlParser";
import { StatusBar } from "expo-status-bar";
import { outfitRecommend } from "../../api/requests";
import { DefaultAppBar } from "../../components/DefaultAppbar";

const IMAGE_SIZE = 100;
const OCCASION_LIST = ["Casual", "Formal", "Sporty", "Work", "Vacation", "Party", "Other"];
const SEASON_LIST = ["Spring", "Summer", "Fall", "Winter"];
const WEATHER_LIST = ["Sunny", "Cloudy", "Rainy", "Snowy"];

export const OutfitWardrobeConfigPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { colors } = useTheme();

  const [outfitData, setOutfitData] = React.useState({ name: '', items: [] });
  const [configs, setConfigs] = React.useState({
    occasion: "Casual",
    season: "Spring",
    weather: "Sunny",
  });

  const handleSubmit = () => {
    console.log(outfitData);
    const outfitTBS = {
      ...outfitData,
      ...configs,
    };
    // outfitTBS.items = wardrobeItems.filter(item => item.checked).map(item => item._id);
    // console.log(outfitTBS.name);

    navigation.navigate('Outfit-new-from_wardrobe_edit', { outfit: outfitTBS });
  }

  return (
    <View style={{
      flex: 1,
    }}>
      <DefaultAppBar title="Outfit Wardrobe Config" backActionCallback={() => { navigation.goBack() }} showTitle={ false } />

      <ScrollView>
        <View style={{
          display: 'flex', flexDirection: 'column',
          width: '100%',
          // borderColor: 'blue', borderWidth: 2,
          paddingHorizontal: 10,
        }}>
          {/* <Text>{ JSON.stringify(outfitData) }</Text> */}
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

        <Divider style={{ marginVertical: 20 }} />
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
            Build My Outfit
          </Button>
        </View>
      </ScrollView>

    </View>
  )
}

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
            // color: colors.surface,
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
          {chipList.map((item) => <RenderChip key={item} item={item} curr={curr} setConfig={setConfig} />)}
        </View>
      </List.Section>
    </View>
  )
}
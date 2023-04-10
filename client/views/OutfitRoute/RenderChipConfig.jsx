import { Chip, List, useTheme } from "react-native-paper";
import { View } from "react-native"

export const RenderChipConfig = ({ chipList, curr, title, setConfig }) => {
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
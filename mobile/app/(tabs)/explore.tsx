import {View, Text, StyleSheet} from "react-native" ; 

export default function TabTwoScreen() {
  return (
    <View><Text>This is the explore screen</Text></View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

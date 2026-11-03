import * as Font from "expo-font";

export default function useFonts() {
  return Font.loadAsync({
    GreatVibes: require("../../assets/fonts/GreatVibes.ttf"),
    SansFlex:require("../../assets/fonts/GoogleSansFlex.ttf"),
    RobotoCondensed:require("../../assets/fonts/RobotoCondensed.ttf"),
    Raleway:require("../../assets/fonts/Raleway.ttf")
  });
}

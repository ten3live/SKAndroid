import { LinearGradient } from "expo-linear-gradient";
import { Button, cn, ScrollShadow, Select } from "heroui-native";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const select = ({ data, title, onChange, value }) => {
  const mode = useColorScheme() ?? "light";
  const [searchQuery, setSearchQuery] = useState("");

  //  const data = [
  //   { value: 'US', label: 'United States' },
  //   { value: 'GB', label: 'United Kingdom'},
  //   { value: 'CA', label: 'Canada' },
  //   { value: 'AU', label: 'Australia'},
  // ];
  const filteredcities = data.filter((city) =>
    city.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const insetTop = insets.top + 12;
  const maxDialogHeight = (height - insetTop) / 2;
  return (
    <View>
      <Select
        value={value}
        onValueChange={(newValue) => {
          const selecteditem = data.find((c) => c.value === newValue?.value);
          onChange(selecteditem);
          setSearchQuery("");
          Keyboard.dismiss();
        }}
        closeDelay={300}
      >
        <Select.Trigger asChild className="text-left">
          <Button
            className="bg-white mt-2 justify-start rounded-2xl"
            variant="tertiary"
          >
            {value ? (
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-accent font-bold">
                  {value.label}
                </Text>
              </View>
            ) : (
              <Text>{title}</Text>
            )}
          </Button>
        </Select.Trigger>
        <Select.Portal>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={24}>
            <Select.Content
              classNames={{
                wrapper: "justify-center",
                content: cn("gap-2 rounded-3xl"),
              }}
              style={{ marginTop: insetTop, height: maxDialogHeight }}
              presentation="popover"
              placement="top"
              align="center"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Select.ListLabel>{title}</Select.ListLabel>
                <Select.Close />
              </View>
              <View className="w-full mb-2">
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={`Search ${title}...`}
                  className="p-3 rounded-xl bg-surface-secondary/80 text-foreground"
                  autoFocus
                />
              </View>
              <ScrollShadow
                className="flex-1"
                LinearGradientComponent={LinearGradient}
              >
                <ScrollView keyboardShouldPersistTaps="handled">
                  {filteredcities.map((city) => (
                    <Select.Item
                      key={city.value}
                      value={city.value}
                      label={city.label}
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <Text className="text-base text-foreground flex-1">
                          {city.label}
                        </Text>
                      </View>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                  {filteredcities.length === 0 && (
                    <Text className="text-muted text-center mt-8">
                      No {title} found
                    </Text>
                  )}
                </ScrollView>
              </ScrollShadow>
            </Select.Content>
          </KeyboardAvoidingView>
        </Select.Portal>
      </Select>
    </View>
  );
};

export default select;

const styles = StyleSheet.create({});

import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { FlatList, Text, StyleSheet, View } from "react-native";
import IconButton from "../components/iconButton";
import Divider from "../components/divider";
import { AlertNotification } from "./alert";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// TODO:
//        - add functionality to "add" row
//        - add functionality to "edit" row
export default function Table({
  title,
  columnNames,
  data,
  addIcon,
  form,
  action,
  rowAction,
  alertHeader,
  alertBody,
  fields,
  position,
  edit,
  setIndex,
  deleteRow,
}) {
  const [alert, showAlert] = React.useState(false);
  const [selectedItem, setItem] = React.useState(null);
  const [height, setHeight] = React.useState(0);
  const animatedHeight = useSharedValue(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const onLayout = (event) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && height !== onLayoutHeight) {
      setHeight(onLayoutHeight);
    }
  };

  const collapsibleStyle = useAnimatedStyle(() => {
    animatedHeight.value = isOpen ? withTiming(height) : withTiming(0);

    return {
      height: animatedHeight.value,
    };
  }, [isOpen, height]);

  const ColumnHeaders = () => (
    <View className={"flex-row bg-gray-100 items-center"}>
      {columnNames.map((column, index) => (
        <React.Fragment>
          <Text className={"font-quicksand flex-1 p-2"} key={column}>
            {column}
          </Text>
          { index+1 < columnNames.length && <Divider orientation={"vertical"}/> }
        </React.Fragment>
      ))}
    </View>
  );

  const TableEnd = () => (
    <View className={"bg-gray-800 flex-1 rounded-r-lg -ml-2 mr-2 z-10"}>
      {[{}, {}].concat(data).map((item, index) => {
        if (index === 0 || index === 1) {
          return (
            <View flex={1}>
            </View>
          );
        } else {
          return (
            <React.Fragment>
              <Divider />
              <View key={item.id} className={"items-center"}>
                <IconButton
                  icon={
                    <FontAwesome5
                      name={"ellipsis-h"}
                      size={18}
                      color={"#fafaf9"}
                      className={"m-2"}
                    />
                  }
                  onPress={() => console.log("PRESSED")}
                />
              </View>
            </React.Fragment>
          );
        }
      })}

      {isOpen && <Divider />}
    </View>
  );

  return (
    <View className={"flex-col"}>
      <View className={"flex-row pt-2 z-20"}>
        <View className={"border-gray-800 bg-gray-100 border rounded-lg ml-2 w-11/12 z-20"}>
          <View className={"flex-row items-center justify-between"}>
            <Text className={"font-quicksand p-2 text-base"} fontSize={"md"} fontWeight={"bold"} p={2}>
              {title}
            </Text>

            <IconButton
              icon={
                <FontAwesome5
                  name={"plus"}
                  size={22}
                  color={"#172554"}
                  className={"m-2"}
                />
              }
              onPress={() => setIsOpen(!isOpen)}
            />
          </View>

          <Divider/>

          {columnNames && <ColumnHeaders /> }

          {columnNames && <Divider/> }

          <FlatList
            data={data}
            scrollEnabled={false}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={
              <View className={"flex-row"}>
                <Text className={"font-quicksand flex-1 p-2"}>
                  No Data Found
                </Text>
              </View>
            }
            renderItem={({ item, index }) => {
              return (
                <React.Fragment key={index}>
                  <View className={"flex-row items-center"}>
                    {fields.map((cell, cellIndex) => (
                      <React.Fragment key={cellIndex}>
                        <Text className={"font-quicksand flex-1 p-2"} key={cell}>
                          {item[cell] === null ? "No Data" : item[cell]}
                        </Text>
                        { cellIndex+1 < fields.length && <Divider orientation={"vertical"}/> }
                      </React.Fragment>
                    ))}
                  </View>

                  {index+1 < data.length && <Divider bg={"coolGray.400"} />}

                  <AlertNotification
                    header={alertHeader}
                    body={alertBody}
                    shown={alert}
                    setShown={showAlert}
                    action={() => rowAction(selectedItem)}
                  />
                </React.Fragment>
              );
            }}
          />
        </View>

        <TableEnd />
      </View>

      <Animated.View className={"mx-2 z-10 -mt-2 flex-row"} style={[collapsibleStyle, { overflow: "hidden", zIndex: 10 }]}>
        <View onLayout={onLayout} className={"absolute pt-8 pb-4 px-2 bg-gray-800 w-full -mt-2 z-10 rounded-b-lg"}>
          <Text className={"text-white"}>Test</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
});

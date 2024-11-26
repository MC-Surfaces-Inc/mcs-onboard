import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { FlatList, Text, View } from "react-native";
import IconButton from "../components/iconButton";
import Divider from "../components/divider";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Input from "../components/input";
import Picker from "../components/picker";

export default function Table({
  title,
  columns,
  data,
  columnStyle,
  Form,
  control,
  isLocked,
  onEdit,
  onDelete,
  onCancel,
  fieldTypes
}) {
  const [alert, showAlert] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [height, setHeight] = React.useState(0);
  const animatedHeight = useSharedValue(0);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  React.useEffect(() => {
    if (selectedItems.length > 0) {
      setIsDeleting(true);
    } else {
      setIsDeleting(false);
    }
  }, [setIsDeleting, selectedItems]);
  
  const onLayout = (event) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && height !== onLayoutHeight) {
      setHeight(onLayoutHeight);
    }
  };

  const collapsibleStyle = useAnimatedStyle(() => {
    animatedHeight.value = isAdding ? withTiming(height) : withTiming(0);

    return {
      height: animatedHeight.value,
    };
  }, [isAdding, height]);

  return (
    <View className={"flex-col"}>
      <View className={"flex-row z-20"}>
        <View className={`"border-gray-800" bg-gray-100 border rounded-lg flex-1 m-1 mt-2 ${isAdding ? "-mb-2" : "mb-0"}`}>
          <FlatList
            data={data}
            ListHeaderComponent={
              <Header
                title={title}
                columns={columns}
                style={columnStyle}
                Form={Form}
                add={{
                  isAdding,
                  setIsAdding,
                }}
                edit={{
                  isEditing,
                  setIsEditing,
                  onEdit,
                  onCancel
                }}
                delete={{
                  isDeleting,
                  setIsDeleting,
                  onDelete,
                  selectedItems
                }}
                dataExists={data.length > 0}
                fieldTypes={fieldTypes}
                isLocked={isLocked}
              />
            }
            ItemSeparatorComponent={<Divider />}
            scrollEnabled={false}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={
              <View className={"flex-row justify-center"}>
                <Text className={"font-quicksand font-bold text-orange-500 p-2"}>
                  No Data Found
                </Text>
              </View>
            }
            renderItem={({ item, index }) => {
              let rowStyle = `flex-row items-center`;

              return (
                <View className={rowStyle} key={index}>
                  {(onEdit || onDelete) && isLocked &&
                    <React.Fragment>
                      <IconButton
                        icon={
                          <FontAwesome5
                            name={selectedItems.some(obj => obj.id === item.id) ? "check-square" : "square"}
                            size={22}
                            color={selectedItems.some(obj => obj.id === item.id) ? "#F97316" : "#172554"}
                            className={"w-6 mx-2"}
                          />
                        }
                        onPress={() => {
                          if (selectedItems.some(obj => obj.id === item.id)) {
                            setSelectedItems(previousSelectedItems => previousSelectedItems.filter(row => row.id != item.id));
                          } else {
                            setSelectedItems([...selectedItems, item])
                          }
                        }}
                      />
                      <Divider orientation={"vertical"} />
                    </React.Fragment>
                  }

                  {columns.map((cell, cellIndex) => {
                    if (isEditing) {
                      if (fieldTypes[cellIndex].type === "input") {
                        return (
                          <Input
                            key={cell.id}
                            control={control}
                            field={`${title.toLowerCase()}.${index}.${cell.toLowerCase().replace(/\s/g, "")}`}
                            textStyle={"color-white"}
                            inputStyle={`bg-gray-100 rounded-lg pl-1 m-0 border-0 m-0`}
                            containerStyle={`${columnStyle[cellIndex]} mr-2 p-0 my-0`}
                            cursorColor={"#F97316"}
                          />
                        );
                      } else if (fieldTypes[cellIndex].type === "picker") {
                        return (
                          <Picker
                            key={cell.id}
                            choices={fieldTypes[cellIndex].choices}
                            control={control}
                            field={`${title.toLowerCase()}.${index}.${cell.toLowerCase().replace(/\s/g, "")}`}
                            textStyle={"color-white"}
                            containerStyle={`${columnStyle[cellIndex]} mr-2 p-0 my-0`}
                            inputStyle={`bg-gray-100 rounded-lg pl-1 m-0 m-0`}
                          />
                        )
                      }
                    } else {
                      return (
                        <Cell
                          data={item[cell.toLowerCase().replace(/\s/g, "")]}
                          index={cellIndex}
                          key={cell.id}
                          style={columnStyle[cellIndex]}
                        />
                      );
                    }
                  })}
                </View>
              );
            }}
          />
        </View>
      </View>

      <AnimatedDropdown
        onLayout={onLayout}
        collapsibleStyle={collapsibleStyle}
        form={Form}
        isAdding={isAdding}
      />
    </View>
  );
}

const Header = (props) => (
  <React.Fragment>
    {props.title &&
      <React.Fragment>
        <View className={"flex-row items-center justify-between"}>
          <Text className={"font-quicksand text-base mx-1 my-2 font-bold"}>
            {props.title}
          </Text>

          <View className={"flex-row"}>
            {/*Trash Can*/}
            {props.delete.selectedItems.length > 0 && props.isLocked &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={"trash"}
                    size={24}
                    color={"#ef4444"}
                    className={"mx-2"}
                  />
                }
                onPress={() => {
                  props.delete.onDelete(props.delete.selectedItems);
                }}
                disabled={props.add.isAdding || props.edit.isEditing}
              />
            }

            {/*Edit*/}
            {!props.edit.isEditing && props.edit.onEdit && props.dataExists && props.isLocked &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={"edit"}
                    size={24}
                    color={"#172554"}
                    className={"mx-2"}
                  />
                }
                onPress={() => {
                  props.edit.setIsEditing(!props.edit.isEditing);
                }}
                disabled={props.add.isAdding || props.edit.isDeleting}
              />
            }

            {/*Save*/}
            {props.edit.isEditing &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={"save"}
                    size={24}
                    color={"#4ade80"}
                    className={"mx-2"}
                  />
                }
                onPress={() => {
                  props.edit.onEdit();
                  props.edit.setIsEditing(!props.edit.isEditing);
                }}
                disabled={props.add.isAdding || props.edit.isDeleting}
              />
            }

            {/*Exit Edit*/}
            {props.edit.isEditing &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={"times"}
                    size={24}
                    color={"#ef4444"}
                    className={"mx-2"}
                  />
                }
                onPress={() => {
                  props.edit.setIsEditing(false);
                }}
                disabled={props.add.isAdding || props.edit.isDeleting}
              />
            }

            {/*Add or Exit Add*/}
            {props.Form && props.isLocked &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={props.add.isAdding ? "times" : "plus"}
                    size={24}
                    color={props.add.isAdding ? "#ef4444": "#172554"}
                    className={"mx-2"}
                  />
                }
                onPress={() => {
                  props.add.setIsAdding(!props.add.isAdding);
                }}
                disabled={props.add.isDeleting || props.edit.isEditing}
              />
            }
          </View>
        </View>

        <Divider />
      </React.Fragment>
    }

    <View className={"flex-row bg-gray-100 items-center"}>
      {(props.edit.onEdit || props.delete.onDelete) && props.isLocked &&
        <View className={"mx-5"}>
        </View>
      }
      {props.columns.map((column, index) => (
        <ColumnHeader column={column} key={index} style={props.style[index]} />
      ))}
    </View>

    <Divider />
  </React.Fragment>
);
Table.Header = Header;

const ColumnHeader = (props) => (
  <React.Fragment>
    <Text className={`font-quicksand ${props.style} m-1 font-bold`}>
      {props.column}
    </Text>
  </React.Fragment>
)
Table.ColumnHeader = ColumnHeader;

const Cell = (props) => (
  <React.Fragment>
    <Text className={`font-quicksand ${props.style} m-1 my-2`}>
      {props.data}
    </Text>
  </React.Fragment>
);
Table.Cell = Cell;

const AnimatedDropdown = (props) => (
  <Animated.View className={"z-30 flex-row mx-1"} style={[props.collapsibleStyle, { overflow: "hidden", zIndex: 10 }]}>
    <View onLayout={props.onLayout} className={"absolute pt-4 pb-2 px-2 bg-gray-800 w-full -mt-2 z-50 rounded-b-md"}>
      {props.form}
    </View>
  </Animated.View>
);
Table.AddDropdown = AnimatedDropdown;
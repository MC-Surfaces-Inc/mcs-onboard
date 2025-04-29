import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
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
  fieldTypes,
  emptyComponent,
  scrollEnabled=false,
  fileTable=false,
  ActionBar,
  isLoading,
}) {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [height, setHeight] = React.useState(0);
  const animatedHeight = useSharedValue(0);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [tableHeight, setTableHeight] = React.useState(0);
  
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
      top: tableHeight + 2,
      overflow: "hidden",
    };
  }, [isAdding, height]);

  const onTableLayout = (event) => {
    setTableHeight(event.nativeEvent.layout.height);
  }

  return (
    <View className={`flex-col ${fileTable ? "min-h-96 max-h-96" : "max-h-96"} relative`}>
      <View className={"flex-row z-0"}>
        <View onLayout={onTableLayout} className={`"border-gray-800" bg-gray-100 border rounded-lg flex-1 m-1 mt-2`}>
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
                columnHeaderStyle={"py-2 px-1"}
                fileTable={fileTable}
                ActionBar={ActionBar}
              />
            }
            ItemSeparatorComponent={<Divider />}
            scrollEnabled={scrollEnabled}
            stickyHeaderIndices={[0]}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={
              emptyComponent ?
                emptyComponent()
                :
                isLoading ?
                  <View className={"flex-row items-center justify-center"}>
                    <Text className={"font-quicksand font-bold text-orange-500 p-2"}>
                      Loading...
                    </Text>
                  </View>
                  :
                  <View className={"flex-row justify-center"}>
                    <Text className={"font-quicksand font-bold text-orange-500 p-2"}>
                      No Data Found
                    </Text>
                  </View>
            }
            renderItem={({ item, index }) => {
              const disabledCheckbox = !isLocked || item.name === "Jobs" || item.name === "Programs" || item.name === "Purchase Orders";

              if (fileTable) {
                return (
                  <TouchableOpacity
                    className={"flex-row items-center"}
                    key={index}
                    onPress={() => {
                      if (item.hasOwnProperty("file")) {
                        item.viewFile(item.webUrl);
                      } else if (item.hasOwnProperty("folder")) {
                        item.navigateToFolder(item.id, item.parentReference.id, item.name);
                      }
                    }}
                  >
                    {(onEdit || onDelete) && isLocked &&
                      <View className={"items-center justify-center"}>
                        <IconButton
                          disabled={disabledCheckbox}
                          icon={
                            <FontAwesome5
                              name={selectedItems.some(obj => obj.id === item.id) ? "check-square" : "square"}
                              size={22}
                              color={disabledCheckbox ? "#aeb6bf" : selectedItems.some(obj => obj.id === item.id) ? "#F97316" : "#172554"}
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
                      </View>
                    }

                    {isLocked && <Divider orientation="vertical" /> }

                    {fileTable && item.hasOwnProperty("folder") &&
                      <View className={"items-center justify-center"}>
                        <FontAwesome5
                          name={"folder"}
                          size={22}
                          className={"w-8 mx-2 text-center"}
                        />
                      </View>
                    }

                    {fileTable && item.hasOwnProperty("file") &&
                      <View className={"items-center justify-center"}>
                        <FontAwesome5
                          name={"file-alt"}
                          size={22}
                          className={"w-8 mx-2 text-center"}
                        />
                      </View>
                    }

                    {isLocked && <Divider orientation="vertical" /> }

                    {columns.map((cell, cellIndex) => {
                      return (
                        <Cell
                          data={item[cell.toLowerCase().replace(/\s/g, "")]}
                          index={cellIndex}
                          key={cell.id}
                          style={`${columnStyle[cellIndex]}`}
                        />
                      );
                    })}
                  </TouchableOpacity>
                );
              }

              return (
                <View className={"flex-row items-center"} key={index}>
                  {(onEdit || onDelete) && isLocked &&
                    <View className={"items-center justify-center"}>
                      <IconButton
                        disabled={!isLocked}
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
                    </View>
                  }

                  {isLocked && <Divider orientation="vertical" /> }

                  {columns.map((cell, cellIndex) => {
                    let attribute = cell.toLowerCase().replace(/\s/g, "");
                    let field = `${title.toLowerCase()}.${index}.${attribute}`;

                    if (isEditing) {
                      if (fieldTypes[cellIndex].type === "input") {
                        return (
                          <Input
                            key={cell.id}
                            control={control}
                            field={field}
                            containerStyle={`${columnStyle[cellIndex]}`}
                            inputStyle={`${columnStyle[cellIndex]} rounded-none`}
                            cursorColor={"#F97316"}
                            autoCapitalize={attribute === "email" ? "none" : ""}
                          />
                        );
                      } else if (fieldTypes[cellIndex].type === "picker") {
                        return (
                          <Picker
                            key={cell.id}
                            choices={fieldTypes[cellIndex].choices}
                            control={control}
                            field={field}
                            textStyle={"color-white"}
                            containerStyle={`${columnStyle[cellIndex]} -mt-1`}
                            inputStyle={`-mt-0.5 rounded-none`}
                            // inputStyle={`bg-gray-100 rounded-lg pl-1 m-0 m-0`}
                          />
                        );
                      }
                    } else {
                      return (
                        <Cell
                          data={item[cell.toLowerCase().replace(/\s/g, "")]}
                          index={cellIndex}
                          key={cell.id}
                          style={`${columnStyle[cellIndex]}`}
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
        <View className={"flex-row items-center justify-between bg-gray-100 rounded-t-lg py-2"}>
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
                    size={20}
                    color={"#ef4444"}
                  />
                }
                onPress={() => {
                  props.delete.onDelete(props.delete.selectedItems);
                }}
                disabled={props.add.isAdding || props.edit.isEditing}
                className={"border border-gray-800 rounded-lg mx-1 ml-2 h-10 w-10"}
              />
            }

            {/*Edit*/}
            {!props.edit.isEditing && props.edit.onEdit && props.dataExists && props.isLocked &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={"edit"}
                    size={20}
                    color={"#172554"}
                  />
                }
                onPress={() => {
                  props.edit.setIsEditing(!props.edit.isEditing);
                }}
                disabled={props.add.isAdding || props.edit.isDeleting}
                className={"border border-gray-800 rounded-lg mx-1 ml-2 h-10 w-10"}
              />
            }

            {/*Save*/}
            {props.edit.isEditing &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={"save"}
                    size={20}
                    color={"#4ade80"}
                  />
                }
                onPress={() => {
                  props.edit.onEdit();
                  props.edit.setIsEditing(!props.edit.isEditing);
                }}
                disabled={props.add.isAdding || props.edit.isDeleting}
                className={"border border-gray-800 rounded-lg mx-1 ml-2 h-10 w-10"}
              />
            }

            {/*Exit Edit*/}
            {props.edit.isEditing &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={"times"}
                    size={20}
                    color={"#ef4444"}
                  />
                }
                onPress={() => {
                  props.edit.setIsEditing(false);
                }}
                disabled={props.add.isAdding || props.edit.isDeleting}
                className={"border border-gray-800 rounded-lg mx-1 ml-2 h-10 w-10"}
              />
            }

            {/*Add or Exit Add*/}
            {props.Form && props.isLocked && !props.ActionBar &&
              <IconButton
                icon={
                  <FontAwesome5
                    name={props.add.isAdding ? "times" : "plus"}
                    size={20}
                    color={props.add.isAdding ? "#ef4444": "#172554"}
                  />
                }
                onPress={() => {
                  props.add.setIsAdding(!props.add.isAdding);
                }}
                disabled={props.add.isDeleting || props.edit.isEditing}
                className={"border border-gray-800 rounded-lg mx-1 ml-2 h-10 w-10"}
              />
            }
          </View>
        </View>

        <Divider />
      </React.Fragment>
    }

    {props.ActionBar && props.ActionBar()}

    {props.ActionBar && <Divider />}

    <View className={`flex-row bg-gray-100 items-center`}>
      {(props.edit.onEdit || props.delete.onDelete) && props.isLocked &&
        <View className={"items-center justify-center w-10"}>
        </View>
      }

      {props.fileTable &&
        <View className={"items-center justify-center w-12"}>
        </View>
      }

      {props.columns.map((column, index) => (
        <ColumnHeader
          column={column}
          key={index}
          style={`${props.style[index]} ${props.edit.isEditing && "px-2"}}`}
        />
      ))}
    </View>

    <Divider />
  </React.Fragment>
);
Table.Header = Header;

const ColumnHeader = (props) => (
  <View className={`h-15 ${props.style} py-2 px-1`}>
    <Text className={`font-quicksand font-bold`}>
      {props.column}
    </Text>
  </View>
)
Table.ColumnHeader = ColumnHeader;

const Cell = (props) => (
  <View className={`h-15 ${props.style} py-2 px-1`}>
    <Text className={`font-quicksand`}>
      {props.data}
    </Text>
  </View>
);
Table.Cell = Cell;

const AnimatedDropdown = (props) => (
  <Animated.View className={"absolute left-1 right-1 -z-10"} style={[props.collapsibleStyle, { overflow: "hidden" }]}>
    <View onLayout={props.onLayout} className={"absolute pt-4 pb-2 px-2 bg-gray-800 w-full -mt-2 rounded-b-md"}>
      {props.form}
    </View>
  </Animated.View>
);
Table.AddDropdown = AnimatedDropdown;
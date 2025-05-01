import React from "react";
import { Text } from "react-native";
import { useFieldArray, useForm } from "react-hook-form";
import { units } from "../constants/dropdownValues";
import {
  useDeleteBillingPartsMutation,
  useGetClientProgramPricingQuery,
  useUpdateProgramPricingMutation,
} from "../services/client";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Loading from "../screens/loading";
import { toast } from "../components/toast";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { FlatList, View } from "react-native";
import Menu from "../components/menu";
import Divider from "../components/divider";
import IconButton from "../components/iconButton";
import TextInput from "../components/input";
import Button from "../components/button";
import { useSelector } from "react-redux";
import TableInput from "../components/tableInput";
import Dropdown from "../components/dropdown";

export default function TilePricingForm({ clientId }) {
  const isLocked = useSelector(state => state.client.isLocked);
  const {
    control,
    getValues,
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      tile: [],
      area: "",
    }
  });
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: "tile",
    keyName: "partId"
  });
  const { data=[], error, isLoading } = useGetClientProgramPricingQuery({
    program: "Tile",
    clientId: clientId,
  });
  const [updateParts, result1] = useUpdateProgramPricingMutation();
  const [deleteParts, result2] = useDeleteBillingPartsMutation();
  const [areaChoices, setAreaChoices] = React.useState([]);
  const [isAdding, setIsAdding] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [height, setHeight] = React.useState(0);
  const animatedHeight = useSharedValue(0);

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

  React.useEffect(() => {
    if (data.parts) {
      data.parts.forEach((item) => {
        if (!areaChoices.some((choice) => choice.programTable === item.programTable)) {
          setAreaChoices([
            ...areaChoices,
            { label: item.programTable, value: item.programTable }
          ]);
        }
      });

      setValue("tile", data.parts);
    }
  }, [data]);

  // Create parts
  const onSubmit = values => {
    let errors = 0;

    values.tile.forEach(row => {
      updateParts({
        body: {
          ...row,
          clientId: clientId,
          program: "Tile"
        },
      })
        .unwrap()
        .then(res => {
          if (res.message !== "Client Billing Parts Successfully Created.") {
            errors += 1;
          }
        });
    });

    toast.success({
      title: "Part Status",
      message: `${values.tile.length-errors}/${values.tile.length} billing parts successfully updated.`,
    });
  };

  // Delete parts
  const onDelete = values => {
    let errors = 0;

    values.forEach((part, index) => {
      // Catch parts that have not been saved to DB yet
      if (!("id" in part.item)) {
        remove(part.index);

        setSelectedItems(prevItems => prevItems.filter(item => item.index === part.index));

        toast.success({
          title: "Part Status",
          message: `${values.length-errors}/${values.length} billing parts successfully deleted.`,
        });

        return;
      }

      // Delete parts from DB
      deleteParts({
        id: part.item.id
      })
        .unwrap()
        .then(res => {
          if (res.message !== "Billing Part successfully deleted.") {
            errors += 1;
          }

          setSelectedItems([]);
        });
    });

    toast.success({
      title: "Part Status",
      message: `${values.length-errors}/${values.length} billing parts successfully deleted.`,
    });
  }

  if (isLoading) {
    return <Loading navigation={null} />;
  }

  return (
    <View className={"border border-gray-500 rounded-md m-5 mb-20 z-30"}>
      <View className={"flex-row justify-between items-center z-40"}>
        <Text className={"font-quicksand text-xl font-bold text-gray-800 m-3"}>
          Tile Pricing
        </Text>
        <View className={"flex-row"}>
          <IconButton
            icon={
              <FontAwesome5
                name={"trash"}
                size={20}
                color={selectedItems.length === 0 || isLocked ? "#AEB6BF" : "#172554"}
                className={"m-2"}
              />
            }
            onPress={() => onDelete(selectedItems)}
            disabled={selectedItems.length === 0 || isLocked}
            className={"border border-gray-800 rounded-lg  mx-1 h-10 w-10"}
          />
          <IconButton
            icon={
              <FontAwesome5
                name={"save"}
                size={20}
                color={"#172554"}
                className={"m-2"}
              />
            }
            onPress={() => handleSubmit(onSubmit)}
            disabled={isLocked}
            className={"border border-gray-800 rounded-lg  mx-1 h-10 w-10"}
          />
          <Menu>
            <Menu.Title title={"Table Actions"} />
            <Menu.Item
              title={"Add Area Choice"}
              onPress={() => setIsAdding(!isAdding)}
              disabled={isLocked}
            />
            <Menu.Item
              title={"Add Table Row(s)"}
              onPress={() => append({ programTable: "", level: "", unit: "", totalCost: "" })}
              disabled={isLocked}
            />
          </Menu>
        </View>
      </View>

      <Divider />

      <FlatList
        data={fields}
        ListHeaderComponent={(
          <React.Fragment>
            <View className={"flex-row items-center"}>
              <React.Fragment>
                <Text className={"font-quicksand text-lg w-1/4 ml-12"}>Program Table</Text>
                <Text className={"font-quicksand text-lg w-1/4"}>Level</Text>
                <Text className={"font-quicksand text-lg w-1/4"}>Unit</Text>
                <Text className={"font-quicksand text-lg w-1/4"}>Total Cost</Text>
              </React.Fragment>
            </View>
            <Divider />
          </React.Fragment>
        )}
        ListEmptyComponent={
          <View className={"flex-row justify-center z-0"}>
            <Text className={"font-quicksand font-bold text-orange-500 p-2"}>
              No Data Found
            </Text>
          </View>
        }
        ItemSeparatorComponent={<Divider />}
        renderItem={(item, index) => {
          return (
            <View className={"flex-row z-0"} key={index}>
              <View className={"items-center justify-center"}>
                <IconButton
                  disabled={isLocked}
                  icon={
                    <FontAwesome5
                      name={selectedItems.some(obj => obj.index === item.index) ? "check-square" : "square"}
                      size={22}
                      color={selectedItems.some(obj => obj.index === item.index) ? "#F97316" : "#172554"}
                      className={"w-6 mx-2"}
                    />
                  }
                  onPress={() => {
                    if (selectedItems.some(obj => obj.index === item.index)) {
                      setSelectedItems(previousSelectedItems => previousSelectedItems.filter(row => row.index != item.index));
                    } else {
                      setSelectedItems([...selectedItems, item]);
                    }
                  }}
                />
              </View>

              <Divider orientation={"vertical"} />
              <Dropdown
                options={areaChoices}
                control={control}
                field={`tile[${item.index}].programTable`}
                containerStyle={"w-1/4 my-0"}
                inputStyle={"border-0"}
                disabled={isLocked}
              />
              <Divider orientation={"vertical"} />
              <TableInput
                control={control}
                field={`tile[${item.index}].level`}
                containerStyle={"w-1/4 my-0"}
                inputStyle={"border-0"}
                disabled={isLocked}
              />
              <Divider orientation={"vertical"} />
              <Dropdown
                options={units}
                control={control}
                field={`tile[${item.index}].unit`}
                containerStyle={"w-1/4 my-0"}
                inputStyle={"border-0"}
                disabled={isLocked}
              />
              <Divider orientation={"vertical"} />
              <TableInput
                control={control}
                field={`tile[${item.index}].totalCost`}
                containerStyle={"w-1/4 my-0"}
                leftIcon={<FontAwesome5 name={"dollar-sign"} size={20} className={"mr-5"} color={"#172554"} />}
                inputStyle={"border-0"}
                disabled={isLocked}
              />
            </View>
          );
        }}
        ListFooterComponent={(
          <Animated.View className={"z-30 flex-row"} style={[collapsibleStyle, { overflow: "hidden", zIndex: 10 }]}>
            <View onLayout={onLayout} className={"absolute pt-4 pb-2 px-2 bg-gray-800 w-full z-50 rounded-b-sm"}>
              <View className={"flex-row justify-between items-center"}>
                <TextInput
                  control={control}
                  field={`area`}
                  title={"New Area"}
                  textStyle={"text-gray-100"}
                  containerStyle={"w-1/3 my-0"}
                  inputStyle={"bg-gray-100"}
                />
                <View className={"flex-row justify-end items-center"}>
                  <Button
                    title={"Cancel"}
                    type={"outlined"}
                    size={"sm"}
                    color={"action"}
                    onPress={() => setIsAdding(!isAdding)}
                    className={"mt-5 -mb-1 h-10 mx-2"}
                  />
                  <Button
                    title={"Save"}
                    type={"contained"}
                    size={"sm"}
                    color={"success"}
                    onPress={() => {
                      setAreaChoices([
                        ...areaChoices,
                        { label: getValues("area"), value: getValues("area") }
                      ]);
                      setIsAdding(false);
                    }}
                    className={"mt-5 -mb-1 h-10 mx-2"}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}

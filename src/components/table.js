import React from "react";
import {
  Box,
  Divider,
  HStack,
  IconButton,
  Menu,
  Popover,
  Pressable,
  Text,
  ThreeDotsIcon,
} from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { FlatList } from "react-native";
import { AlertNotification } from "./alert";
import { useForm } from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";
import TextInput from "./textInput";

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
  editRow
}) {
  const { control, handleSubmit, errors, setValue } = useForm();
  const [alert, showAlert] = React.useState(false);
  const [selectedItem, setItem] = React.useState(null);
  const [editItem, setEditItem] = React.useState(false);
  // const { fields, append } = useFieldArray({
  //   control,
  //   name: `${title}`,
  //   keyName: "key"
  // });

  const TextInput = ({ control, field, index }) => (
    <Controller
      control={control}
      name={`${field}`}
      render={({ field: { onBlur, onChange, value} }) => {
        return (
          <TextInput
            control={control}
            field={`${field}`}
            />
        );
      }}
    />
  )

  return (
    <Box borderColor={"coolGray.600"} borderWidth={1} borderRadius={"md"} m={2}>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"md"} fontWeight={"bold"} p={2}>
          {title}
        </Text>

        <HStack>
          {addIcon && form && (
            <Box>
              <Popover
                placement={position || "bottom"}
                trigger={triggerProps => (
                  <IconButton
                    icon={
                      <FontAwesome5
                        name={"plus-circle"}
                        size={24}
                        color={"#4ade80"}
                      />
                    }
                    {...triggerProps}
                  />
                )}>
                {form}
              </Popover>
            </Box>
          )}

          {addIcon && action && (
            <Box>
              <IconButton
                icon={
                  <FontAwesome5
                    name={"plus-circle"}
                    size={24}
                    color={"#4ade80"}
                  />
                }
                onPress={action}
              />
            </Box>
          )}
        </HStack>
      </HStack>

      <Divider bg={"coolGray.400"} />

      <HStack>
        {columnNames.map(column => (
          <Text flex={1} fontSize={"sm"} fontWeight={"bold"} key={column} p={2}>
            {column}
          </Text>
        ))}
        {editRow && <Text p={1} color={"#fafaf9"}>test</Text>}
      </HStack>

      <Divider bg={"coolGray.400"} />

      <FlatList
        data={data}
        scrollEnabled={false}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={
          <HStack>
            <Text flex={1} fontSize={"sm"} p={2}>
              No Data Found
            </Text>
          </HStack>
        }
        renderItem={({ item, index }) => {
          return (
            <React.Fragment>
              <HStack alignItems={"center"}>
                {fields.map((cell, cellIndex) => {
                  if (editItem) {
                    return (
                      <TextInput
                        control={control}
                        field={`${data}[${index}].${item}`}
                      />
                    )
                  }

                  return (
                    <Text flex={1} fontSize={"sm"} key={cell} p={2}>
                      {item[cell] === null ? "No Data" : item[cell]}
                    </Text>
                  );
                })}

                {/*<Menu*/}
                {/*  trigger={triggerProps => (*/}
                {/*    <Pressable {...triggerProps}>*/}
                {/*      <Box p={2}>*/}
                {/*        <ThreeDotsIcon size={4} color={"primary.900"}/>*/}
                {/*      </Box>*/}
                {/*    </Pressable>*/}
                {/*  )}*/}
                {/*  w={200}>*/}
                {/*  <Menu.Group title={"Actions"}>*/}
                {/*    <Divider bg={"coolGray.400"}/>*/}
                {/*    <Menu.Item onPress={() => setEditItem(true)}>*/}
                {/*      Edit*/}
                {/*    </Menu.Item>*/}
                {/*    <Menu.Item*/}
                {/*      onPress={() => {*/}
                {/*        if (alertHeader) {*/}
                {/*          showAlert(true);*/}
                {/*        } else {*/}
                {/*          rowAction(selectedItem);*/}
                {/*        }*/}
                {/*      }}>*/}
                {/*      Delete*/}
                {/*    </Menu.Item>*/}
                {/*  </Menu.Group>*/}
                {/*</Menu>*/}
              </HStack>

              {index !== data.length - 1 && <Divider bg={"coolGray.400"} />}

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
    </Box>
  );
}

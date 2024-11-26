import React from "react";
import {
  useDeleteAddressMutation,
  useDeleteContactMutation,
  useDeleteProgramInfoMutation,
  useDeleteProgramPartsMutation,
  useGetClientByIdQuery,
  useUpdateAddressMutation,
  useUpdateApprovalsMutation,
  useUpdateContactMutation,
  useUpdateProgramsMutation,
  useUpdateStatusMutation,
} from "../services/client";
import Toolbar from "../components/toolbar";
import Badge from "../components/badge";
import Table from "../components/table";
import Divider from "../components/divider";
import Loading from "./loading";
import AddContactForm from "../forms/addContactForm";
import AddAddressForm from "../forms/addAddressForm";
import AddProgramForm from "../forms/addProgramForm";
import { useFieldArray, useForm } from "react-hook-form";
import { types } from "../constants/dropdownValues";
import { toast } from "../components/toast";
import { SafeAreaView, Text, View } from "react-native";
import Menu from "../components/menu";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import EditClientForm from "../forms/editClientForm";
import { setIsLocked } from "../features/client/clientSlice";
import { useDispatch, useSelector } from "react-redux";

const statusColors = {
  Potential: "bg-slate-600",
  Queued: "bg-yellow-500",
  Declined: "bg-red-600",
  Approved: "bg-green-500",
  Pushed: "bg-blue-950",
};

const tableColumns = {
  addresses: ["Type", "Address 1", "Address 2", "City", "State", "Zip"],
  contacts: ["Name", "Title", "Email", "Phone"],
  approvals: ["Name", "Value"],
  programs: ["Selection"]
}

/* TODO:  - Fix notification/toast system for tables
          - Add in form functionality for Addresses, Contacts and Programs
          - Add complete File functionality
          - Adjust tables for screen size
          - Fix portait orientation
 */
export default function ClientProfile({ navigation, route }) {
  const clientId = route.params?.clientId
  const dispatch = useDispatch();
  const isLocked = useSelector(state => state.client.isLocked);
  const { data, isLoading } = useGetClientByIdQuery(clientId);
  const [editInfo, setEditInfo] = React.useState(false);
  const [deleteInfo, setDeleteInfo] = React.useState(false);
  const [openPushClientModal, setOpenPushClientModal] = React.useState(false);
  const [updateStatus, result] = useUpdateStatusMutation();
  const [updateApprovals, result1] = useUpdateApprovalsMutation();
  const open = useSharedValue(false);
  const width = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(open.value ? 0 : 1, { duration: 500 })
  );

  React.useEffect(() => {
    if (data) {
      if (["Queued", "Approved", "Pushed"].includes(data.status.current)) {
        dispatch(setIsLocked({ isLocked: true }));
        setEditInfo(true);
        setDeleteInfo(true);
      } else {
        dispatch(setIsLocked({ isLocked: false }));
      }
    }
  }, [data, setEditInfo]);

  if (data === undefined || isLoading) {
    return <Loading navigation={navigation} />;
  }

  const AddressTable = ({ data, clientId }) => {
    const { control, register, setValue, handleSubmit, reset } = useForm({
      defaultValues: {
        addresses: data.addresses
      }
    });
    const { fields } = useFieldArray({
      control,
      name: "addresses",
      keyName: "addressId"
    });
    const [updateAddress, result] = useUpdateAddressMutation();
    const [deleteAddress, result3] = useDeleteAddressMutation();
    const [loading, setLoading] = React.useState(false);

    const onDelete = values => {
      values.forEach((item, index) => {
        deleteAddress({ clientId: item.clientId, id: item.id })
          .unwrap()
          .then(res => {
            console.log(res);
            toast.success({
              title: "Success!",
              message: "Address Successfully Deleted",
            });
          });
      });
    }

    const onEdit = values => {
      values.addresses.forEach((item, index) => {
        updateAddress({ clientId: item.clientId, id: item.id, body: item })
          .unwrap()
          .then(res => {
            console.log(res);
            toast.success({
              title: "Success!",
              message: "Address Successfully Updated",
            });
          });
      });
    }

    return (
      <Table
        title={"Addresses"}
        data={fields}
        columns={tableColumns.addresses}
        columnStyle={["w-2/12", "w-3/12", "w-2/12", "w-2/12", "w-1/12", "w-2/12"]}
        control={control}
        Form={<AddAddressForm clientId={clientId} selections={data.addresses} />}
        fieldTypes={[{type: "picker", choices: types}, {type: "input"}, {type: "input"}, {type: "input"}, {type: "input"}, {type: "input"}]}
        isLocked={!isLocked}
        onEdit={handleSubmit(onEdit)}
        onDelete={onDelete}
        onCancel={() => console.log(data.addresses)}
      />
    )
  }

  const ContactTable = ({ data, clientId }) => {
    const { control, register, setValue, handleSubmit } = useForm({
      defaultValues: {
        contacts: data.contacts
      }
    });
    const { fields } = useFieldArray({
      control,
      name: "contacts",
      keyName: "contactId"
    });
    const [updateContact, result] = useUpdateContactMutation();
    const [deleteContact, result4] = useDeleteContactMutation();
    const [loading, setLoading] = React.useState(false);

    const onDelete = values => {
      values.forEach((item, index) => {
        deleteContact({ clientId: item.clientId, id: item.id })
          .unwrap()
          .then(res => {
            console.log(res);
            toast.success({
              title: "Success!",
              message: "Contact Successfully Deleted",
            });
          });
      });
    }

    const onEdit = values => {
      values.contacts.forEach((item, index) => {
        updateContact({ clientId: item.clientId, id: item.id, body: item })
          .unwrap()
          .then(res => {
            console.log(res);
            toast.success({
              title: "Success!",
              message: "Contact Successfully Updated",
            });
          });
      });
    }

    return (
      <Table
        title={"Contacts"}
        data={data.contacts}
        columns={tableColumns.contacts}
        columnStyle={["w-3/12", "w-2/12", "w-4/12", "w-2/12"]}
        Form={<AddContactForm clientId={clientId} />}
        fieldTypes={[{type: "input"}, {type: "input"}, {type: "input"}, {type: "input"}]}
        isLocked={!isLocked}
        control={control}
        onEdit={handleSubmit(onEdit)}
        onDelete={onDelete}
        onCancel={() => console.log(data.contacts)}
      />
    );
  }

  const ApprovalsTable = ({ data }) => {
    const formatApprovalsArr = arr => {
      if (arr === undefined) {
        return [];
      }

      return Object.keys(arr).map(x => ({
        name: x,
        key: x,
        value:
          data.approvals[x] === 1
            ? "Approved"
            : data.approvals[x] === 0
              ? "Declined"
              : "No Response",
      }));
    };

    return (
      <Table
        title={"Approvals"}
        data={formatApprovalsArr(data.approvals)}
        columns={tableColumns.approvals}
        columnStyle={["w-1/2", "w-1/2"]}
      />
    );
  }

  const ProgramTable = ({ data, clientId }) => {
    const { control, register, setValue } = useForm({
      defaultValues: {
        programs: data.programs
      }
    });
    const { fields } = useFieldArray({
      control,
      name: "programs",
      keyName: "programId"
    });
    const [updatePrograms, result2] = useUpdateProgramsMutation();
    const [deleteParts, result6] = useDeleteProgramPartsMutation();
    const [deleteProgram, result5] = useDeleteProgramInfoMutation();

    const formatPrograms = arr => {
      return Object.keys(arr)
        .filter(x => arr[x] === 1)
        .map((x, index) => ({ id: index, selection: x, key: x }));
    };

    const onDelete = values => {
      values.forEach((item, index) => {
        updatePrograms({
          id: clientId,
          body: {[item.selection.toLowerCase()]: 0 },
        })
          .unwrap()
          .then(res1 => {
            deleteProgram({
              program: item.selection.toLowerCase(),
              id: clientId,
            })
              .unwrap()
              .then(res2 => {
                deleteParts({
                  program: item.selection,
                  id: clientId,
                })
                  .unwrap()
                  .then(res3 => {
                    toast.success({
                      title: "Success!",
                      message: "Program Successfully Deleted",
                    });
                  });
              });
          });
      });
    }

    return (
      <Table
        title={"Programs"}
        data={formatPrograms(data.programs)}
        columns={tableColumns.programs}
        columnStyle={["w-full"]}
        Form={<AddProgramForm clientId={clientId} selections={formatPrograms(data.programs)} />}
        isLocked={!isLocked}
        control={control}
        onDelete={onDelete}
      />
    )
  }

  const FileTable = ({ data, clientId }) => {
    const formatFileArray = arr => {
      if (arr === undefined) {
        return [];
      }

      let newArr = arr.map((file, index) => ({
        name: file.Name,
        type: file.Name.split(".")[file.Name.split(".").length - 1],
        size: (file.Size / 1024).toFixed(2) + " KBs",
        Bucket: file.Bucket,
        Key: file.Key,
      }));

      return newArr;
    };
  }

  return (
    <SafeAreaView>
      <View className={"flex-row h-full"}>
        <Toolbar navigation={navigation} />

        <View className={"flex-1"}>
          <View className={"z-30 mx-1"}>
            <View className={"flex-row items-center justify-between my-2"}>
              <Text className={"font-quicksand text-4xl text-gray-800 ml-2"}>
                {data.basicInfo.name}
              </Text>

              <View className={"flex-row flex-1 justify-end items-center"}>
                <Badge label={data.basicInfo.territory} className={"bg-gray-800 w-1/4"}/>
                <Badge label={data.status.current} className={`${statusColors[data.status.current]} w-1/4`}/>

                <Menu>
                  <Menu.Title title={"Client Actions"} />
                  <Menu.Item
                    title={"Edit Name & Territory"}
                    disabled={isLocked}
                    onPress={() => {
                      open.value = !open.value;
                    }}
                  />
                  <Divider />
                  <Menu.Title title={"Client Pages"} />
                  <Menu.Item
                    title={"Client Details"}
                    onPress={() =>
                      navigation.push("ClientDetails", { clientId: clientId })
                    }
                  />
                  <Menu.Item
                    title={"Program Details"}
                    onPress={() =>
                      navigation.push("ProgramDetails", {
                        programs: data.programs,
                        clientId: clientId
                      })
                    }
                  />
                  <Menu.Item
                    title={"Program Pricing"}
                    onPress={() =>
                      navigation.push("ProgramPricing", {
                        programs: data.programs,
                        clientId: clientId
                      })
                    }
                  />
                  <Divider />
                  <Menu.Title title={"Edit Status"} />
                  <Menu.Item
                    title={"Submit Client"}
                    onPress={() => {
                      updateStatus({ id: clientId, body: { status: "Queued" } });
                      updateApprovals({
                        id: clientId,
                        body: {
                          edythc: null,
                          lisak: null,
                          kimn: null,
                        },
                      });
                    }}
                    disabled={isLocked}
                  />
                  <Menu.Item
                    title={"Remove from Queue"}
                    disabled={data.status.current !== "Queued"}
                    onPress={() => {
                      updateStatus({ id: clientId, body: { status: "Potential" } });
                      updateApprovals({
                        id: clientId,
                        body: {
                          edythc: null,
                          lisak: null,
                          kimn: null,
                        },
                      });
                    }}
                  />
                  <Menu.Item
                    title={"Push Client"}
                    onPress={() => {
                      setOpenPushClientModal(!openPushClientModal);
                      // updateStatus({ id: clientId, body: { status: "Pushed" } });
                    }}
                    disabled={true}
                  />
                </Menu>
              </View>
            </View>
          </View>

          <Divider bg={"coolGray.800"} mb={5} />

          <View className={"w-full"}>
            <View className={"z-40"}>
              <AddressTable clientId={clientId} data={data} />
            </View>
            <View className={"z-30"}>
              <ContactTable clientId={clientId} data={data} />
            </View>

            <View className={"flex-row"}>
              { data.approvals &&
                <View className={"w-1/4 z-20"}>
                  <ApprovalsTable clientId={clientId} data={data} />
                </View>
              }
              <View className={"w-1/4"}>
                <ProgramTable clientId={clientId} data={data} />
              </View>
            </View>
          </View>
        </View>
        <View className={"items-center justify-center h-full"}>
          <EditClientForm
            data={data}
            clientId={clientId}
            width={width}
            progress={progress}
            isOpen={open}
          />
        </View>
      </View>

    </SafeAreaView>
  );
}

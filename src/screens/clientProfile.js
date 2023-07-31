import React from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  HamburgerIcon,
  Heading,
  HStack,
  Menu,
  Pressable,
  Text,
  VStack,
} from "native-base";
import {
  useDeleteAddressMutation,
  useDeleteContactMutation,
  useDeleteProgramInfoMutation,
  useDeleteProgramPartsMutation,
  useGetClientByIdQuery,
  useUpdateAddressMutation,
  useUpdateApprovalsMutation,
  useUpdateClientMutation,
  useUpdateContactMutation,
  useUpdateProgramsMutation,
  useUpdateStatusMutation,
} from "../services/client";
import S3 from "../utils/S3";
import Toolbar from "../components/toolbar";
import Table from "../components/table";
import Loading from "./loading";
import AddContactForm from "../forms/addContactForm";
import AddAddressForm from "../forms/addAddressForm";
import AddProgramForm from "../forms/addProgramForm";
import { useDispatch, useSelector } from "react-redux";
import Picker from "../components/picker";
import { useFieldArray, useForm } from "react-hook-form";
import { states, territories, types } from "../constants/dropdownValues";
import Popup from "../components/popup";
import TextInput from "../components/textInput";
import { showNotification } from "../components/notification";
import { ErrorMessage } from "@hookform/error-message";
import _ from "lodash";
import { setStatus } from "../features/client/clientSlice";

const statusColors = {
  Potential: "primary.900",
  Queued: "warning.500",
  Declined: "error.600",
  Approved: "success.400",
  Pushed: "darkBlue.500",
};

export default function ClientProfile({ navigation, route }) {
  const clientId = route.params?.clientId;
  const user = useSelector(state => state.auth.user);
  const { data, isLoading } = useGetClientByIdQuery(clientId);
  const dispatch = useDispatch();
  const client = useSelector(state => state.client);
  const [openModal, setOpenModal] = React.useState(false);
  const [openAddressModal, setOpenAddressModal] = React.useState(false);
  const [openContactModal, setOpenContactModal] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [updateStatus, result] = useUpdateStatusMutation();
  const [updateApprovals, result1] = useUpdateApprovalsMutation();
  const [updatePrograms, result2] = useUpdateProgramsMutation();
  const [deleteAddress, result3] = useDeleteAddressMutation();
  const [deleteContact, result4] = useDeleteContactMutation();
  const [deleteProgram, result5] = useDeleteProgramInfoMutation();
  const [deleteParts, result6] = useDeleteProgramPartsMutation();
  const [updateIndex, setUpdateIndex] = React.useState(null);

  React.useEffect(() => {
    const getFiles = async () => {
      setFiles(await S3.getFiles(user, data.basicInfo.name));
    };

    if (data) {
      dispatch(setStatus(data.status.current));
      getFiles();
    }
  }, [data, user]);

  if (data === undefined || isLoading) {
    return <Loading navigation={navigation} />;
  }

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

  const formatPrograms = arr => {
    return Object.keys(arr)
      .filter(x => arr[x] === 1)
      .map((x, index) => ({ selection: x, key: x }));
  };

  const EditInfo = ({open, setOpen }) => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm();
    const [updateInfo, result] = useUpdateClientMutation();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      setValue("client", {
        name: data.basicInfo.name,
        territory: data.basicInfo.territory,
      });
    }, [setValue, data])

    const onSubmit = values => {
      setLoading(!loading);
      updateInfo({
        id: clientId,
        body: {
          ...values.client
        }
      })
        .unwrap()
        .then(res => {
          setOpen(false);
          setLoading(!loading);
          showNotification({
            text: "Client Name & Territory Successfully Updated",
          });
        })
    }

    if (errors.client === undefined) {
      errors.client = {};
    }

    return (
      <Popup open={open} setOpen={setOpen} header={"Edit Client Name & Territory"}>
        <FormControl isRequired isInvalid={'name' in errors.client}>
          <TextInput
            control={control}
            title={"Client Name"}
            field={"client.name"}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage errors={errors} name={"client.name"} />}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'territory' in errors.client}>
          <Picker
            control={control}
            title={"Territory"}
            field={"client.territory"}
            choices={territories}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage errors={errors} name={"client.territory"}  />}
          />
        </FormControl>

        <Center>
          <Button
            _loading={{
              bg: "success.400",
            }}
            bg={"success.400"}
            isLoading={loading}
            isLoadingText={"Submitting"}
            m={5}
            onPress={handleSubmit(onSubmit)}
            width={"35%"}>
            Save
          </Button>
        </Center>
      </Popup>
    );
  }

  const EditAddress = ({ open, setOpen, index }) => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm();
    const [updateAddress, result] = useUpdateAddressMutation();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      setValue("address", data.addresses[index]);
    }, [setValue, data])

    const onSubmit = values => {
      setLoading(!loading);
      updateAddress({
        id: data.addresses[index].id,
        clientId: clientId,
        body: {
          id: values.address.id,
          clientId: values.address.clientId,
          type: values.address.type,
          address1: values.address.address1,
          city: values.address.city,
          state: values.address.state,
          zip: values.address.zip,
        }
      })
        .unwrap()
        .then(res => {
          setUpdateIndex(null)
          setOpenAddressModal(false);
          setLoading(!loading);
          showNotification({
            text: "Address Successfully Updated",
          });
        });
    }

    if (errors.address === undefined) {
      errors.address = {};
    }

    return (
      <Popup open={open} setOpen={setOpen} header={"Edit Client Address"}>
        <FormControl isRequired isInvalid={'type' in errors.address}>
          <Picker
            control={control}
            title={"Type"}
            field={`address.type`}
            choices={types}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage errors={errors} name={"address.type"} />}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'address' in errors.address}>
          <TextInput
            control={control}
            title={"Street"}
            field={"address.address"}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage errors={errors} name={"address.address"} />}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'city' in errors.address}>
          <TextInput
            control={control}
            title={"City"}
            field={`address.city`}
            rules={{
              required: "Required Field",
            }}
            error={<ErrorMessage errors={errors} name={"address.city"} />}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'state' in errors.address}>
          <Picker
            control={control}
            title={"State"}
            field={`address.state`}
            choices={states}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage errors={errors} name={"address.state"} />}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'zip' in errors.address}>
          <TextInput
            control={control}
            title={"Zip"}
            field={`address.zip`}
            rules={{
              required: "Required Field",
              pattern: {
                value: /[0-9]{5}/,
                message: "Must only contain 5 digits",
              }
            }}
            error={<ErrorMessage errors={errors} name={"address.zip"} />}
          />
        </FormControl>

        <Center>
          <Button
            _loading={{
              bg: "success.400",
            }}
            bg={"success.400"}
            isLoading={loading}
            isLoadingText={"Submitting"}
            m={5}
            onPress={handleSubmit(onSubmit)}
            width={"35%"}>
            Save
          </Button>
        </Center>
      </Popup>
    );
  }

  const EditContact = ({ open, setOpen, index }) => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm();
    const [updateContact, result] = useUpdateContactMutation();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      setValue("contact", data.contacts[index]);
    }, [setValue, data])

    const onSubmit = values => {
      setLoading(!loading);
      updateContact({
        id: data.contacts[index].id,
        clientId: clientId,
        body: {
          id: values.contacts[index].id,
          clientId: values.contacts[index].clientId,
          name: values.contact.name,
          title: values.contact.title,
          phone: values.contact.phone,
          email: values.contact.email,
        }
      })
        .unwrap()
        .then(res => {
          setUpdateIndex(null)
          setOpenContactModal(false);
          setLoading(!loading);
          showNotification({
            text: "Contact Successfully Updated",
          });
        })
    }

    if (errors.contact === undefined) {
      errors.contact = {};
    }

    return (
      <Popup open={open} setOpen={setOpen} header={"Edit Client Contact"}>
        <FormControl isRequired isInvalid={'name' in errors.contact}>
          <TextInput
            control={control}
            title={"Name"}
            field={`contact.name`}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage name={"contact.name"} errors={errors} />}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'title' in errors.contact}>
          <TextInput
            control={control}
            title={"Title"}
            field={`contact.title`}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage name={"contact.title"} errors={errors} />}
          />
        </FormControl>
        <FormControl isInvalid={'phone' in errors.contact}>
          <TextInput
            control={control}
            title={"Phone"}
            field={`contact.phone`}
            rules={{
              pattern: {
                value: /[0-9]{10}/,
                message: "Must be a valid phone number"
              }
            }}
            error={<ErrorMessage name={"contact.phone"} errors={errors} />}
            helperText={"Must be formatted as all numbers (i.e. 1234567890)"}
          />
        </FormControl>
        <FormControl isInvalid={'email' in errors.contact}>
          <TextInput
            control={control}
            title={"Email"}
            field={`contact.email`}
            rules={{
              pattern: {
                value: /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i,
                message: "Must be a valid email address"
              }
            }}
            error={<ErrorMessage name={"contact.email"} errors={errors} />}
          />
        </FormControl>

        <Center>
          <Button
            _loading={{
              bg: "success.400",
            }}
            bg={"success.400"}
            isLoading={loading}
            isLoadingText={"Submitting"}
            m={5}
            onPress={handleSubmit(onSubmit)}
            width={"35%"}>
            Save
          </Button>
        </Center>
      </Popup>
    );
  }

  return (
    <HStack flex={1} justifyContent={"flex-start"} pt={5}>
      <Toolbar navigation={navigation} />

      <EditInfo open={openModal} setOpen={setOpenModal} index={updateIndex} />

      <EditAddress open={openAddressModal} setOpen={setOpenAddressModal} index={updateIndex} />

      <EditContact open={openContactModal} setOpen={setOpenContactModal} index={updateIndex} />

      <VStack flex={1}>
        <VStack mx={2}>
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            my={2}
            width={"100%"}>
            <HStack flex={1} justifyContent={"flex-start"} alignItems={"center"} h={"100%"}>
              <Heading color={"coolGray.800"} p={1}>
                {data.basicInfo.name}
              </Heading>
            </HStack>

            <HStack flex={1} justifyContent={"flex-end"} alignItems={"center"}>
              {/*<Box*/}
              {/*  alignItems={"center"}*/}
              {/*  borderColor={"green.500"}*/}
              {/*  borderRadius={"lg"}*/}
              {/*  borderWidth={1}*/}
              {/*  bg={"green.500"}*/}
              {/*  colorScheme={"info"}*/}
              {/*  mx={2}*/}
              {/*  p={2}*/}
              {/*  w={"25%"}>*/}
              {/*  <Text color={"white"}>{data.basicInfo.territory || "None Selected"}</Text>*/}
              {/*</Box>*/}

              <Box
                alignItems={"center"}
                borderColor={"coolGray.500"}
                borderRadius={"lg"}
                borderWidth={1}
                bg={"coolGray.500"}
                colorScheme={"info"}
                mx={2}
                p={2}
                w={"25%"}>
                <Text color={"white"}>{data.basicInfo.territory || "None Selected"}</Text>
              </Box>

              <Box
                alignItems={"center"}
                borderColor={statusColors[data.status.current]}
                borderRadius={"lg"}
                borderWidth={1}
                bg={statusColors[data.status.current]}
                mx={2}
                p={2}
                w={"25%"}>
                <Text color={"white"}>{data.status.current}</Text>
              </Box>

              <Box ml={2}>
                <Menu
                  offset={10}
                  placement={"bottom right"}
                  trigger={triggerProps => (
                    <Pressable {...triggerProps}>
                      <HamburgerIcon size={8} color={"black"} />
                    </Pressable>
                  )}
                  w={200}>
                  <Menu.Group title={"Client Actions"}>
                    <Divider bg={"coolGray.400"} />

                    <Menu.Group title={"Edit"}>
                      <Menu.Item
                        isDisabled={!client.permissions.name.edit && !client.permissions.territory.edit}
                        onPress={() => setOpenModal(!openModal)}>
                        Edit Name & Territory
                      </Menu.Item>
                    </Menu.Group>

                    <Divider bg={"coolGray.400"} />

                    <Menu.Group title={"Client Pages"}>
                      <Menu.Item
                        onPress={() =>
                          navigation.push("ClientDetails", { clientId: clientId })
                        }>
                        Client Details
                      </Menu.Item>
                      <Menu.Item
                        onPress={() =>
                          navigation.push("ProgramDetails", {
                            programs: data.programs,
                            clientId: clientId,
                          })
                        }>
                        Program Details
                      </Menu.Item>
                      <Menu.Item
                        onPress={() =>
                          navigation.push("ProgramPricing", {
                            programs: data.programs,
                            clientId: clientId,
                          })
                        }>
                        Program Pricing
                      </Menu.Item>
                    </Menu.Group>

                    <Divider bg={"coolGray.400"} />

                    <Menu.Group title={"Edit Status"}>
                      <Menu.Item
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
                        isDisabled={
                          data.status.current !== "Potential" &&
                          data.status.current !== "Declined"
                        }>
                        Submit Client
                      </Menu.Item>
                      <Menu.Item
                        isDisabled={data.status.current !== "Queued"}
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
                          showNotification({
                            text: "Client Status Successfully Updated"
                          })
                        }
                      }>
                        Remove from Queue
                      </Menu.Item>
                      <Menu.Item
                        onPress={() => {
                          updateStatus({ id: clientId, body: { status: "Pushed" } });
                        }}
                        isDisabled={data.status.current !== "Approved"}>
                        Push Client
                      </Menu.Item>
                      {/*<Menu.Item isDisabled={data.status.current === "Potential"}>*/}
                      {/*  Update Client*/}
                      {/*</Menu.Item>*/}
                    </Menu.Group>
                  </Menu.Group>
                </Menu>
              </Box>
            </HStack>
          </HStack>

          <Divider bg={"coolGray.800"} mb={5} />
        </VStack>

        <Table
          columnNames={["Type", "Street", "City", "State", "Zip"]}
          fields={["type", "address", "city", "state", "zip"]}
          data={data.addresses}
          title={"Addresses"}
          addIcon={client.permissions.addresses.edit}
          form={
            data.addresses.length !== 3 ? (
              <AddAddressForm
                clientId={clientId}
                selectedAddresses={data.addresses}
              />
            ) : null
          }
          position={"left"}
          alertHeader={"Delete Address"}
          alertBody={
            "Are you sure you would like to delete this record? Once deleted, this record can not be retrieved."
          }
          rowAction={row => {
            deleteAddress({ clientId: row.clientId, id: row.id });
            showNotification({
              text: "Address Successfully Deleted."
            });
          }}
          edit={{
            func: setOpenAddressModal,
            variable: openAddressModal,
          }}
          setIndex={setUpdateIndex}
        />

        <Table
          columnNames={["Name", "Title", "Phone", "Email"]}
          fields={["name", "title", "phone", "email"]}
          data={data.contacts.map(item => ({
            name: item.name,
            title: item.title,
            phone: item.phone,
            email: item.email
          }))}
          title={"Contacts"}
          addIcon={client.permissions.contacts.edit}
          editIcon={client.permissions.contacts.edit}
          form={<AddContactForm clientId={clientId} />}
          position={"left"}
          alertHeader={"Delete Contact"}
          alertBody={
            "Are you sure you would like to delete this record? Once deleted, this record can not be retrieved."
          }
          rowAction={row => {
            deleteContact({ clientId: row.clientId, id: row.id });
            showNotification({
              text: "Contact Successfully Deleted."
            });
          }}
          editRow={true}
          edit={{
            func: setOpenContactModal,
            variable: openContactModal,
          }}
          setIndex={setUpdateIndex}
        />

        <HStack flex={1}>
          <VStack flex={1}>
            <Table
              columnNames={["Selected"]}
              data={formatPrograms(data.programs)}
              fields={["selection"]}
              title={"Programs"}
              addIcon={data.status.current === "Potential" || data.status.current === "Updating" && true}
              editIcon={true}
              form={
                <AddProgramForm
                  clientId={clientId}
                  selectedPrograms={formatPrograms(data.programs)}
                />
              }
              alertHeader={"Delete Program"}
              alertBody={
                "Are you sure you would like to delete this record? Once deleted, this record can not be retrieved and all related information (pricing and details) will be deleted."
              }
              rowAction={row => {
                updatePrograms({
                  id: clientId,
                  body: { [row.selection.toLowerCase()]: 0 },
                });
                deleteProgram({
                  program: row.selection.toLowerCase(),
                  id: clientId,
                });
                deleteParts({
                  program: row.selection,
                  id: clientId,
                });
                showNotification({
                  text: "Program Successfully Deleted."
                });
              }}
              deleteRow={true}
            />
          </VStack>
          <VStack flex={2}>
            <Table
              columnNames={["Name", "Type", "Size"]}
              data={formatFileArray(files)}
              fields={["name", "type", "size"]}
              title={"Files"}
              addIcon={data.status.current === "Potential" || data.status.current === "Updating" && true}
              editIcon={true}
              action={async () => await S3.putObject(user, data.basicInfo.name)}
              link={true}
              rowAction={S3.viewObject}
            />
          </VStack>
          {data.status.current !== "Potential" &&
            <VStack flex={1}>
              <Table
                columnNames={["Manager", "Decision"]}
                data={formatApprovalsArr(data.approvals)}
                fields={["name", "value"]}
                title={"Approvals"}
                editIcon={false}
              />
            </VStack>
          }
        </HStack>
      </VStack>
    </HStack>
  );
}

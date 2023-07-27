import { createSlice } from "@reduxjs/toolkit";

const editStatuses = ["Potential", "Declined", "Updated"];

const initialState = {
  status: "",
  permissions: {
    name: {
      view: true,
      edit: false,
    },
    territory: {
      view: true,
      edit: false,
    },
    addresses: {
      view: true,
      edit: false,
    },
    contacts: {
      view: true,
      edit: false,
    },
    programs: {
      view: true,
      edit: false,
    },
    files: {
      view: true,
      edit: false,
    },
    pages: {
      "Client Details": {
        view: true,
        edit: false,
      },
      "Program Details": {
        view: true,
        edit: false,
      },
      "Program Pricing": {
        view: true,
        edit: false,
      }
    },
    updateStatus: {
      submit: false,
      removeFromQueue: false,
      pushToSage: false,
    }
  }
};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
      state.permissions.updateStatus = {

      };
      state.permissions = {
        ...initialState.status,
        name: {
          ...initialState.permissions.name,
          edit: editStatuses.includes(action.payload),
        },
        territory: {
          ...initialState.permissions.territory,
          edit: editStatuses.includes(action.payload),
        },
        addresses: {
          ...initialState.permissions.addresses,
          edit: editStatuses.includes(action.payload),
        },
        contacts: {
          ...initialState.permissions.contacts,
          edit: editStatuses.includes(action.payload),
        },
        programs: {
          ...initialState.permissions.programs,
          edit: editStatuses.includes(action.payload),
        },
        files: {
          ...initialState.permissions.files,
          edit: editStatuses.includes(action.payload),
        },
        pages: {
          "ClientDetails": {
            ...initialState.permissions.pages["Client Details"],
            edit: editStatuses.includes(action.payload),
          },
          "ProgramDetails": {
            ...initialState.permissions.pages["Program Details"],
            edit: editStatuses.includes(action.payload),
          },
          "ProgramPricing": {
            ...initialState.permissions.pages["Program Pricing"],
            edit: editStatuses.includes(action.payload),
          }
        },
        updateStatus: {
          ...initialState.permissions.updateStatus,
          submit: ["Potential", "Updating", "Declined"].includes(action.payload),
          removeFromQueue: ["Queued"].includes(action.payload),
          pushToSage: ["Approved"].includes(action.payload),
        }
      }
    },
  },
});

export const { setStatus } = clientSlice.actions;

export default clientSlice.reducer;
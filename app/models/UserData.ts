import { types } from "mobx-state-tree";

export const UserDataModal = types.model("UserDataModal", {
  id: types.identifierNumber,
  firstName: types.string,
  email: types.string,
  phone: types.string,
  company: types.model({
    department: types.string,
    name: types.string,
    title: types.string,
    address: types.model({
      address: types.string,
      city: types.string,
      state: types.string,
      stateCode: types.string,
      postalCode: types.string,
      coordinates: types.model({
        lat: types.number,
        lng: types.number,
      }),
      country: types.string,
    }),
  }),
});

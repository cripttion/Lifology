import { types } from "mobx-state-tree";
import { UserDataModal } from "./UserData";
import { withSetPropAction } from "./helpers/withSetPropAction";
import { api } from "app/services/api";



export const UserDataStoreModal = types.model('UserDataStore')
    .props({
        userData:types.array(UserDataModal),
        limit: types.optional(types.number, 10),
        skip:types.optional(types.number,0),
        loading: types.optional(types.boolean, false),
        hasMore: types.optional(types.boolean, true),

    })
    .actions(withSetPropAction)
    .actions((store)=>({
        async fetchUserData() {
            console.log('fetch user called')
            // if (store.loading || !store.hasMore) return;
            
            store.setProp("loading", true);
            const response = await api.getUserData(store.limit,store.skip);
            // console.log(...response.userData)
            if (response.kind === "ok") {
              if (response.userData.length === 0) {
                store.setProp("hasMore", false);
              } else {
                // Append new data to the existing data
                // console.log(response.userData);
                store.setProp("userData", [...store.userData,...response.userData]);
                store.setProp("skip", store.skip + store.limit);
              }
            } else {
              console.error("Failed to fetch user data:", response);
            }
            
            store.setProp("loading", false);
          },
    }))
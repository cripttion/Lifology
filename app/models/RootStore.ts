import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserDataStoreModal } from "./UserDataStore"
import { UserPostStoreModal } from "./UserPostStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    userDataStore:types.optional(UserDataStoreModal,{}),
    UserPostStore:types.optional(UserPostStoreModal,{})

})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

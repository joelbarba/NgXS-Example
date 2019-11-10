import { State, Action, StateContext } from '@ngxs/store';
import {FakeRequestService} from '../fake-request.service';

// ---- MODEL -------------------------------------------------------------

export interface IUsersState {
  list: IUsersList;
  count: number;
  status: 0 | 1 | 2 | 3;  // 0=Empty, 1=Loading, 2=Loaded, 3=Error
}
export interface IUsersList extends Array<IUser> {}
export interface IUser extends INewUser { id: string; }               // Full User object
export interface IEditUser extends Partial<INewUser> { id: string; }  // id required
export interface INewUser { // User mutable data
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

// ---- ACTIONS -------------------------------------------------------------

// export namespace Users {}
export class GetUsers   { static readonly type = '[USERS] Get'; }
export class LoadUsers  { static readonly type = '[USERS] Load'; }
export class AddUser    { static readonly type = '[USERS] Add';    constructor(public payload: INewUser) {} }
export class EditUser   { static readonly type = '[USERS] Edit';   constructor(public payload: IEditUser) {} }
export class RemoveUser { static readonly type = '[USERS] Remove'; constructor(public id: string) {} }

// ---- REDUCER -------------------------------------------------------------

@State<IUsersState>({
  name: 'usersState',
  defaults: { list: [], count: 0, status: 0 }
})
export class UsersState {
  private loadingPromise;
  constructor(private usersApi: FakeRequestService) { }

  @Action(GetUsers)
  getUsers(ctx: StateContext<IUsersState>) {
    const state = ctx.getState();
    if (state.status !== 2) { // Load only if not yet
      return ctx.dispatch(new LoadUsers());
    }
  }

  @Action(LoadUsers)
  load(ctx: StateContext<IUsersState>) {
    const state = ctx.getState();
    if (state.status !== 1) { // If already loading, wait for that
      ctx.patchState({ status: 1 });
      this.loadingPromise = this.usersApi.query().then((data: any) => {
        ctx.setState({ list: data.users, count: data.users.length, status: 2 });
      });
    }
    return this.loadingPromise;
  }

  @Action(AddUser)
  add(ctx: StateContext<IUsersState>, action: AddUser) {
    return this.usersApi.post(action.payload).then((newUser: IUser) => {
      const state = ctx.getState();
      ctx.patchState({ list: [ ...state.list, newUser ], count: state.count + 1 });
    });
  }

  @Action(RemoveUser)
  remove(ctx: StateContext<IUsersState>, action: RemoveUser) {
    return this.usersApi.delete(action.id).then(() => {
      const state = ctx.getState();
      const list = state.list.filter(user => user.id !== action.id);
      ctx.patchState({ list, count: list.length });
    });
  }

  @Action(EditUser)
  edit(ctx: StateContext<IUsersState>, action: EditUser) {
    return this.usersApi.post(action.payload).then((user: IUser) => {
      const state = ctx.getState();
      const newState = state.list.map(listUser => {
        if (user.id === listUser.id) {
          return { ...listUser, ...user };
        }
        return listUser;
      });
      ctx.patchState({ list: newState });
    });
  }
}

import { State, Action, StateContext } from '@ngxs/store';
import {FakeRequestService} from '../fake-request.service';

export interface IUsersState {
  list: IUsersList;
  count: number;
  status: 0 | 1 | 2 | 3;  // 0=Empty, 1=Loading, 2=Loaded, 3=Error
}
export interface IUsersList extends Array<IUser> {}
export interface IUser extends INewUser { id: string; }               // Full User object
export interface IEditUser extends Partial<INewUser> { id: string; }  // id required, data optional
export interface INewUser { // User mutable data
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

// ---- ACTIONS -------------------------------------------------------------

// export namespace Users {}
export class LoadUsers  { static readonly type = '[USERS] Load'; }
export class AddUser    { static readonly type = '[USERS] Add';    constructor(public payload: INewUser) {} }
export class EditUser   { static readonly type = '[USERS] Edit';   constructor(public payload: IEditUser) {} }
export class RemoveUser { static readonly type = '[USERS] Remove'; constructor(public id: string) {} }

// ---- REDUCER -------------------------------------------------------------

@State<IUsersState>({
  name: 'users',
  defaults: { list: [], count: 0, status: 0 }
})
export class UsersState {
  constructor(private usersApi: FakeRequestService) { }

  @Action(LoadUsers)
  load(ctx: StateContext<IUsersState>) {
    ctx.patchState({ status: 1 });
    return this.usersApi.loadUser().then((data: any) => {
      ctx.setState({ list: data.users, count: data.users.length, status: 2 });
    });
  }

  @Action(AddUser)
  add(ctx: StateContext<IUsersState>, action: AddUser) {
    const state = ctx.getState();
    const id = 'u' + state.list.length;
    const newUser: IUser = { id, ...action.payload };
    ctx.patchState({ list: [ ...state.list, newUser ], count: state.count + 1 });

    // OR:
    // ctx.setState((state) => {
    //   const nextState = { ...state };
    //   nextState.list.push(newUser);
    //   return nextState;
    // });
  }

  @Action(RemoveUser)
  remove(ctx: StateContext<IUsersState>, action: RemoveUser) {
    const state = ctx.getState();
    ctx.patchState({ list: state.list.filter(user => user.id !== action.id) });
  }

  @Action(EditUser)
  edit(ctx: StateContext<IUsersState>, action: EditUser) {
    const state = ctx.getState();
    const newState = state.list.map(user => {
      if (user.id === action.payload.id) {
        return { ...user, ...action.payload };
      }
      return user;
    });
    ctx.patchState({ list: newState });
  }
}

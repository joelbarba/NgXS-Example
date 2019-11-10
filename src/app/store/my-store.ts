import { Injectable } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {
  AddUser,
  EditUser,
  GetUsers,
  IEditUser,
  INewUser,
  IUsersList,
  IUsersState,
  LoadUsers,
  RemoveUser,
} from './users.state';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';

@Injectable({ providedIn: 'root' })
export class MyStoreService {
  constructor(private store: Store) {}

  @Select() usersState$: Observable<IUsersState>;
  @Select(state => state.usersState.list) users$: Observable<IUsersList>;
  @SelectSnapshot(state => state.usersState.list) users: IUsersList;

  getUsers   = (): Promise<IUsersState>                 => this.store.dispatch(new GetUsers()).toPromise();
  loadUsers  = (): Promise<IUsersState>                 => this.store.dispatch(new LoadUsers()).toPromise();
  addUser    = (user: INewUser): Promise<IUsersState>   => this.store.dispatch(new AddUser(user)).toPromise();
  removeUser = (userId: string): Promise<IUsersState>   => this.store.dispatch(new RemoveUser(userId)).toPromise();
  editUser   = (user: IEditUser): Promise<IUsersState>  => this.store.dispatch(new EditUser(user)).toPromise();
}

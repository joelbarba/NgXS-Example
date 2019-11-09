import { Injectable } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AddUser, EditUser, IEditUser, INewUser, IUser, IUsersList, IUsersState, LoadUsers, RemoveUser, UsersState} from './users.state';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';

@Injectable({ providedIn: 'root' })
export class MyStoreService {
  @Select(UsersState) usersState$: Observable<IUsersState>;
  @Select(state => state.users.list) users$: Observable<IUsersList>;

  @SelectSnapshot(UsersState) usersState: IUsersState;
  @SelectSnapshot(state => state.users.list) users: IUsersList;

  constructor(private store: Store) {}

  public getUsers = (): Promise<IUsersList> => {
    if (this.usersState.status === 2) {
      return Promise.resolve(this.users);
    } else {
      return this.store.dispatch(new LoadUsers()).toPromise();
    }
  };

  public loadUsers = (): Promise<IUsersList> => {
    return this.store.dispatch(new LoadUsers()).toPromise();
  };

  public addUser = (user: INewUser): Promise<IUser> => {
    return this.store.dispatch(new AddUser(user)).toPromise();
  };

  public removeUser = (userId: string): Promise<null> => {
    return this.store.dispatch(new RemoveUser(userId)).toPromise();
  };

  public editUser = (user: IEditUser): Promise<IUser> => {
    return this.store.dispatch(new EditUser(user)).toPromise();
  };

}

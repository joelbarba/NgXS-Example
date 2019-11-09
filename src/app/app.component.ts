import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {UsersState, AddUser, IUsersState, IUsersList, LoadUsers, RemoveUser, EditUser} from './store/users.state';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // @Select(UsersState) users$: Observable<IUsers>;
  @Select() users$: Observable<IUsersState>;   // Reads the "name" of the state (without $)
  @Select(state => state.users.list) usersList$: Observable<IUsersList>;

  // ---------------------------------------------

  // public users$: Observable<IUsers>;
  // public usersList$: Observable<Array<IUsers>>;

  constructor(private store: Store) {
    // this.users$ = this.store.select(state => state.users);
    this.users$.subscribe(val => console.log(val));

    // this.usersList$ = this.store.select(state => state.users)
    //   .pipe(map(users => users.list));

  }

  public loadUsers = () => {
    this.store.dispatch(new LoadUsers()).toPromise().then(data => {
      console.log('LOADED', data);
    });
  };

  public addUser = () => {
    this.store.dispatch(new AddUser({
      username: 'user99',
      email: 'user99@blueface.com',
      first_name: 'Mrs',
      last_name: 'Tomato'
    })).toPromise().then(data => {
      console.log('User added', data);
    });
  };

  public deleteUser = (user) => {
    this.store.dispatch(new RemoveUser(user.id)).toPromise().then(data => {
      console.log('User deleted', data);
    });
  };

  public editUser = (user) => {
    this.store.dispatch(new EditUser({
      id: user.id,
      first_name: user.last_name,
      last_name: user.first_name,
    }));
  };
}

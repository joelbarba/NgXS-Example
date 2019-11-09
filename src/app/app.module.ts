import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxsModule } from '@ngxs/store';
import { UsersState } from './store/users.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import {NgxsSelectSnapshotModule} from '@ngxs-labs/select-snapshot';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxsModule.forRoot([
      UsersState,
    ]),
    NgxsSelectSnapshotModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

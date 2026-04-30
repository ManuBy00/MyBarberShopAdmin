import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from './shared/Components/side-bar/side-bar';
import { Layout } from './shared/Components/layout/layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBar, Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BarberStore');
}

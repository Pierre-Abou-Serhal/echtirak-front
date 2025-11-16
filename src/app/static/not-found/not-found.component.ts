import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found.component',
  standalone: true,
  imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}

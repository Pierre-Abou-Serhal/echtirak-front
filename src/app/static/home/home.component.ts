import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-home.component',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule, DividerModule, ChipModule, TagModule, AvatarModule, AppFloatingConfigurator],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {}

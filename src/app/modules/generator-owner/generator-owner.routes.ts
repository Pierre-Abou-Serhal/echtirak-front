import { SubscribersComponent } from '@/modules/generator-owner/subscribers/subscribers.component';
import { Routes } from '@angular/router';
import { GENERATOR_OWNER_MENU } from '@/modules/generator-owner/generator-owner.menu';
import { GeneratorsComponent } from '@/modules/generator-owner/generators/generators.component';

export const GENERATOR_OWNER_ROUTES: Routes = [
    {
        path: '',
        data: { menu: GENERATOR_OWNER_MENU },
        children: [
            { path: 'subscribers', component: SubscribersComponent },
            { path: 'generators', component: GeneratorsComponent },
        ]
    }
] as Routes;

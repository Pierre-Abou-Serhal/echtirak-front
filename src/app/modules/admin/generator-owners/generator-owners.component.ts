import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '@/core/services/admin.service';
import { AdminGeneratorOwnerProfile } from '@/core/models/model';
import { GetGeneratorOwnersResponse } from '@/core/services/api/response';
import { Button, ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-generator-owners.component',
    imports: [
        ReactiveFormsModule,
        TableModule
    ],
    templateUrl: './generator-owners.component.html',
    styleUrl: './generator-owners.component.scss'
})
export class GeneratorOwnersComponent implements OnInit {
    private readonly adminService: AdminService = inject(AdminService);

    generatorOwners: AdminGeneratorOwnerProfile[] = [];
    isGeneratorOwnersLoading: boolean = false;

    ngOnInit() {
        this.loadGeneratorOwners();
    }

    loadGeneratorOwners(): void {
        this.isGeneratorOwnersLoading = true;

        this.adminService.getGeneratorOwners().subscribe({
            next: (response: GetGeneratorOwnersResponse) => {
                this.generatorOwners = response.owners;
                this.isGeneratorOwnersLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.isGeneratorOwnersLoading = false;
            }
        });
    }
}

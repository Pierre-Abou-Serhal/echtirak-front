import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { KvaReading } from '@/core/models/model';
import { SelectOptionStrValue } from '@/core/dtos/dto';

@Component({
    selector: 'app-kva-edit-modal',
    standalone: true,
    imports: [FormsModule, DialogModule, InputTextModule, InputNumberModule, SelectModule, ButtonModule],
    templateUrl: './kva-edit-modal.component.html',
    styleUrl: './kva-edit-modal.component.scss'
})
export class KvaEditModalComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() kvaReading: KvaReading | null = null;
    @Input() kvaReadingStatuses: SelectOptionStrValue[] = [];

    @Output() save = new EventEmitter<KvaReading>();
    @Output() cancel = new EventEmitter<void>();

    editable: KvaReading | null = null;
    submitted = false;

    ngOnChanges() {
        // whenever a new reading is passed, clone it
        this.editable = this.kvaReading ? { ...this.kvaReading } : null;
        this.submitted = false;
    }

    close() {
        this.submitted = false;
        this.visible = false;
        this.visibleChange.emit(false);
        this.cancel.emit();
    }

    isKvaReadingInvalid(): boolean {
        if (!this.editable) return false;
        if (this.editable.kvaReading == null) return true;
        return this.editable.kvaReading <= this.editable.kvaCurrent;
    }

    submit() {
        this.submitted = true;

        if (!this.editable) return;

        // validation
        if (this.isKvaReadingInvalid()) return;
        if (!this.editable.status) return;

        this.save.emit({ ...this.editable });
        this.visible = false;
        this.visibleChange.emit(false);
    }

    getOverlayOptions() {
        return {
            listener: (event: Event, options?: any) => {
                if (options?.type === 'scroll') return false;
                return options?.valid;
            }
        };
    }
}

import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@/core/services/notification.service';
import { Table, TableModule } from 'primeng/table';
import { AdminAnnouncement } from '@/core/models/model';
import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { debounceTime, finalize, firstValueFrom, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetAdminAnnouncementsQueryParams, UpsertAnnouncementRequest } from '@/core/services/api/request';
import { GetAdminAnnouncementsResponse, PublishAnnouncementResponse, UpsertAnnouncementResponse } from '@/core/services/api/response';
import { AdminService } from '@/core/services/admin.service';
import Papa from 'papaparse';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { AnnouncementPriority } from '@/core/enums/enum';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { DatePicker } from 'primeng/datepicker';
import { OverlayListenerOptions, OverlayOptions } from 'primeng/api';
import { Checkbox } from 'primeng/checkbox';
import { MultiSelect } from 'primeng/multiselect';

export interface AdminAnnouncementSearchFilter {
    keyword?: string;
    isPublished?: boolean;
}

@Component({
    selector: 'app-announcements.component',
    imports: [IconField, InputIcon, InputText, FormsModule, Select, Button, TableModule, Tag, DatePipe, Dialog, ReactiveFormsModule, Message, Textarea, DatePicker, Checkbox, MultiSelect],
    templateUrl: './announcements.component.html',
    styleUrl: './announcements.component.scss'
})
export class AnnouncementsComponent implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    @ViewChild('dt') table!: Table;

    constructor(private fb: FormBuilder) {
        this.filter = { keyword: '', isPublished: undefined };

        this.announcementForm = this.fb.group({
            title: [null, Validators.required],
            content: [null, Validators.required],
            priority: [AnnouncementPriority.LOW, Validators.required],
            expiresAt: [null, Validators.required]
        });

        this.publishForm = this.fb.group({
            announcementId: [null, Validators.required],
            publishToAll: [true, Validators.required],
            generatorOwnerUserIds: [[]]
        });
    }

    // Data
    announcements: AdminAnnouncement[] = [];
    selectedAnnouncements: AdminAnnouncement[] = [];

    // Loading
    loading = true;
    private loadingMore = false;

    // UI pagination (PrimeNG table)
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // API pagination
    private apiPageSize = 100;
    private currentApiPage = -1;
    private hasMoreFromServer = true;

    totalRecords = 0;

    // Filters
    filter: AdminAnnouncementSearchFilter;

    publishedOptions: any[] = [
        { label: 'All', value: undefined },
        { label: 'Published', value: true },
        { label: 'Unpublished', value: false }
    ];

    private search$ = new Subject<AdminAnnouncementSearchFilter>();

    deletingId: number | null = null;

    // Dialog state
    isAnnouncementDialogOpen = false;
    isAnnouncementSaving = false;

    announcementForm: FormGroup;
    selectedAnnouncementId = -1;

    readonly priorityOptions: SelectOptionStrValue[] = [
        { label: 'Low', value: AnnouncementPriority.LOW },
        { label: 'Medium', value: AnnouncementPriority.MEDIUM },
        { label: 'High', value: AnnouncementPriority.HIGH },
        { label: 'Urgent', value: AnnouncementPriority.URGENT }
    ];

    // Publish dialog state
    isPublishDialogOpen = false;
    isPublishSaving = false;

    publishForm: FormGroup;

    // Generator Owners
    generatorOwnersLoading = false;
    generatorOwnerOptions: SelectOptionNumValue[] = [];

    ngOnInit(): void {
        this.search$
            .pipe(
                debounceTime(250),
                tap(() => {
                    this.resetDataState();
                    this.loading = true;
                }),
                switchMap(() => this.fetchApiPage(1).pipe(finalize(() => (this.loading = false)))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => this.ensureDataFor(this.first + this.rows),
                error: (err) => {
                    console.log(err);
                    this.announcements = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });

        // Initial load
        this.search$.next(this.filter);

        this.publishForm
            .get('publishToAll')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((publishToAll: boolean) => {
                if (!publishToAll) {
                    this.loadGeneratorOwnersIfNeeded();
                } else {
                    // if publish to all, clear selection
                    this.publishForm.get('generatorOwnerUserIds')?.setValue([]);
                }
            });
    }

    // ========= API =========

    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        // Build query params, only include isPublished if it’s defined (All => undefined)
        const queryParams: GetAdminAnnouncementsQueryParams = {
            pageNumber,
            pageSize: this.apiPageSize,
            keyword: (this.filter.keyword ?? '').trim(),
            isPublished: this.filter.isPublished
        };

        return this.adminService.getAnnouncements(queryParams).pipe(
            tap((res: GetAdminAnnouncementsResponse) => {
                const page = res?.page;
                if (!page) {
                    this.hasMoreFromServer = false;
                    return;
                }

                const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = res.page;

                console.log(items);

                this.announcements = [...this.announcements, ...items];

                this.currentApiPage = apiPageNumber;
                if (pageSize && pageSize > 0) this.apiPageSize = pageSize;

                this.totalRecords = totalCount;
                this.hasMoreFromServer = hasNext;
            }),
            finalize(() => (this.loadingMore = false))
        );
    }

    private ensureDataFor(targetIndex: number): void {
        if (targetIndex < this.announcements.length) return;
        if (!this.hasMoreFromServer || this.loadingMore) return;

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber).subscribe({
            next: () => {
                if (targetIndex >= this.announcements.length && this.hasMoreFromServer) {
                    this.ensureDataFor(targetIndex);
                }
            },
            error: () => (this.hasMoreFromServer = false)
        });
    }

    private resetDataState(): void {
        this.announcements = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
        this.selectedAnnouncements = [];
    }

    // ========= UI / Filters =========

    applyFilters(): void {
        this.search$.next(this.filter);
    }

    resetFilters(): void {
        this.filter = { keyword: '', isPublished: undefined };
        this.applyFilters();
    }

    clear(table: Table): void {
        table.clear();
        this.filter = { keyword: '', isPublished: undefined };
        this.search$.next(this.filter);
    }

    next(): void {
        if (this.isLastPage()) return;
        this.first = this.first + this.rows;
        this.ensureDataFor(this.first + this.rows);
    }

    prev(): void {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset(): void {
        this.first = 0;
    }

    pageChange(event: any): void {
        const oldRows = this.rows;
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;

        if (event.rows != null && event.rows !== oldRows) this.first = 0;

        this.ensureDataFor(this.first + this.rows);
    }

    isLastPage(): boolean {
        const atEndOfLoadedArray = this.first + this.rows >= this.announcements.length;
        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    // ========= Export =========

    exportToCsv(): void {
        if (!this.announcements?.length) return;

        let listToExport = this.announcements;
        if (this.selectedAnnouncements?.length) listToExport = this.selectedAnnouncements;

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'admin_announcements.csv';
        a.click();

        URL.revokeObjectURL(url);
    }

    // ========= Helpers =========

    getPublishedSeverity(isPublished: boolean) {
        return isPublished ? 'success' : 'secondary';
    }

    prioritySeverity(priority: string) {
        switch (priority) {
            case AnnouncementPriority.URGENT:
                return 'error';

            case AnnouncementPriority.HIGH:
                return 'warn';

            case AnnouncementPriority.MEDIUM:
                return 'info';

            case AnnouncementPriority.LOW:
                return 'secondary';

            default:
                return null;
        }
    }

    // Modal functions
    openNewAnnouncement() {
        this.selectedAnnouncementId = -1;

        this.announcementForm.reset();
        this.announcementForm.get('priority')?.setValue(AnnouncementPriority.LOW);
        this.announcementForm.get('expiresAt')?.setValue(null);

        this.isAnnouncementDialogOpen = true;
    }

    editAnnouncement(a: AdminAnnouncement) {
        this.selectedAnnouncementId = a.id;

        this.announcementForm.get('title')?.setValue(a.title);
        this.announcementForm.get('content')?.setValue(a.content);
        this.announcementForm.get('priority')?.setValue(a.priority);

        // PrimeNG calendar expects Date (best UX)
        this.announcementForm.get('expiresAt')?.setValue(a.expiresAt ? new Date(a.expiresAt) : null);

        this.isAnnouncementDialogOpen = true;
    }

    hideAnnouncementDialog() {
        this.isAnnouncementDialogOpen = false;
    }

    // -------- Save --------

    private findAnnouncementIndexById(id: number): number {
        return this.announcements.findIndex((x) => x.id === id);
    }

    async saveAnnouncement() {
        this.isAnnouncementSaving = true;
        this.announcementForm.markAllAsTouched();

        if (!this.announcementForm.valid) {
            this.isAnnouncementSaving = false;
            return;
        }

        const expiresAtDate: Date = this.announcementForm.get('expiresAt')?.value;

        const request: UpsertAnnouncementRequest = {
            id: this.selectedAnnouncementId,
            title: this.announcementForm.get('title')?.value,
            content: this.announcementForm.get('content')?.value,
            priority: this.announcementForm.get('priority')?.value,
            // API wants string
            expiresAt: expiresAtDate.toISOString()
        };

        try {
            const res: UpsertAnnouncementResponse = await firstValueFrom(this.adminService.upsertAnnouncement(request));

            const saved = res.announcement;

            if (this.selectedAnnouncementId === -1) {
                this.announcements.push(saved);
                this.notificationService.success('Successful', 'Announcement Added');
            } else {
                const idx = this.findAnnouncementIndexById(saved.id);
                if (idx !== -1) this.announcements[idx] = saved;
                this.notificationService.success('Successful', 'Announcement Updated');
            }

            this.announcements = [...this.announcements];

            this.isAnnouncementSaving = false;
            this.isAnnouncementDialogOpen = false;
        } catch (error) {
            console.log(error);
            this.isAnnouncementSaving = false;
        }
    }

    // -------- Validation helper --------
    isInvalid(controlName: string) {
        const control = this.announcementForm.get(controlName);
        return control?.invalid && (control.touched || this.isAnnouncementSaving);
    }

    deleteAnnouncement(announcement: AdminAnnouncement) {
        this.deletingId = announcement.id;

        this.adminService
            .deleteAnnouncement(announcement.id)
            .pipe(finalize(() => (this.deletingId = null)))
            .subscribe({
                next: () => {
                    this.announcements = this.announcements.filter((x) => x.id !== announcement.id);

                    this.notificationService.success('Successful', 'Announcement successfully deleted.');
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    getOverlayOptions(): OverlayOptions {
        return {
            listener: (event: Event, options?: OverlayListenerOptions) => {
                if (options?.type === 'scroll') {
                    return false;
                }
                return options?.valid;
            }
        };
    }

    // Publish Announcement Form Modal functions
    openPublishDialog(a: AdminAnnouncement) {
        this.publishForm.reset({
            announcementId: a.id,
            publishToAll: true,
            generatorOwnerUserIds: []
        });

        this.isPublishDialogOpen = true;
    }

    hidePublishDialog() {
        this.isPublishDialogOpen = false;
        this.publishForm.reset();
    }

    // Called when user unchecks "Publish to all"
    private loadGeneratorOwnersIfNeeded(): void {
        if (this.generatorOwnerOptions.length) return; // already loaded

        this.generatorOwnersLoading = true;

        this.adminService
            .getGeneratorOwners()
            .pipe(finalize(() => (this.generatorOwnersLoading = false)))
            .subscribe({
                next: (res) => {
                    this.generatorOwnerOptions = (res?.owners ?? []).map((o) => ({
                        label: `${o.username} - ${o.firstName ?? ''} ${o.lastName ?? ''}`.trim(),
                        value: o.id
                    }));
                },
                error: () => {
                    this.generatorOwnerOptions = [];
                    this.notificationService.error('Error', 'Failed to load generator owners');
                }
            });
    }

    submitPublishAnnouncement() {
        this.isPublishSaving = true;
        this.publishForm.markAllAsTouched();

        const announcementId = this.publishForm.get('announcementId')?.value as number;
        const publishToAll = this.publishForm.get('publishToAll')?.value as boolean;
        const generatorOwnerUserIds = this.publishForm.get('generatorOwnerUserIds')?.value as number[];

        // Validation rule: if not publishToAll => must pick at least 1 GO
        if (!publishToAll && (!generatorOwnerUserIds || generatorOwnerUserIds.length === 0)) {
            this.notificationService.error('Error', 'Select at least one Generator Owner.');
            this.isPublishSaving = false;
            return;
        }

        const request = {
            announcementId,
            publishToAll,
            generatorOwnerUserIds: publishToAll ? [] : generatorOwnerUserIds
        };

        this.adminService
            .publishAnnouncement(request)
            .pipe(finalize(() => (this.isPublishSaving = false)))
            .subscribe({
                next: (res: PublishAnnouncementResponse) => {
                    this.notificationService.success('Successful', 'Announcement successfully published.');
                    this.isPublishDialogOpen = false;

                    // Optional: update row state locally
                    const idx = this.findAnnouncementIndexById(res.response.announcementId);
                    if (idx !== -1) {
                        this.announcements[idx] = {
                            ...this.announcements[idx],
                            isPublished: res.response.isPublished,
                            publishedAt: res.response.publishedAt,
                            recipientCount: res.response.recipientCount
                        };
                        this.announcements = [...this.announcements];
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }
}

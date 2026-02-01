import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { Announcement } from '@/core/models/model';
import { finalize} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetAnnouncementsQueryParams } from '@/core/services/api/request';
import { GetAnnouncementsResponse } from '@/core/services/api/response';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { DatePipe, formatDate, NgClass } from '@angular/common';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { PrimeTemplate } from 'primeng/api';
import { SelectButton } from 'primeng/selectbutton';
import { DataView } from 'primeng/dataview';
import { AnnouncementFilterType, AnnouncementPriority, DataViewLayout } from '@/core/enums/enum';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { NotificationService } from '@/core/services/notification.service';
import { UserContextService } from '@/core/services/user-context.service';


@Component({
    selector: 'app-announcements.component',
    imports: [FormsModule, Card, Tag, DatePipe, ToggleSwitch, PrimeTemplate, SelectButton, DataView, NgClass, ProgressSpinner, TableModule, Button],
    templateUrl: './announcements.component.html',
    styleUrl: './announcements.component.scss'
})
export class AnnouncementsComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService: NotificationService = inject(NotificationService);
    private readonly userContextService = inject(UserContextService);

    private readonly destroyRef = inject(DestroyRef);

    announcements: Announcement[] = [];
    totalRecords = 0;
    loading = false;

    // DataView UI state
    layout: DataViewLayout = DataViewLayout.LIST;
    layoutOptions: Array<DataViewLayout> = [DataViewLayout.LIST, DataViewLayout.GRID];

    first = 0;
    rows = 12;
    rowsPerPageOptions = [12, 24, 72, 96];

    // Filters
    includeDeleted = false;
    readFilter: AnnouncementFilterType = AnnouncementFilterType.UNREAD;
    readFilterOptions: string[] = [AnnouncementFilterType.UNREAD, AnnouncementFilterType.READ];

    // Action vars
    deletingId: number | null = null;
    markingAsReadId: number | null = null;

    ngOnInit() {
        this.loadPage(1, this.rows); // assumes API is 1-based
    }

    onPage(event: any) {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? this.rows;

        const pageNumber = Math.floor(this.first / this.rows) + 1; // 1-based
        this.loadPage(pageNumber, this.rows);
    }

    applyFilters() {
        this.first = 0;
        this.loadPage(1, this.rows);
    }

    private loadPage(pageNumber: number, pageSize: number) {
        this.loading = true;

        const params: GetAnnouncementsQueryParams = {
            pageNumber,
            pageSize,
            includeDeleted: this.includeDeleted,
            isRead: this.readFilter === AnnouncementFilterType.READ
        };

        this.generatorOwnerService
            .getAnnouncements(params)
            .pipe(
                finalize(() => (this.loading = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res: GetAnnouncementsResponse) => {
                    const page = res?.page;
                    this.announcements = page?.items ?? [];
                    this.totalRecords = page?.totalCount ?? 0;
                },
                error: (err) => {
                    console.log(err);
                    this.announcements = [];
                    this.totalRecords = 0;
                }
            });
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

    dataViewItemClass(announcement: Announcement) {
        return { '!bg-red-100 dark:!bg-red-950': announcement.isDeleted };
    }

    deleteAnnouncement(announcement: Announcement) {
        this.deletingId = announcement.id;

        this.generatorOwnerService
            .deleteAnnouncement(announcement.id)
            .pipe(finalize(() => (this.deletingId = null)))
            .subscribe({
                next: () => {
                    if (this.includeDeleted) {
                        this.announcements[this.findIndexById(announcement.id)].isDeleted = true;
                        this.announcements[this.findIndexById(announcement.id)].deletedAt = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
                    } else {
                        this.announcements = this.announcements.filter((x) => x.id !== announcement.id);
                    }

                    this.notificationService.success('Successful', 'Announcement successfully deleted.');
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    markAnnouncementAsRead(announcement: Announcement) {
        this.markingAsReadId = announcement.id;

        this.generatorOwnerService
            .markAnnouncementAsRead({
                announcementId: announcement.id
            })
            .pipe(finalize(() => (this.markingAsReadId = null)))
            .subscribe({
                next: () => {
                    this.announcements = this.announcements.filter((x) => x.id !== announcement.id);
                    this.userContextService.loadAnnouncementsUnreadCount();
                    this.notificationService.success('Successful', 'Announcement marked as read');
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.announcements.length; i++) {
            if (this.announcements[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
}

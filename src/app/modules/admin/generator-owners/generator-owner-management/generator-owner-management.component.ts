import { Component, Inject, inject, Input, LOCALE_ID, OnInit, output } from '@angular/core';
import { AdminGeneratorOwnerProfile, Currency, CurrencyRate, Lookup } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { AdminService } from '@/core/services/admin.service';
import { GetCurrenciesResponse, GetLookupResponse, UpdateGeneratorOwnerResponse } from '@/core/services/api/response';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UpdateGeneratorOwnerRequest } from '@/core/services/api/request';
import { formatDate } from '@angular/common';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { LookupDomain } from '@/core/enums/enum';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { addLebanonPrefix, stripLebanonPrefix } from '@/core/utils/utils';

type CurrencyRateForm = FormGroup<{
    id: FormControl<number>;
    fromCurrencyCode: FormControl<string>;
    toCurrencyCode: FormControl<string>;
    date: FormControl<Date | null>;
    rate: FormControl<number | null>;
}>;

type GoForm = FormGroup<{
    id: FormControl<number>;
    username: FormControl<string>;
    password: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    businessName: FormControl<string>;
    phoneNumber: FormControl<string>;
    smsDisplayName: FormControl<string>;
    gracePeriodDays: FormControl<number | null>;

    currencyRates: FormArray<CurrencyRateForm>;

    fixedPlatformFeeMonthly: FormControl<number | null>;
    pricePerSubscriberMonthly: FormControl<number | null>;
    pricePerSms: FormControl<number | null>;

    isYearlyPayment: FormControl<boolean>;
    yearlyDiscountFixedFee: FormControl<number | null>;
    yearlyDiscountPerSubscriber: FormControl<number | null>;
    yearlyDiscountPerSms: FormControl<number | null>;

    freeTrialMonths: FormControl<number | null>;
    freeTrialEnabled: FormControl<boolean>;
    billingCycleDays: FormControl<number | null>;
    billingStartDate: FormControl<Date | null>;

    initialBalance: FormControl<number | null>;
    paymentMethod: FormControl<string>;
    overrideWalletCap: FormControl<number | null>;
    overrideCapReason: FormControl<string>;
    overrideCapSetAt: FormControl<string>;

    topUpReferenceNumber: FormControl<string>;
}>;

@Component({
    selector: 'app-generator-owner-management',
    imports: [ReactiveFormsModule, Message, InputText, InputNumber, DatePicker, Select, ButtonDirective, ToggleSwitch, InputGroup, InputGroupAddon, NgxMaskDirective],
    templateUrl: './generator-owner-management.component.html',
    styleUrl: './generator-owner-management.component.scss',
    providers: [provideNgxMask()]
})
export class GeneratorOwnerManagementComponent implements OnInit {
    private fb = inject(FormBuilder);
    private generatorOwnerService = inject(GeneratorOwnerService);
    private adminService = inject(AdminService);

    generatorOwnerProfile?: AdminGeneratorOwnerProfile;

    currencies: SelectOptionStrValue[] = [];
    isCurrenciesLoading = true;

    paymentMethods: SelectOptionStrValue[] = [];
    isPaymentMethodLoading = true;

    isSaving = false;

    constructor(@Inject(LOCALE_ID) private locale: string) {}

    form: GoForm = this.fb.nonNullable.group({
        id: this.fb.nonNullable.control(-1),

        username: this.fb.nonNullable.control('', [Validators.required]),
        password: this.fb.nonNullable.control(''), // validators set based on mode

        firstName: this.fb.nonNullable.control('', [Validators.required]),
        lastName: this.fb.nonNullable.control('', [Validators.required]),
        businessName: this.fb.nonNullable.control('', [Validators.required]),
        phoneNumber: this.fb.nonNullable.control('', [Validators.required]),
        smsDisplayName: this.fb.nonNullable.control('', [Validators.required]),
        gracePeriodDays: this.fb.control<number | null>(0, [Validators.min(0)]),

        currencyRates: this.fb.array<CurrencyRateForm>([]),

        fixedPlatformFeeMonthly: this.fb.control<number | null>(0, [Validators.min(0)]),
        pricePerSubscriberMonthly: this.fb.control<number | null>(0, [Validators.min(0)]),
        pricePerSms: this.fb.control<number | null>(0, [Validators.min(0)]),

        isYearlyPayment: this.fb.nonNullable.control(false),
        yearlyDiscountFixedFee: this.fb.control<number | null>(0, [Validators.min(0)]),
        yearlyDiscountPerSubscriber: this.fb.control<number | null>(0, [Validators.min(0)]),
        yearlyDiscountPerSms: this.fb.control<number | null>(0, [Validators.min(0)]),

        freeTrialMonths: this.fb.control<number | null>(0, [Validators.min(0)]),
        freeTrialEnabled: this.fb.nonNullable.control(false),
        billingCycleDays: this.fb.control<number | null>(0, [Validators.min(0)]),
        billingStartDate: this.fb.control<Date | null>(null),

        initialBalance: this.fb.control<number | null>(0),
        paymentMethod: this.fb.nonNullable.control(''),
        overrideWalletCap: this.fb.control<number | null>(0, [Validators.min(0)]),
        overrideCapReason: this.fb.nonNullable.control(''),
        overrideCapSetAt: this.fb.nonNullable.control<string>(''),
        topUpReferenceNumber: this.fb.nonNullable.control(''),
    });

    get isEditMode(): boolean {
        return !!this.generatorOwnerProfile && this.generatorOwnerProfile.id !== -1;
    }

    get currencyRatesArray(): FormArray<CurrencyRateForm> {
        return this.form.controls.currencyRates;
    }

    // Input setter: parent can pass undefined (create) or profile (edit)
    @Input({ alias: 'generatorOwnerProfile' })
    set _generatorOwnerProfile(value: AdminGeneratorOwnerProfile | undefined) {
        this.generatorOwnerProfile = value;

        // If form already exists (after init), patch immediately
        this.applyModeValidators();
        this.patchFormFromProfile();
    }

    savedGeneratorOwnerProfile = output<AdminGeneratorOwnerProfile | undefined>();

    ngOnInit(): void {
        this.loadCurrencies();
        this.loadPaymentMethods();
        this.applyModeValidators();
        this.patchFormFromProfile();

        // Optional: if yearly payment toggles, you may enable/disable discount fields
        this.form.controls.isYearlyPayment.valueChanges.subscribe((isYearly) => {
            const discountCtrls = [this.form.controls.yearlyDiscountFixedFee, this.form.controls.yearlyDiscountPerSubscriber, this.form.controls.yearlyDiscountPerSms];
            discountCtrls.forEach((c) => (isYearly ? c.enable() : c.disable()));
            if (!isYearly) discountCtrls.forEach((c) => c.setValue(0));
        });

        this.form.controls.freeTrialEnabled.valueChanges.subscribe((enabled) => {
            const ctrl = this.form.controls.freeTrialMonths;
            enabled ? ctrl.enable() : ctrl.disable();
            if (!enabled) ctrl.setValue(0);
        });
    }

    private loadCurrencies() {
        this.isCurrenciesLoading = true;
        this.generatorOwnerService
            .getCurrencies()
            .pipe(finalize(() => (this.isCurrenciesLoading = false)))
            .subscribe({
                next: (response: GetCurrenciesResponse) => {
                    this.currencies = response.currencies.map((cur: Currency) => ({
                        value: cur.code,
                        label: cur.code
                    }));
                },
                error: (err) => {
                    console.log(err);
                    this.currencies = [];
                }
            });
    }

    private loadPaymentMethods() {
        this.isPaymentMethodLoading = true;
        this.generatorOwnerService
            .getLookup({
                domain: LookupDomain.PAYMENT_METHOD
            })
            .pipe(finalize(() => (this.isPaymentMethodLoading = false)))
            .subscribe({
                next: (response: GetLookupResponse) => {
                    this.paymentMethods = response.items.map((method: Lookup) => ({
                        value: method.code,
                        label: method.description
                    }));
                },
                error: (err) => {
                    console.log(err);
                    this.paymentMethods = [];
                }
            });
    }

    private applyModeValidators() {
        // Password required only on create (adjust if needed)
        const passwordCtrl = this.form.controls.password;
        passwordCtrl.clearValidators();
        if (!this.isEditMode) {
            passwordCtrl.addValidators([Validators.required, Validators.minLength(6)]);
        }
        passwordCtrl.updateValueAndValidity({ emitEvent: false });
    }

    private patchFormFromProfile() {
        // Create mode
        if (!this.generatorOwnerProfile) {
            this.form.reset({
                id: -1
            });

            this.currencyRatesArray.clear();
            // Optional: start with one empty currency rate row
            // this.addCurrencyRate();
            return;
        }

        // Edit mode
        const p = this.generatorOwnerProfile;

        this.form.patchValue({
            id: p.id,
            username: p.username ?? '',
            password: '', // don't auto-fill password
            firstName: p.firstName ?? '',
            lastName: p.lastName ?? '',
            businessName: p.businessName ?? '',
            phoneNumber: stripLebanonPrefix(p.phoneNumber) ?? '',
            smsDisplayName: p.smsDisplayName ?? '',
            gracePeriodDays: p.gracePeriodDays ?? 0,

            fixedPlatformFeeMonthly: p.fixedPlatformFeeMonthly ?? 0,
            pricePerSubscriberMonthly: p.pricePerSubscriberMonthly ?? 0,
            pricePerSms: p.pricePerSms ?? 0,

            isYearlyPayment: p.isYearlyPayment,
            yearlyDiscountFixedFee: p.yearlyDiscountFixedFee ?? 0,
            yearlyDiscountPerSubscriber: p.yearlyDiscountPerSubscriber ?? 0,
            yearlyDiscountPerSms: p.yearlyDiscountPerSms ?? 0,

            freeTrialMonths: p.freeTrialMonths ?? 0,
            freeTrialEnabled: p.freeTrialEnabled,
            billingCycleDays: p.billingCycleDays ?? 0,
            billingStartDate: p.billingStartDate ? new Date(p.billingStartDate) : null,

            initialBalance: p.initialBalance ?? 0,
            paymentMethod: p.paymentMethod ?? '',
            overrideWalletCap: p.overrideWalletCap ?? 0,
            overrideCapReason: p.overrideCapReason ?? '',
            overrideCapSetAt: p.overrideCapSetAt ?? '',
            topUpReferenceNumber: p.topUpReferenceNumber ?? ''
        });

        // Patch currency rates
        this.currencyRatesArray.clear();
        (p.currencyRates ?? []).forEach((cr) => this.currencyRatesArray.push(this.createCurrencyRateGroup(cr)));
    }

    private createCurrencyRateGroup(cr?: Partial<CurrencyRate>): CurrencyRateForm {
        return this.fb.nonNullable.group({
            id: this.fb.nonNullable.control(cr?.id ?? 0),
            fromCurrencyCode: this.fb.nonNullable.control(cr?.fromCurrencyCode ?? '', [Validators.required]),
            toCurrencyCode: this.fb.nonNullable.control(cr?.toCurrencyCode ?? '', [Validators.required]),
            date: this.fb.control<Date | null>(cr?.date ? new Date(cr.date as any) : null, [Validators.required]),
            rate: this.fb.control<number | null>(cr?.rate ?? null, [Validators.required, Validators.min(0)])
        });
    }

    addCurrencyRate() {
        this.currencyRatesArray.push(this.createCurrencyRateGroup());
    }

    removeCurrencyRate(index: number) {
        this.currencyRatesArray.removeAt(index);
    }

    isInvalid(controlName: keyof GoForm['controls']): boolean {
        const c = this.form.controls[controlName];
        return c.invalid && (c.dirty || c.touched);
    }

    isCurrencyRateInvalid(group: CurrencyRateForm, name: keyof CurrencyRateForm['controls']): boolean {
        const c = group.controls[name];
        return c.invalid && (c.dirty || c.touched);
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const raw = this.form.getRawValue();

        const request: UpdateGeneratorOwnerRequest = {
            id: this.isEditMode ? raw.id : -1,
            username: raw.username,
            password: raw.password, // required on create; optional on edit (depends on backend)
            firstName: raw.firstName,
            lastName: raw.lastName,
            businessName: raw.businessName,
            phoneNumber: addLebanonPrefix(raw.phoneNumber),
            smsDisplayName: raw.smsDisplayName,
            gracePeriodDays: raw.gracePeriodDays ?? 0,

            currencyRates: raw.currencyRates.map((cr) => ({
                id: cr.id,
                fromCurrencyCode: cr.fromCurrencyCode,
                toCurrencyCode: cr.toCurrencyCode,
                date: cr.date ? cr.date.toISOString() : new Date().toISOString(),
                rate: cr.rate ?? 0
            })) as any,

            fixedPlatformFeeMonthly: raw.fixedPlatformFeeMonthly ?? 0,
            pricePerSubscriberMonthly: raw.pricePerSubscriberMonthly ?? 0,
            pricePerSms: raw.pricePerSms ?? 0,
            isYearlyPayment: raw.isYearlyPayment,
            yearlyDiscountFixedFee: raw.yearlyDiscountFixedFee ?? 0,
            yearlyDiscountPerSubscriber: raw.yearlyDiscountPerSubscriber ?? 0,
            yearlyDiscountPerSms: raw.yearlyDiscountPerSms ?? 0,
            freeTrialMonths: raw.freeTrialMonths ?? 0,
            freeTrialEnabled: raw.freeTrialEnabled,
            billingCycleDays: raw.billingCycleDays ?? 0,
            billingStartDate: raw.billingStartDate ? formatDate(raw.billingStartDate, 'yyyy-MM-dd', this.locale) : formatDate(new Date(), 'yyyy-MM-dd', this.locale),
            initialBalance: raw.initialBalance ?? 0,
            paymentMethod: raw.paymentMethod,
            overrideWalletCap: raw.overrideWalletCap ?? 0,
            overrideCapReason: raw.overrideCapReason,
            overrideCapSetAt: raw.overrideCapSetAt,
            topUpReferenceNumber: raw.topUpReferenceNumber
        };

        this.isSaving = true;
        this.adminService
            .updateGeneratorOwner(request)
            .pipe(finalize(() => (this.isSaving = false)))
            .subscribe({
                next: (res: UpdateGeneratorOwnerResponse) => {
                    // Update local model with returned owner (edit mode) OR newly created owner
                    this.generatorOwnerProfile = res.owner;
                    this.applyModeValidators();
                    this.patchFormFromProfile();

                    this.savedGeneratorOwnerProfile.emit(res.owner);
                },
                error: (err) => {
                    console.log(err);
                    this.savedGeneratorOwnerProfile.emit(undefined);
                }
            });
    }
}

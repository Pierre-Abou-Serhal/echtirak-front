import { Component, Inject, inject, Input, LOCALE_ID, OnInit, output } from '@angular/core';
import { AdminGeneratorOwnerProfile, Currency, CurrencyRate, Lookup } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { AdminService } from '@/core/services/admin.service';
import { GetCurrenciesResponse, GetLookupResponse, UpdateGeneratorOwnerResponse } from '@/core/services/api/response';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
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
import { UpdateGeneratorOwnerRequest } from '@/core/services/api/request';

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
    password: FormControl<string | null>;

    firstName: FormControl<string>;
    lastName: FormControl<string>;
    businessName: FormControl<string>;
    phoneNumber: FormControl<string>;

    // Optional -> nullable
    smsDisplayName: FormControl<string | null>;
    gracePeriodDays: FormControl<number | null>;

    currencyRates: FormArray<CurrencyRateForm>;

    // Optional -> nullable
    fixedPlatformFeeMonthly: FormControl<number | null>;

    // Required in API, but you can still keep them nullable in the form and validate in create mode
    pricePerSubscriberMonthly: FormControl<number | null>;
    pricePerSms: FormControl<number | null>;

    isYearlyPayment: FormControl<boolean>;

    // Optional -> nullable
    yearlyDiscountFixedFee: FormControl<number | null>;
    yearlyDiscountPerSubscriber: FormControl<number | null>;
    yearlyDiscountPerSms: FormControl<number | null>;

    freeTrialMonths: FormControl<number>;
    freeTrialEnabled: FormControl<boolean>;

    billingCycleDays: FormControl<number>;
    billingStartDate: FormControl<Date | null>;

    // Wallet (create-only UI)  optional -> nullable
    initialBalance: FormControl<number | null>;
    paymentMethod: FormControl<string | null>;
    overrideWalletCap: FormControl<number | null>;
    overrideCapReason: FormControl<string | null>;
    topUpReferenceNumber: FormControl<string | null>;
}>;


export const yearlyDiscountRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const isYearly = control.get('isYearlyPayment')?.value === true;
    if (!isYearly) return null;

    const fixed = Number(control.get('yearlyDiscountFixedFee')?.value ?? 0);
    const perSub = Number(control.get('yearlyDiscountPerSubscriber')?.value ?? 0);
    const perSms = Number(control.get('yearlyDiscountPerSms')?.value ?? 0);

    const hasAnyDiscount = fixed > 0 || perSub > 0 || perSms > 0;
    return hasAnyDiscount ? null : { yearlyDiscountRequired: true };
};

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

    // ✅ Optional fields start null (not 0 / '')
    form: GoForm = this.fb.group(
        {
            id: this.fb.nonNullable.control(-1),

            username: this.fb.nonNullable.control('', [Validators.required]),
            password: this.fb.control<string | null>(null),

            firstName: this.fb.nonNullable.control('', [Validators.required]),
            lastName: this.fb.nonNullable.control('', [Validators.required]),
            businessName: this.fb.nonNullable.control('', [Validators.required]),
            phoneNumber: this.fb.nonNullable.control('', [Validators.required]),

            smsDisplayName: this.fb.control<string | null>(null),
            gracePeriodDays: this.fb.control<number | null>(null, [Validators.min(0)]),

            currencyRates: this.fb.array<CurrencyRateForm>([]),

            fixedPlatformFeeMonthly: this.fb.control<number | null>(null, [Validators.min(0)]),

            pricePerSubscriberMonthly: this.fb.control<number | null>(null, [Validators.min(0)]),
            pricePerSms: this.fb.control<number | null>(null, [Validators.min(0)]),

            isYearlyPayment: this.fb.nonNullable.control(false),
            yearlyDiscountFixedFee: this.fb.control<number | null>(null, [Validators.min(0)]),
            yearlyDiscountPerSubscriber: this.fb.control<number | null>(null, [Validators.min(0)]),
            yearlyDiscountPerSms: this.fb.control<number | null>(null, [Validators.min(0)]),

            freeTrialMonths: this.fb.nonNullable.control(0, [Validators.min(0)]),
            freeTrialEnabled: this.fb.nonNullable.control(false),

            billingCycleDays: this.fb.nonNullable.control(30, [Validators.min(0)]),
            billingStartDate: this.fb.control<Date | null>(null),

            initialBalance: this.fb.control<number | null>(null, [Validators.min(0)]),
            paymentMethod: this.fb.control<string | null>(null),
            overrideWalletCap: this.fb.control<number | null>(null, [Validators.min(0)]),
            overrideCapReason: this.fb.control<string | null>(null),
            topUpReferenceNumber: this.fb.control<string | null>(null)
        },
        { validators: [yearlyDiscountRequiredValidator] }
    ) as GoForm;

    get isEditMode(): boolean {
        return !!this.generatorOwnerProfile && this.generatorOwnerProfile.id !== -1;
    }

    get currencyRatesArray(): FormArray<CurrencyRateForm> {
        return this.form.controls.currencyRates;
    }

    @Input({ alias: 'generatorOwnerProfile' })
    set _generatorOwnerProfile(value: AdminGeneratorOwnerProfile | undefined) {
        this.generatorOwnerProfile = value;
        this.applyModeValidators();
        this.patchFormFromProfile();
    }

    savedGeneratorOwnerProfile = output<AdminGeneratorOwnerProfile | undefined>();

    ngOnInit(): void {
        this.loadCurrencies();
        this.loadPaymentMethods();
        this.applyModeValidators();
        this.patchFormFromProfile();

        // Yearly payment toggles: enable/disable discount fields (null when disabled)
        this.form.controls.isYearlyPayment.valueChanges.subscribe((isYearly) => {
            const discountCtrls = [this.form.controls.yearlyDiscountFixedFee, this.form.controls.yearlyDiscountPerSubscriber, this.form.controls.yearlyDiscountPerSms];

            discountCtrls.forEach((c) => (isYearly ? c.enable({ emitEvent: false }) : c.disable({ emitEvent: false })));
            if (!isYearly) discountCtrls.forEach((c) => c.setValue(null, { emitEvent: false }));

            this.form.updateValueAndValidity({ emitEvent: false });
        });

        this.form.controls.yearlyDiscountFixedFee.valueChanges.subscribe(() => this.form.updateValueAndValidity({ emitEvent: false }));
        this.form.controls.yearlyDiscountPerSubscriber.valueChanges.subscribe(() => this.form.updateValueAndValidity({ emitEvent: false }));
        this.form.controls.yearlyDiscountPerSms.valueChanges.subscribe(() => this.form.updateValueAndValidity({ emitEvent: false }));

        // Free trial toggles: enable/disable months
        this.form.controls.freeTrialEnabled.valueChanges.subscribe((enabled) => {
            const ctrl = this.form.controls.freeTrialMonths;
            enabled ? ctrl.enable({ emitEvent: false }) : ctrl.disable({ emitEvent: false });
            if (!enabled) ctrl.setValue(0, { emitEvent: false });
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
            .getLookup({ domain: LookupDomain.PAYMENT_METHOD })
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
        const isCreate = !this.isEditMode;

        // Password required only on create
        const passwordCtrl = this.form.controls.password;
        passwordCtrl.clearValidators();
        if (isCreate) {
            passwordCtrl.addValidators([Validators.required, Validators.minLength(6)]);
        }
        passwordCtrl.updateValueAndValidity({ emitEvent: false });

        // Pricing required only on create and must be > 0
        const pps = this.form.controls.pricePerSubscriberMonthly;
        const pSms = this.form.controls.pricePerSms;

        pps.clearValidators();
        pSms.clearValidators();

        if (isCreate) {
            // required + > 0
            pps.addValidators([Validators.required, Validators.min(0.0001)]);
            pSms.addValidators([Validators.required, Validators.min(0.0001)]);
        } else {
            // optional but still prevent negative if user enters value
            pps.addValidators([Validators.min(0)]);
            pSms.addValidators([Validators.min(0)]);
        }

        pps.updateValueAndValidity({ emitEvent: false });
        pSms.updateValueAndValidity({ emitEvent: false });

        // Wallet enabled only on create
        this.setWalletControlsEnabled(isCreate);
    }

    private patchFormFromProfile() {
        // Create mode
        if (!this.generatorOwnerProfile) {
            this.form.reset({
                id: -1,

                username: '',
                password: null,

                firstName: '',
                lastName: '',
                businessName: '',
                phoneNumber: '',

                smsDisplayName: null,
                gracePeriodDays: null,

                fixedPlatformFeeMonthly: null,
                pricePerSubscriberMonthly: null,
                pricePerSms: null,

                isYearlyPayment: false,
                yearlyDiscountFixedFee: null,
                yearlyDiscountPerSubscriber: null,
                yearlyDiscountPerSms: null,

                freeTrialMonths: 0,
                freeTrialEnabled: false,

                billingCycleDays: 30,
                billingStartDate: null,

                initialBalance: null,
                paymentMethod: null,
                overrideWalletCap: null,
                overrideCapReason: null,
                topUpReferenceNumber: null
            });

            this.currencyRatesArray.clear();
            return;
        }

        // Edit mode
        const p = this.generatorOwnerProfile;

        this.form.patchValue({
            id: p.id,
            username: p.username ?? '',
            password: null,

            firstName: p.firstName ?? '',
            lastName: p.lastName ?? '',
            businessName: p.businessName ?? '',
            phoneNumber: stripLebanonPrefix(p.phoneNumber) ?? '',

            smsDisplayName: p.smsDisplayName ?? null,
            gracePeriodDays: p.gracePeriodDays ?? null,

            fixedPlatformFeeMonthly: p.fixedPlatformFeeMonthly ?? null,
            pricePerSubscriberMonthly: p.pricePerSubscriberMonthly ?? null,
            pricePerSms: p.pricePerSms ?? null,

            isYearlyPayment: p.isYearlyPayment,
            yearlyDiscountFixedFee: p.yearlyDiscountFixedFee ?? null,
            yearlyDiscountPerSubscriber: p.yearlyDiscountPerSubscriber ?? null,
            yearlyDiscountPerSms: p.yearlyDiscountPerSms ?? null,

            freeTrialMonths: p.freeTrialMonths ?? 0,
            freeTrialEnabled: p.freeTrialEnabled,

            billingCycleDays: p.billingCycleDays ?? 30,
            billingStartDate: p.billingStartDate ? new Date(p.billingStartDate) : null,

            // Wallet values don't matter in edit (hidden + disabled), but keep them consistent:
            initialBalance: p.initialBalance ?? null,
            paymentMethod: p.paymentMethod ?? null,
            overrideWalletCap: p.overrideWalletCap ?? null,
            overrideCapReason: p.overrideCapReason ?? null,
            topUpReferenceNumber: p.topUpReferenceNumber ?? null
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
            date: this.fb.control<Date | null>(cr?.date ? new Date(cr.date) : null, [Validators.required]),
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
        const isCreate = !this.isEditMode;

        const request: UpdateGeneratorOwnerRequest = {
            id: isCreate ? -1 : raw.id,

            username: raw.username.trim(),
            password: isCreate ? raw.password : raw.password?.trim() ? raw.password : null,

            firstName: raw.firstName.trim(),
            lastName: raw.lastName.trim(),
            businessName: raw.businessName.trim(),
            phoneNumber: addLebanonPrefix(raw.phoneNumber),

            smsDisplayName: raw.smsDisplayName?.trim() || null,
            gracePeriodDays: raw.gracePeriodDays ?? null,

            currencyRates: raw.currencyRates.length
                ? raw.currencyRates.map((cr) => ({
                      id: cr.id,
                      fromCurrencyCode: cr.fromCurrencyCode,
                      toCurrencyCode: cr.toCurrencyCode,
                      date: cr.date ? formatDate(cr.date, 'yyyy-MM-dd', this.locale) : formatDate(new Date(), 'yyyy-MM-dd', this.locale),
                      rate: cr.rate ?? 0
                  }))
                : null,

            fixedPlatformFeeMonthly: raw.fixedPlatformFeeMonthly ?? null,
            pricePerSubscriberMonthly: raw.pricePerSubscriberMonthly ?? 0,
            pricePerSms: raw.pricePerSms ?? 0,

            isYearlyPayment: raw.isYearlyPayment,
            yearlyDiscountFixedFee: raw.isYearlyPayment ? raw.yearlyDiscountFixedFee : null,
            yearlyDiscountPerSubscriber: raw.isYearlyPayment ? raw.yearlyDiscountPerSubscriber : null,
            yearlyDiscountPerSms: raw.isYearlyPayment ? raw.yearlyDiscountPerSms : null,

            freeTrialMonths: raw.freeTrialEnabled ? raw.freeTrialMonths : 0,
            freeTrialEnabled: raw.freeTrialEnabled,

            billingCycleDays: raw.billingCycleDays,
            billingStartDate: raw.billingStartDate ? formatDate(raw.billingStartDate, 'yyyy-MM-dd', this.locale) : null,

            ...(isCreate
                ? {
                      initialBalance: raw.initialBalance ?? null,
                      paymentMethod: raw.paymentMethod ?? null,
                      overrideWalletCap: raw.overrideWalletCap ?? null,
                      overrideCapReason: raw.overrideCapReason?.trim() || null,
                      topUpReferenceNumber: raw.topUpReferenceNumber?.trim() || null
                  }
                : {})
        };

        this.isSaving = true;
        this.adminService
            .updateGeneratorOwner(request)
            .pipe(finalize(() => (this.isSaving = false)))
            .subscribe({
                next: (res: UpdateGeneratorOwnerResponse) => {
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

    private setWalletControlsEnabled(enabled: boolean) {
        const ctrls = [this.form.controls.initialBalance, this.form.controls.paymentMethod, this.form.controls.overrideWalletCap, this.form.controls.overrideCapReason, this.form.controls.topUpReferenceNumber];

        ctrls.forEach((c) => (enabled ? c.enable({ emitEvent: false }) : c.disable({ emitEvent: false })));

        // optional: when disabling (edit mode), clear values to keep raw clean
        if (!enabled) {
            this.form.controls.initialBalance.setValue(null, { emitEvent: false });
            this.form.controls.paymentMethod.setValue(null, { emitEvent: false });
            this.form.controls.overrideWalletCap.setValue(null, { emitEvent: false });
            this.form.controls.overrideCapReason.setValue(null, { emitEvent: false });
            this.form.controls.topUpReferenceNumber.setValue(null, { emitEvent: false });
        }
    }
}

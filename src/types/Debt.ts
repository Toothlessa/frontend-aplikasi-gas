export interface DebtState {
    debts: Debt[];
    summaryDebts: SummaryDebt[];
    outstandingDebts: SummaryDebt[];

    headerDetailDebt: HeaderDetailDebt[];
    headerSummaryDebt: HeaderSummaryDebt[];
    headerOutstandingDebt: HeaderSummaryDebt[];

    loading: boolean;
    loadingOne: boolean;
    loadingButtonCreate: boolean;
    loadingButtonUpdate: boolean;
    hasSaved: boolean;
}

export interface Debt {
    id: number,
    customer_id: number | null,
    customer_name: string,
    description: string,
    amount_pay: number,
    total: number,
}

export interface SummaryDebt {
    customer_id: number | null,
    customer_name: string,
    total_debt: number,
    total_pay: number,
    debt_left: number,
}

export interface HeaderDetailDebt {
    key: string;
    title: string;
    align?: 'start' | 'center' | 'end';
    sortable?: boolean;
}

export interface HeaderSummaryDebt {
    key: string;
    title: string;
    align?: 'start' | 'center' | 'end';
    sortable?: boolean;
}

export const headerSummaryDebt: HeaderSummaryDebt[] = [
    { key: "customer_name", title: "Customer Name", align: "start" },
    { key: "total_debt", title: "Total Debt", align: "center" },
    { key: "total_pay", title: "Total Pay", align: "center" },
    { key: "debt_left", title: "Debt Left", align: "center" },
    { key: "actions", title: "Details", align: "center", sortable: false },
];

export const headerDetailDebt: HeaderDetailDebt[] = [
    { key: "customer_name", title: "Customer Name" },
    { key: "description", title: "Description" },
    { key: "amount_pay", title: "Paid Amount", align: "end" },
    { key: "total", title: "Total Debt", align: "end" },
    { key: "created_at", title: "Created Date" },
    { key: "actions", title: "Actions", sortable: false },
];

export const headerOutstandingDebt = headerSummaryDebt.filter((h) =>
    [
        "customer_name", "total_debt", "total_pay", "debt_left"
    ].includes(h.key)
);
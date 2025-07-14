import { IncomeSettlementStatementForm } from "@/components/forms/income-settlement-statement-form";

export default function IncomeSettlementStatementPage() {
    return (
        <div className="container mx-auto py-8 printable-content">
            <IncomeSettlementStatementForm />
        </div>
    );
}

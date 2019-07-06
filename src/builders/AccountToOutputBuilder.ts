import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { AccountToOutputPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class AccountToOutputBuilder extends Transactions.TransactionBuilder<AccountToOutputBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.AccountToOutput as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: AccountToOutputPayload): AccountToOutputBuilder {
        this.data.asset = {
            payload,
        };
        return this;
    }

    public getStruct(): Interfaces.ITransactionData {
        const struct: Interfaces.ITransactionData = super.getStruct();
        struct.amount = this.data.amount;
        struct.asset = this.data.asset;
        return struct;
    }

    protected instance(): AccountToOutputBuilder {
        return this;
    }
}

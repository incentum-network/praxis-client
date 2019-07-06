import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { ContractSearchPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class ContractSearchBuilder extends Transactions.TransactionBuilder<ContractSearchBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.ContractSearch as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: ContractSearchPayload): ContractSearchBuilder {
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

    protected instance(): ContractSearchBuilder {
        return this;
    }
}

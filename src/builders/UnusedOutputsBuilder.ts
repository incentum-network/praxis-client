import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { GetUnusedOutputsPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class UnusedOutputsBuilder extends Transactions.TransactionBuilder<UnusedOutputsBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.UnusedOutputs as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: GetUnusedOutputsPayload): UnusedOutputsBuilder {
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

    protected instance(): UnusedOutputsBuilder {
        return this;
    }
}

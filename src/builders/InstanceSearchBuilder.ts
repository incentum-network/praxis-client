import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { InstanceSearchPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class InstanceSearchBuilder extends Transactions.TransactionBuilder<InstanceSearchBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.InstanceSearch as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: InstanceSearchPayload): InstanceSearchBuilder {
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

    protected instance(): InstanceSearchBuilder {
        return this;
    }
}

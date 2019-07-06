import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { KeyValuePayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class KeyValueBuilder extends Transactions.TransactionBuilder<KeyValueBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.KeyValue as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: KeyValuePayload): KeyValueBuilder {
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

    protected instance(): KeyValueBuilder {
        return this;
    }
}

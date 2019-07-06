import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { OutputToAccountPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class OutputToAccountBuilder extends Transactions.TransactionBuilder<OutputToAccountBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.OutputToAccount as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: OutputToAccountPayload): OutputToAccountBuilder {
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

    protected instance(): OutputToAccountBuilder {
        return this;
    }
}

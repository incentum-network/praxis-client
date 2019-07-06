import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { CoinToOutputPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class CoinToOutputBuilder extends Transactions.TransactionBuilder<CoinToOutputBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.CoinToOutput as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: CoinToOutputPayload): CoinToOutputBuilder {
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

    protected instance(): CoinToOutputBuilder {
        return this;
    }
}

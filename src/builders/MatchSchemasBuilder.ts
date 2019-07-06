import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { MatchSchemasPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class MatchSchemasBuilder extends Transactions.TransactionBuilder<MatchSchemasBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.MatchSchemas as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: MatchSchemasPayload): MatchSchemasBuilder {
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

    protected instance(): MatchSchemasBuilder {
        return this;
    }
}

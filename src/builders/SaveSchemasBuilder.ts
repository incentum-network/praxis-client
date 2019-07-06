import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { SaveSchemasPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class SaveSchemasBuilder extends Transactions.TransactionBuilder<SaveSchemasBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.SaveSchemas as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: SaveSchemasPayload): SaveSchemasBuilder {
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

    protected instance(): SaveSchemasBuilder {
        return this;
    }
}

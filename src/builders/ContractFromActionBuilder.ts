import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { GetContractFromActionPayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class ContractFromActionBuilder extends Transactions.TransactionBuilder<ContractFromActionBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.ContractFromAction as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: GetContractFromActionPayload): ContractFromActionBuilder {
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

    protected instance(): ContractFromActionBuilder {
        return this;
    }
}

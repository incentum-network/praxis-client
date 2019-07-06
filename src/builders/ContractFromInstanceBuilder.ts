import { Interfaces, Transactions, Utils } from "@incentum/crypto";
import { GetContractFromInstancePayload } from "@incentum/praxis-interfaces";
import { TransactionTypes } from "../enums";

export class ContractFromInstanceBuilder extends Transactions.TransactionBuilder<ContractFromInstanceBuilder> {
    constructor(fee: Utils.BigNumber) {
        super();
        this.data.type = TransactionTypes.ContractFromInstance as number;
        this.data.fee = fee;
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = {};
    }

    public payload(payload: GetContractFromInstancePayload): ContractFromInstanceBuilder {
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

    protected instance(): ContractFromInstanceBuilder {
        return this;
    }
}

import {
  ContractResult,
  OutputJson,
  SchemasJson,
  TemplateJson,
} from '@incentum/praxis-interfaces'

export interface ITransactionResult {
  id: string;
  status: number;
  messages: string[];
  result?: any
}

export interface IPraxisWallet {
  outputs: OutputJson[];
  instances: ContractResult[];
  messages: string[];
  schemas: SchemasJson[];
  templateSearch: IWalletTemplate[];
  instanceSearch: ContractResult[];
  lastTransactions: ITransactionResult[];
  username: string;
  balance: string;
}

export interface IWalletTemplate {
  template: TemplateJson;
  hash: string;
}

export interface ILedger {
  ledger: string
  mnemonic: string
}

/*
 * Licensed to Incentum Ltd. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Incentum Ltd. licenses this file to you under
 * the Token Use License Version 1.0 and the Token Use
 * Clause (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of
 * the License at
 *
 *  https://github.com/incentum-network/tul/blob/master/LICENSE.md
 *  https://github.com/incentum-network/tul/blob/master/TUC.md
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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

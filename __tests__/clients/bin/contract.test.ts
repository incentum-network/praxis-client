import { Identities, Managers } from "@incentum/crypto";
import {
    ActionJson,
    ContractStartPayload,
    createStartActionJson,
    hashJson,
    MatchSchemasPayload,
    ReducerJson,
    SaveSchemasPayload,
    TemplateJson,
    toTemplateJson,
    uniqueKey,
} from "@incentum/praxis-interfaces";
import { txContractStart, txMatchSchemas, txSaveSchemas, txSaveTemplate } from '../../../dist'

import { testnetSecrets } from "./secrets";

beforeAll(async () => {
    return;
});

afterAll(async () => {
    return;
});

const code = `
(
    $x.result($state, [])
)
`;

const startReducer: ReducerJson = {
    code,
    type: "start",
    language: "jsonata",
};

const getTemplate = (ledger: string): TemplateJson => {
    return {
        ledger,
        name: "test-delete",
        versionMajor: 1,
        versionMinor: 0,
        versionPatch: 3,
        description: "test description",
        other: {},
        tags: [],
        reducers: [startReducer],
    };
};

const jsonSchema = {
    "title": "A list of tasks",
    "type": "object",
    "required": [
        "title"
    ],
    "properties": {
        "title": {
            "type": "string",
            "title": "Task list title"
        },
    }
}

const uiSchema = {}
const markdown = '# markdown 6'

const getSchemas = (template: TemplateJson): SaveSchemasPayload => {
    return {
        schemas: {
            reducer: 'start',
            ledger: template.ledger,
            versionMajor: 1,
            versionMinor: 0,
            versionPatch: 6,
            uiSchema: JSON.stringify(uiSchema),
            jsonSchema: JSON.stringify(jsonSchema),
            markdown,
            templateHash: hashJson(toTemplateJson(template))
        }
    };
};

describe("Praxis Client Transactions", () => {
    it("saveTemplate Transaction", async () => {
        Managers.configManager.setFromPreset("testnet");
        const secret = testnetSecrets[0];
        const ledger: string = Identities.Address.fromPassphrase(secret);
        const publicKey = Identities.PublicKey.fromPassphrase(secret);
        console.log('ledger', ledger);
        console.log('secret', secret);
        console.log('publicKey', publicKey);

        try {
            const template = getTemplate(ledger);
            const result = await txSaveTemplate(template, { ledger, mnemonic: secret})
            console.log("saveTemplate", result.praxis.messages);
            await 
        } catch (error) {
            console.error("error", error);
        }
    }, 30000);
    /*
   it("saveSchemas Transaction", async () => {
        Managers.configManager.setFromPreset("testnet");
        const secret = testnetSecrets[0];
        const ledger: string = Identities.Address.fromPassphrase(secret);
        const publicKey = Identities.PublicKey.fromPassphrase(secret);
        console.log('ledger', ledger);
        console.log('secret', secret);
        console.log('publicKey', publicKey);

        try {
            const schemas = getSchemas(getTemplate(ledger));
            const result = await txSaveSchemas(schemas, { ledger, mnemonic: secret})
            console.log("saveSchemas", result.praxis.messages);
        } catch (error) {
            console.error("error", error);
        }
    }, 30000);
    it("matchSchemas Transaction", async () => {
        Managers.configManager.setFromPreset("testnet");
        const secret = testnetSecrets[0];
        const ledger: string = Identities.Address.fromPassphrase(secret);
        const publicKey = Identities.PublicKey.fromPassphrase(secret);
        console.log('ledger', ledger);
        console.log('secret', secret);
        console.log('publicKey', publicKey);

        try {
            const schemas: MatchSchemasPayload = {
                reducer: 'start',
                templateName: 'test',
                templateLedger: ledger,
                templateVersionMajor: 1,
            };
            const result = await txMatchSchemas(schemas, { ledger, mnemonic: secret})
            console.log("matchSchemas", result.praxis.messages);
        } catch (error) {
            console.error("error", error);
        }
    }, 30000);
    */
    it("startContract Transaction", async () => {
        Managers.configManager.setFromPreset("testnet");
        const secret = testnetSecrets[0];
        const ledger: string = Identities.Address.fromPassphrase(secret);
        const template = getTemplate(ledger);

        const action: ActionJson = createStartActionJson(ledger, template);
        action.form.title = 'Test Contract'
        action.form.subtitle = 'Test Contract'
        const payload: ContractStartPayload = {
            key: uniqueKey(),
            action,
            initialState: {},
        };

        try {
            const result = await txContractStart(payload, { ledger, mnemonic: secret})
            console.log(result.praxis.messages)
        } catch (error) {
            console.error("error", error);
        }
    }, 30000);
    /*
    */
});

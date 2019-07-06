import { Interfaces } from "@incentum/crypto";
import { ActionJson, InputJson, toActionJson } from "@incentum/praxis-interfaces";

export class ActionBuilder {
  constructor(private action: ActionJson) {
  }

  public addInput(input: InputJson, keyPair: Interfaces.IKeyPair): ActionBuilder {
    return this;
  }

  public getAction(): ActionJson {
    return toActionJson(this.action)
  }

  protected instance(): ActionBuilder {
    return this;
  }

}

import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { PayEvent } from "../generated/Payment/Payment"

export function createPayEventEvent(
  from: Address,
  to: Address,
  amount: BigInt,
  items: Array<Bytes>
): PayEvent {
  let payEventEvent = changetype<PayEvent>(newMockEvent())

  payEventEvent.parameters = new Array()

  payEventEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  payEventEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  payEventEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  payEventEvent.parameters.push(
    new ethereum.EventParam("items", ethereum.Value.fromFixedBytesArray(items))
  )

  return payEventEvent
}

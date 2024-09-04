import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { DepositEvent, WithdrawalEvent } from "../generated/Contract/Contract"

export function createDepositEventEvent(
  user: Address,
  amount: BigInt
): DepositEvent {
  let depositEventEvent = changetype<DepositEvent>(newMockEvent())

  depositEventEvent.parameters = new Array()

  depositEventEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  depositEventEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return depositEventEvent
}

export function createWithdrawalEventEvent(
  user: Address,
  amount: BigInt
): WithdrawalEvent {
  let withdrawalEventEvent = changetype<WithdrawalEvent>(newMockEvent())

  withdrawalEventEvent.parameters = new Array()

  withdrawalEventEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawalEventEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawalEventEvent
}

import {
  DepositEvent as DepositEventEvent,
  WithdrawalEvent as WithdrawalEventEvent
} from "../generated/Deposit/Deposit"
import { DepositEvent, WithdrawalEvent } from "../generated/schema"

export function handleDepositEvent(event: DepositEventEvent): void {
  let entity = new DepositEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawalEvent(event: WithdrawalEventEvent): void {
  let entity = new WithdrawalEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

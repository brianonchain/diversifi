import { PayEvent as PayEventEvent } from "../generated/Payment/Payment"
import { PayEvent } from "../generated/schema"

export function handlePayEvent(event: PayEventEvent): void {
  let entity = new PayEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.items = event.params.items

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

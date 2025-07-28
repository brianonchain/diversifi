import { Fragment } from "react";
import { catalog, currencyIdToCurrencyInfo } from "@/utils/constants";
import { idToSku } from "@/utils/functions";

export default function Details({ cartItem, setDetailsModal }: { cartItem: any; setDetailsModal: any }) {
  const expandedItems = [];
  for (const item of cartItem.items) {
    if (item.quantity > 1) {
      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push(item);
      }
    } else {
      expandedItems.push(item);
    }
  }

  function getItemNameById(id: string): string | undefined {
    const item = catalog.find((item) => item.id === Number(id));
    return item?.name;
  }

  return (
    <>
      <div className="fullModal">
        {/*--- close ---*/}
        <div className="xButtonContainer" onClick={() => setDetailsModal(null)}>
          <div className="xButton">&#10005;</div>
        </div>
        {/*--- HEADER ---*/}
        <div className="modalHeader">Details</div>
        {/*--- CONTENT ---*/}
        <div className="fullModalContentContainer scrollbar settingsFont pb-[16px]">
          <div className="fullModalContentContainer2">
            <div className="p-4 grid grid-cols-3 gap-2">
              {/*--- grid headers ---*/}
              <div className="font-bold text-slate-500">Item</div>
              <div className="font-bold text-slate-500">Currency Value</div>
              <div className="font-bold text-slate-500">USDC Received</div>
              {expandedItems.map((item: any, index: number) => (
                <Fragment key={index}>
                  <div className="py-2">
                    <p>{getItemNameById(item.id)}</p>
                    <p className="text-xs text-slate-500">{idToSku(item.id)}</p>
                  </div>
                  <div className="py-2">
                    {currencyIdToCurrencyInfo[item.currencyId].symbol} {item.currencyPrice}
                  </div>
                  <div className="py-2">$ {item.usdcReceived}</div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="modalBlackout"></div>
    </>
  );
}

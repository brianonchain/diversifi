"use client";
import { useErrorMsgStore } from "@/store";

export default function ErrorModal() {
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;

  console.log("ErrorModal.tsx", time);

  const errorMsg = useErrorMsgStore((state) => state.errorMsg);
  const setErrorMsg = useErrorMsgStore((state) => state.setErrorMsg);

  return (
    <>
      {errorMsg ? (
        <div className="absolute z-[200]">
          <div className="errorModal">
            {/*--- content ---*/}
            <div className="modalXpadding overflow-y-auto">
              {/*---text---*/}
              <div className="errorModalFont py-[16px]">{errorMsg}</div>
              {/*--- button ---*/}
              <div className="modalButtonContainer">
                <button onClick={() => setErrorMsg("")} className="buttonPrimary sm:max-w-[300px]">
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modalBlackout"></div>
        </div>
      ) : null}
    </>
  );
}

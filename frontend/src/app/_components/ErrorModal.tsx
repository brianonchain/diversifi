const ErrorModal = ({ errorMsg, setErrorModal }: { errorMsg: any; setErrorModal: any }) => {
  return (
    <div className="absolute z-[200]">
      <div className="errorModal">
        {/*--- content ---*/}
        <div className="modalXpadding overflow-y-auto">
          {/*---text---*/}
          <div className="errorModalFont py-[16px]">{errorMsg}</div>
          {/*--- button ---*/}
          <div className="modalButtonContainer">
            <button onClick={() => setErrorModal(false)} className="buttonPrimary sm:max-w-[300px]">
              Close
            </button>
          </div>
        </div>
      </div>
      <div className="modalBlackout"></div>
    </div>
  );
};

export default ErrorModal;

const ErrorModal = ({ errorMsg, setErrorMsg }: { errorMsg: any; setErrorMsg: any }) => {
  return (
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
  );
};

export default ErrorModal;

import React from "react";

var inputReq = false;
var passReq = false;
const InputForm = ({
  inp_placeholder,
  pass_placeholder,
  inp_className,
  pass_className,
  onChange,
  onClick,
  inputName,
  passName,
  inputRequired,
  passRequired,
  buttonText,
}) => {
  React.useEffect(() => {
    if (inputRequired == undefined) inputReq = false;
    if (passRequired == undefined) passReq = false;
  }, []);
  return (
    <div className="center-wrapper">
      {inputReq && passReq ? (
        <React.Fragment>
          <input
            className={inp_className}
            placeholder={inp_placeholder}
            onChange={onChange}
            name={inputName}
            type="text"
          />
          <input
            className={pass_className}
            placeholder={pass_placeholder}
            onChange={onChange}
            name={passName}
            type="password"
          />
          <div className="btn" onClick={onClick}>
            {buttonText}
          </div>
        </React.Fragment>
      ) : inputReq && !passReq ? (
        <React.Fragment>
          <input
            className={inp_className}
            placeholder={inp_placeholder}
            onChange={onChange}
            name={inputName}
            type="text"
          />
          <div className="btn" onClick={onClick}>
            {buttonText}
          </div>
        </React.Fragment>
      ) : !inputReq && passReq ? (
        <React.Fragment>
          <input
            className={pass_className}
            placeholder={pass_placeholder}
            onChange={onChange}
            name={passName}
            type="password"
          />
          <div className="btn" onClick={onClick}>
            {buttonText}
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default InputForm;

// <InputForm
//   inp_placeholder={}
//   pass_placeholder={}
//   inp_className={}
//   pass_className={}
//   onChange={}
//   onClick={}
//   inputName={}
//   passName={}
//   inputRequired={}
//   passRequired={}
//   buttonText={}
// />
